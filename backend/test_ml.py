from ml_service import predictor
from schemas import PatientData, GeneticVariant

def test_prediction():
    print("Testing ML Service...")
    
    # Test Case 1: High Risk (75yo, e4/e4)
    data_high = PatientData(
        age=75,
        gender="Male",
        education_level=12,
        family_history=True,
        variants=[
            GeneticVariant(snp_id="rs429358", gene="APOE", genotype="e4/e4", allele_frequency=0.15)
        ]
    )
    
    score, cat, shap_d, contribs = predictor.predict(data_high.dict())
    print(f"High Risk Case: Score={score:.2f}, Category={cat}")
    assert score > 0.5, "Expected high score for high risk inputs"
    assert cat in ["Moderate", "High"]
    
    # Test Case 2: Low Risk (50yo, e3/e3)
    data_low = PatientData(
        age=50,
        gender="Female",
        education_level=16,
        family_history=False,
        variants=[
            GeneticVariant(snp_id="rs429358", gene="APOE", genotype="e3/e3", allele_frequency=0.15)
        ]
    )
    
    score, cat, shap_d, contribs = predictor.predict(data_low.dict())
    print(f"Low Risk Case: Score={score:.2f}, Category={cat}")
    assert score < 0.5, "Expected low score for low risk inputs"
    
    print("Verification Passed successfully.")

if __name__ == "__main__":
    test_prediction()
