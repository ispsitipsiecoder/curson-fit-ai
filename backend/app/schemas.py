from pydantic import BaseModel, EmailStr
from datetime import date

class UserBase(BaseModel):
    email: EmailStr
    full_name: str | None = None

class UserCreate(UserBase):
    password: str

class User(UserBase):
    id: int
    class Config:
        orm_mode = True

class WorkoutBase(BaseModel):
    name: str
    description: str | None = None
    category: str | None = None
    difficulty: str | None = None

class WorkoutCreate(WorkoutBase):
    pass

class Workout(WorkoutBase):
    id: int
    class Config:
        orm_mode = True

class MealBase(BaseModel):
    name: str
    calories: float
    protein: float | None = None
    carbs: float | None = None
    fats: float | None = None
    date: date
    user_id: int | None = None

class MealCreate(MealBase):
    pass

class Meal(MealBase):
    id: int
    class Config:
        orm_mode = True 