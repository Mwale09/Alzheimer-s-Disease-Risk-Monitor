from fastapi import FastAPI, HTTPException, Depends
from sqlalchemy.orm import Session
from schemas import PredictionRequest, PredictionResponse
from ml_service import predictor
from database import SessionLocal, engine, init_db, get_db, Patient, GeneticVariant, Prediction as PredictionModel
import json

# Initialize DB
init_db()

app = FastAPI(title="AD Risk Prediction API", version="1.0")

@app.get("/health")
def health_check():
    return {"status": "healthy"}

@app.post("/predict", response_model=PredictionResponse)
def predict(request: PredictionRequest, db: Session = Depends(get_db)):
    try:
        data = request.patient_data
        model_type = request.model_type
        
        # ML Prediction
        risk_score, category, shap_dict, contributions = predictor.predict(data.dict(), model_type)
        
        # Persist to Database
        db_patient = Patient(
            name=data.name,
            age=data.age,
            gender=data.gender,
            education_level=data.education_level,
            family_history=data.family_history
        )
        db.add(db_patient)
        db.commit()
        db.refresh(db_patient)
        
        for v in data.variants:
            db_variant = GeneticVariant(
                patient_id=db_patient.id,
                variant_id=v.variant_id,
                gene=v.gene,
                genotype=v.genotype,
                allele_frequency=v.allele_frequency
            )
            db.add(db_variant)
        
        db_prediction = PredictionModel(
            patient_id=db_patient.id,
            model_type=model_type,
            risk_score=risk_score,
            risk_category=category,
            contributions=contributions
        )
        db.add(db_prediction)
        db.commit()
        
        return {
            "risk_score": risk_score,
            "risk_category": category,
            "shap_values": shap_dict, # Keeping for schema compat, though we use contributions mostly
            "top_contributing_factors": contributions
        }
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/history")
def get_history(db: Session = Depends(get_db)):
    predictions = db.query(PredictionModel).all()
    results = []
    for p in predictions:
        patient = p.patient
        results.append({
            "id": p.id,
            "patient_name": patient.name,
            "age": patient.age,
            "model": p.model_type,
            "risk": p.risk_category,
            "score": f"{p.risk_score*100:.1f}%",
            "date": p.created_at.strftime("%Y-%m-%d %H:%M")
        })
    return results

@app.get("/")
def root():
    return {"message": "Welcome to AD Risk Prediction API"}
