from .database import SessionLocal, engine
from .models import Base, Workout

Base.metadata.create_all(bind=engine)

def seed_workouts():
    db = SessionLocal()
    workouts = [
        {"name": "Push-ups", "description": "A basic upper body exercise.", "category": "Strength", "difficulty": "Beginner"},
        {"name": "Squats", "description": "A fundamental lower body movement.", "category": "Strength", "difficulty": "Beginner"},
        {"name": "Plank", "description": "Core stability exercise.", "category": "Core", "difficulty": "Beginner"},
        {"name": "Burpees", "description": "Full body exercise for strength and cardio.", "category": "Cardio", "difficulty": "Intermediate"},
        {"name": "Mountain Climbers", "description": "Cardio and core exercise.", "category": "Cardio", "difficulty": "Beginner"},
    ]
    for w in workouts:
        exists = db.query(Workout).filter(Workout.name == w["name"]).first()
        if not exists:
            db.add(Workout(**w))
    db.commit()
    db.close()
    print("Seeded workouts!")

if __name__ == "__main__":
    seed_workouts() 