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
            use_label_encoder=False,
            eval_metric="logloss"
        )
        self.model.fit(X, y)
        
        # Initialize SHAP explainer
        try:
            self.explainer = shap.TreeExplainer(self.model)
            print("Synthetic model trained and SHAP explainer initialized.")
        except Exception as e:
            print(f"SHAP initialization failed: {e}")
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
        
        raw_risk = float(self.model.predict_proba(input_data)[0][1])
        
        if model_type == "Random Forest":
            risk_score = min(0.99, max(0.01, raw_risk * 1.05))
        elif model_type == "Deep Neural Network":
            risk_score = min(0.99, max(0.01, raw_risk * 0.95))
        elif model_type == "Support Vector Machine":
            risk_score = min(0.99, max(0.01, raw_risk * 0.98))
        else: # XGBoost
            risk_score = raw_risk

        # SHAP values
        contributions = []
        shap_dict = {}
        
        if self.explainer:
            try:
                shap_values = self.explainer.shap_values(input_data)
                sv = shap_values[0] if isinstance(shap_values, list) else shap_values
                if len(sv.shape) > 1:
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
