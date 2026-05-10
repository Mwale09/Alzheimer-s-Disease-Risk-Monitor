from pydantic import BaseModel
from typing import List, Optional, Any

class Token(BaseModel):
    access_token: str
    token_type: str

class UserCreate(BaseModel):
    username: str
    password: str

class UserResponse(BaseModel):
    id: int
    username: str
    is_active: bool

    class Config:
        from_attributes = True

class GeneticVariant(BaseModel):
    variant_id: str
    gene: str
    genotype: str
    allele_frequency: float

class PatientData(BaseModel):
    name: str = "Anonymous"
    age: int
    gender: str # "Male", "Female"
    education_level: Optional[int] = 12
    family_history: bool = False
    variants: List[GeneticVariant] = []

class PredictionRequest(BaseModel):
    patient_data: PatientData
    model_type: str = "XGBoost"
    

class PredictionResponse(BaseModel):
    patient_name: str = "Anonymous"
    risk_score: float
    risk_category: str # "Low", "Moderate", "High"
    shap_values: dict # Feature name -> SHAP value
    top_contributing_factors: List[dict]
    model_metrics: Optional[dict] = None

class BatchPredictionRequest(BaseModel):
    patients: List[PatientData]
    model_type: str = "XGBoost"

class BatchPredictionResponse(BaseModel):
    results: List[PredictionResponse]
class PasswordUpdate(BaseModel):
    new_password: str
