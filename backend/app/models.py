from typing import List, Optional, Dict, Any
from sqlmodel import SQLModel, Field, Relationship, JSON, Column
from uuid import UUID, uuid4
import datetime

# Shared Pydantic models (mirroring schema.json for validation)

class Location(SQLModel):
    address: Optional[str] = None
    postalCode: Optional[str] = None
    city: Optional[str] = None
    countryCode: Optional[str] = None
    region: Optional[str] = None

class Profile(SQLModel):
    network: Optional[str] = None
    username: Optional[str] = None
    url: Optional[str] = None

class Basics(SQLModel):
    name: str = "Your Name"
    label: Optional[str] = None
    email: str = "email@example.com"
    phone: Optional[str] = None
    url: Optional[str] = None
    summary: Optional[str] = None
    location: Optional[Location] = None
    profiles: List[Profile] = []

class Work(SQLModel):
    company: Optional[str] = None
    position: Optional[str] = None
    website: Optional[str] = None
    startDate: Optional[str] = None
    endDate: Optional[str] = None
    summary: Optional[str] = None
    highlights: List[str] = []

class Education(SQLModel):
    institution: Optional[str] = None
    area: Optional[str] = None
    studyType: Optional[str] = None
    startDate: Optional[str] = None
    endDate: Optional[str] = None
    score: Optional[str] = None
    courses: List[str] = []

class Skill(SQLModel):
    name: Optional[str] = None
    level: Optional[str] = None
    keywords: List[str] = []

class Project(SQLModel):
    name: Optional[str] = None
    description: Optional[str] = None
    highlights: List[str] = []
    keywords: List[str] = []
    startDate: Optional[str] = None
    endDate: Optional[str] = None
    url: Optional[str] = None
    roles: List[str] = []

class Metadata(SQLModel):
    template: str = "modern"
    layout: List[List[str]] = []
    css: Dict[str, Any] = {"value": "", "visible": False}
    theme: Dict[str, str] = {"text": "#000000", "background": "#ffffff", "primary": "#0000ff"}

class User(SQLModel, table=True):
    id: Optional[UUID] = Field(default_factory=uuid4, primary_key=True)
    email: str = Field(unique=True, index=True)
    hashed_password: str
    is_active: bool = True
    
    resumes: List["Resume"] = Relationship(back_populates="user")

# DB Model
class Resume(SQLModel, table=True):
    id: Optional[UUID] = Field(default_factory=uuid4, primary_key=True)
    title: str = "Untitled Resume"
    slug: str = Field(default=None, unique=True)
    
    # Store JSON data in JSON columns for flexibility with SQLModel/SQLite
    basics: Dict = Field(default_factory=dict, sa_column=Column(JSON))
    work: List[Dict] = Field(default_factory=list, sa_column=Column(JSON))
    education: List[Dict] = Field(default_factory=list, sa_column=Column(JSON))
    skills: List[Dict] = Field(default_factory=list, sa_column=Column(JSON))
    projects: List[Dict] = Field(default_factory=list, sa_column=Column(JSON))
    resume_metadata: Dict = Field(default_factory=dict, sa_column=Column(JSON))
    
    created_at: datetime.datetime = Field(default_factory=datetime.datetime.utcnow)
    updated_at: datetime.datetime = Field(default_factory=datetime.datetime.utcnow)

    user_id: Optional[UUID] = Field(default=None, foreign_key="user.id")
    user: Optional["User"] = Relationship(back_populates="resumes")

# API Models
class MasterResume(SQLModel):
    basics: Basics
    work: List[Work] = []
    education: List[Education] = []
    skills: List[Skill] = []
    projects: List[Project] = []
    resume_metadata: Metadata = Field(default_factory=Metadata)

class TailoredResume(MasterResume):
    job_description: Optional[str] = None
