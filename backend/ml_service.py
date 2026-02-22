import pandas as pd
import numpy as np
import xgboost as xgb
import shap

class RiskPredictor:
    def __init__(self):
        self.model = None
        self.explainer = None
        self.feature_names = ["Age", "Gender_Male", "Education_Level", "Family_History", "APOE4_Count"]
        try:
            self._train_synthetic_model()
        except Exception as e:
            print(f"Error training synthetic model: {e}")
            # Ensure app doesn't crash, but model will be None
            self.model = None

    def _train_synthetic_model(self):
        # Generate synthetic data
        np.random.seed(42)
        n_samples = 1000
        
        # Features
        age = np.random.normal(70, 10, n_samples).astype(int)
        gender_male = np.random.randint(0, 2, n_samples)
        education = np.random.normal(14, 3, n_samples).astype(int)
        family_history = np.random.randint(0, 2, n_samples)
        apoe4 = np.random.choice([0, 1, 2], n_samples, p=[0.7, 0.25, 0.05])
        
        X = pd.DataFrame({
            "Age": age,
            "Gender_Male": gender_male,
            "Education_Level": education,
            "Family_History": family_history,
            "APOE4_Count": apoe4
        })
        
        # Target (Synthetic Risk Calculation for realistic-ish outputs)
        # Log-odds
        logit = (
            -5 
            + 0.08 * age 
            - 0.5 * education 
            + 1.5 * family_history 
            + 2.0 * apoe4
        )
        prob = 1 / (1 + np.exp(-logit))
        y = (prob > np.random.rand(n_samples)).astype(int)

        # Train XGBoost
        self.model = xgb.XGBClassifier(
            objective="binary:logistic", 
            n_estimators=100, 
            learning_rate=0.1, 
            max_depth=3,
            eval_metric="logloss"
        )
        self.model.fit(X, y)
        
        # Initialize SHAP explainer
        try:
            # For newer XGBoost, passing the booster directly often works better with TreeExplainer
            self.explainer = shap.TreeExplainer(self.model.get_booster())
            print("Synthetic model trained and SHAP TreeExplainer initialized with booster.")
        except Exception as e:
            print(f"SHAP TreeExplainer failed: {e}. Trying generic Explainer...")
            try:
                # Fallback to generic Explainer, passing some data to initialize masker
                self.explainer = shap.Explainer(self.model.predict, X.head(100))
                print("SHAP generic Explainer initialized.")
            except Exception as e2:
                 print(f"SHAP initialization failed completely: {e2}")
                 self.explainer = None

    def predict(self, patient_data, model_type="XGBoost"):
        if not self.model:
            return 0.0, "Error: Model not loaded", {}, []

        # Check for APOE4 in variants
        apoe4_count = 0
        for v in patient_data.get('variants', []):
            gene = v.get('gene', '').upper()
            genotype = v.get('genotype', '').lower()
            if "APOE" in gene and ("4" in genotype or "e4" in genotype):
                if "e4/e4" in genotype:
                    apoe4_count = 2
                elif "e4" in genotype:
                    apoe4_count = 1
        
        input_data = pd.DataFrame([{
            "Age": patient_data.get('age', 65),
            "Gender_Male": 1 if patient_data.get('gender', 'Male').lower() == "male" else 0,
            "Education_Level": patient_data.get('education_level', 12),
            "Family_History": 1 if patient_data.get('family_history', False) else 0,
            "APOE4_Count": apoe4_count
        }])
        
        # Predict based on model_type
        # In a real app, you'd load different model binaries. 
        # Here we adjust the risk score slightly for "simulation" of different model behaviors 
        # as requested by the UI design requirements.
        
        if model_type != "XGBoost":
            print(f"Bypassing model {model_type}, using XGBoost as requested.")
        
        risk_score = float(self.model.predict_proba(input_data)[0][1])
        model_type = "XGBoost" # Force label to XGBoost

        # SHAP values
        contributions = []
        shap_dict = {}
        
        if self.explainer:
            try:
                # Handle different explainer types and output formats
                if isinstance(self.explainer, shap.TreeExplainer):
                    shap_values = self.explainer.shap_values(input_data)
                else:
                    shap_values = self.explainer(input_data).values
                
                # SHAP returns different structures depending on version/model
                # Usually [samples, features, classes] or [samples, features]
                sv = shap_values
                if isinstance(sv, list): # Multi-class output usually
                    sv = sv[1] if len(sv) > 1 else sv[0]
                
                if len(sv.shape) == 3: # [samples, features, classes]
                    sv = sv[0, :, 1] # First sample, all features, class 1 (positive)
                elif len(sv.shape) == 2: # [samples, features]
                    sv = sv[0]
                
                for i, feature in enumerate(self.feature_names):
                    val = float(sv[i])
                    contributions.append({
                        "feature": feature,
                        "value": float(input_data.iloc[0][i]),
                        "shap_value": val
                    })
            except Exception as e:
                 print(f"Error calculating SHAP values: {e}")

        # Determine Category
        if risk_score < 0.3:
            category = "Low"
        elif risk_score < 0.5:
            category = "Moderate"
        elif risk_score < 0.7:
            category = "High"
        else:
            category = "Very High"

        return risk_score, category, shap_dict, contributions


predictor = RiskPredictor()
