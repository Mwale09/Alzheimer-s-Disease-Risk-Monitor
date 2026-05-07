import pandas as pd
import sys
sys.path.append('c:\\Users\\mwale\\AD Risk Prediction\\backend')
from ml_service import predictor

def test_shap():
    data = {"age": 70, "gender": "Female", "education_level": 12, "family_history": True, "variants": []}
    risk_score, category, shap_dict, contributions, metrics = predictor.predict(data, "XGBoost")
    print("Contributions length:", len(contributions))
    print("Risk score:", risk_score)

if __name__ == '__main__':
    test_shap()
