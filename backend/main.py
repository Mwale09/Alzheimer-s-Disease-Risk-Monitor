from fastapi import FastAPI, HTTPException, Depends, status
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from fastapi.security import OAuth2PasswordRequestForm
from datetime import timedelta
from schemas import PredictionRequest, PredictionResponse, BatchPredictionRequest, BatchPredictionResponse, UserCreate, UserResponse, Token
from ml_service import predictor
from database import SessionLocal, engine, init_db, get_db, Patient, GeneticVariant, Prediction as PredictionModel, User
from auth import get_current_user, get_password_hash, verify_password, create_access_token, ACCESS_TOKEN_EXPIRE_MINUTES
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

@app.post("/register", response_model=UserResponse)
def register(user: UserCreate, db: Session = Depends(get_db)):
    db_user = db.query(User).filter(User.username == user.username).first()
    if db_user:
        raise HTTPException(status_code=400, detail="Username already registered")
    hashed_password = get_password_hash(user.password)
    new_user = User(username=user.username, hashed_password=hashed_password)
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    return new_user

@app.post("/login", response_model=Token)
def login(form_data: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)):
    user = db.query(User).filter(User.username == form_data.username).first()
    if not user or not verify_password(form_data.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": user.username}, expires_delta=access_token_expires
    )
    return {"access_token": access_token, "token_type": "bearer"}

@app.post("/predict", response_model=PredictionResponse)
def predict(request: PredictionRequest, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    result = run_single_prediction(request.patient_data, request.model_type, db, current_user.id)
    return result

@app.post("/predict/batch", response_model=BatchPredictionResponse)
def predict_batch(request: BatchPredictionRequest, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    results = []
    for patient_data in request.patients:
        try:
            result = run_single_prediction(patient_data, request.model_type, db, current_user.id)
            results.append(result)
        except Exception as e:
            print(f"Error in batch for patient {patient_data.name}: {e}")
            # Continue with others even if one fails
    return {"results": results}

def run_single_prediction(data, model_type, db, current_user_id=None):
    try:
        # ML Prediction
        risk_score, category, shap_dict, contributions, metrics = predictor.predict(data.dict(), model_type)
        
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
            user_id=current_user_id,
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
            "top_contributing_factors": contributions,
            "model_metrics": metrics
        }
    except Exception as e:
        db.rollback()
        raise e

@app.get("/history")
def get_history(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    predictions = db.query(PredictionModel).filter(PredictionModel.user_id == current_user.id).all()
    results = []
    for p in predictions:
        patient = p.patient
        results.append({
            "id": p.id,
            "patient_name": patient.name,
            "age": patient.age,
            "gender": patient.gender,
            "model": p.model_type,
            "risk": p.risk_category,
            "score": f"{p.risk_score*100:.1f}%",
            "date": p.created_at.strftime("%Y-%m-%d %H:%M")
        })
    return results

@app.get("/history/{prediction_id}")
def get_prediction_detail(prediction_id: int, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    prediction = db.query(PredictionModel).filter(PredictionModel.id == prediction_id, PredictionModel.user_id == current_user.id).first()
    if not prediction:
        raise HTTPException(status_code=404, detail="Prediction not found")
    
    patient = prediction.patient
    # Reconstruct the response format used by /predict
    return {
        "id": prediction.id,
        "patient_name": patient.name,
        "age": patient.age,
        "gender": patient.gender,
        "risk_score": prediction.risk_score,
        "risk_category": prediction.risk_category,
        "top_contributing_factors": json.loads(prediction.contributions) if isinstance(prediction.contributions, str) else prediction.contributions,
        "model_type": prediction.model_type,
        "date": prediction.created_at.strftime("%Y-%m-%d %H:%M")
    }

@app.get("/")
def root():
    return {"message": "Welcome to AD Risk Prediction API"}
