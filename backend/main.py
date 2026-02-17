from fastapi import FastAPI, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware   # ADD THIS
from sqlalchemy.orm import Session
from schemas import PredictionRequest, PredictionResponse, BatchPredictionRequest, BatchPredictionResponse
from ml_service import predictor
from database import SessionLocal, engine, init_db, get_db, Patient, GeneticVariant, Prediction as PredictionModel
import json

# Initialize DB
init_db()

app = FastAPI(title="AD Risk Prediction API", version="1.0")

# ADD THIS BLOCK
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # allow frontend
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/health")
def health_check():
    return {"status": "healthy"}

@app.post("/predict", response_model=PredictionResponse)
def predict(request: PredictionRequest, db: Session = Depends(get_db)):
    result = run_single_prediction(request.patient_data, request.model_type, db)
    return result

@app.post("/predict/batch", response_model=BatchPredictionResponse)
def predict_batch(request: BatchPredictionRequest, db: Session = Depends(get_db)):
    results = []
    for patient_data in request.patients:
        try:
            result = run_single_prediction(patient_data, request.model_type, db)
            results.append(result)
        except Exception as e:
            print(f"Error in batch for patient {patient_data.name}: {e}")
            # Continue with others even if one fails
    return {"results": results}

def run_single_prediction(data, model_type, db):
    try:
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
            "patient_name": data.name,
            "risk_score": risk_score,
            "risk_category": category,
            "shap_values": shap_dict,
            "top_contributing_factors": contributions
        }
    except Exception as e:
        db.rollback()
        raise e

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
