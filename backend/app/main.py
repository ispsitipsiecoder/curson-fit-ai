from fastapi import FastAPI, Depends, HTTPException, status, Body, Query
from sqlalchemy.orm import Session
from . import models, schemas, crud, auth
from .database import SessionLocal, engine
from .schemas import Workout, WorkoutCreate, Meal, MealCreate
from pydantic import BaseModel
from datetime import date, timedelta

app = FastAPI()

models.Base.metadata.create_all(bind=engine)

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@app.get("/")
def read_root():
    return {"message": "Welcome to FitFuel AI API!"}

# Placeholder for user routes 

@app.post("/register", response_model=schemas.User)
def register(user: schemas.UserCreate, db: Session = Depends(get_db)):
    db_user = crud.get_user_by_email(db, email=user.email)
    if db_user:
        raise HTTPException(status_code=400, detail="Email already registered")
    return crud.create_user(db, user)

@app.post("/login")
def login(form_data: schemas.UserCreate, db: Session = Depends(get_db)):
    db_user = crud.get_user_by_email(db, email=form_data.email)
    if not db_user or not auth.verify_password(form_data.password, db_user.hashed_password):
        raise HTTPException(status_code=401, detail="Invalid credentials")
    access_token = auth.create_access_token(data={"sub": db_user.email})
    return {"access_token": access_token, "token_type": "bearer"}

@app.get("/workouts", response_model=list[Workout])
def list_workouts(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    return crud.get_workouts(db, skip=skip, limit=limit)

@app.post("/workouts", response_model=Workout)
def add_workout(workout: WorkoutCreate, db: Session = Depends(get_db)):
    return crud.create_workout(db, workout)

@app.get("/workouts/{workout_id}", response_model=Workout)
def get_workout(workout_id: int, db: Session = Depends(get_db)):
    db_workout = crud.get_workout_by_id(db, workout_id)
    if not db_workout:
        raise HTTPException(status_code=404, detail="Workout not found")
    return db_workout 

@app.get("/meals", response_model=list[Meal])
def list_meals(user_id: int = None, date: str = None, db: Session = Depends(get_db)):
    return crud.get_meals(db, user_id=user_id, date_=date)

@app.post("/meals", response_model=Meal)
def add_meal(meal: MealCreate, db: Session = Depends(get_db)):
    return crud.create_meal(db, meal)

@app.delete("/meals/{meal_id}", response_model=Meal)
def remove_meal(meal_id: int, db: Session = Depends(get_db)):
    meal = crud.delete_meal(db, meal_id)
    if not meal:
        raise HTTPException(status_code=404, detail="Meal not found")
    return meal 

class MealPlanRequest(BaseModel):
    age: int
    weight: float  # in kg
    height: float  # in cm
    gender: str  # 'male' or 'female'
    activity_level: str  # 'sedentary', 'light', 'moderate', 'active', 'very active'
    goal: str  # 'fat loss', 'maintenance', 'muscle gain'

activity_factors = {
    'sedentary': 1.2,
    'light': 1.375,
    'moderate': 1.55,
    'active': 1.725,
    'very active': 1.9
}

def calculate_targets(profile: MealPlanRequest):
    # Mifflin-St Jeor Equation
    if profile.gender == 'male':
        bmr = 10 * profile.weight + 6.25 * profile.height - 5 * profile.age + 5
    else:
        bmr = 10 * profile.weight + 6.25 * profile.height - 5 * profile.age - 161
    tdee = bmr * activity_factors.get(profile.activity_level, 1.2)
    if profile.goal == 'fat loss':
        calories = tdee - 500
    elif profile.goal == 'muscle gain':
        calories = tdee + 300
    else:
        calories = tdee
    # Macros: 30% protein, 40% carbs, 30% fats
    protein = (0.3 * calories) / 4
    carbs = (0.4 * calories) / 4
    fats = (0.3 * calories) / 9
    return int(calories), int(protein), int(carbs), int(fats)

@app.post("/mealplan")
def generate_mealplan(profile: MealPlanRequest):
    calories, protein, carbs, fats = calculate_targets(profile)
    # Simple rule-based meal plan
    plan = [
        {"name": "Oatmeal with Berries", "calories": int(0.2*calories), "protein": int(0.15*protein), "carbs": int(0.25*carbs), "fats": int(0.1*fats)},
        {"name": "Grilled Chicken Salad", "calories": int(0.25*calories), "protein": int(0.3*protein), "carbs": int(0.15*carbs), "fats": int(0.2*fats)},
        {"name": "Greek Yogurt Snack", "calories": int(0.1*calories), "protein": int(0.15*protein), "carbs": int(0.1*carbs), "fats": int(0.1*fats)},
        {"name": "Salmon with Rice & Veggies", "calories": int(0.3*calories), "protein": int(0.3*protein), "carbs": int(0.35*carbs), "fats": int(0.4*fats)},
        {"name": "Protein Shake", "calories": int(0.1*calories), "protein": int(0.1*protein), "carbs": int(0.1*carbs), "fats": int(0.1*fats)},
    ]
    return {
        "plan": plan,
        "totals": {
            "calories": sum(m["calories"] for m in plan),
            "protein": sum(m["protein"] for m in plan),
            "carbs": sum(m["carbs"] for m in plan),
            "fats": sum(m["fats"] for m in plan),
        },
        "targets": {"calories": calories, "protein": protein, "carbs": carbs, "fats": fats}
    } 

@app.get("/progress/nutrition")
def nutrition_progress(
    start_date: str = Query(...),
    end_date: str = Query(...),
    user_id: int = None,
    db: Session = Depends(get_db),
):
    # Parse dates
    start = date.fromisoformat(start_date)
    end = date.fromisoformat(end_date)
    days = (end - start).days + 1
    results = []
    for i in range(days):
        d = start + timedelta(days=i)
        meals = crud.get_meals(db, user_id=user_id, date_=d.isoformat())
        totals = {"date": d.isoformat(), "calories": 0, "protein": 0, "carbs": 0, "fats": 0}
        for m in meals:
            totals["calories"] += m.calories or 0
            totals["protein"] += m.protein or 0
            totals["carbs"] += m.carbs or 0
            totals["fats"] += m.fats or 0
        results.append(totals)
    return results 