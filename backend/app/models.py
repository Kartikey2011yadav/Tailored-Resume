from typing import List, Optional
from sqlmodel import SQLModel, Field, Relationship

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
    name: str
    label: Optional[str] = None
    email: str
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

class MasterResume(SQLModel):
    basics: Basics
    work: List[Work] = []
    education: List[Education] = []
    skills: List[Skill] = []
    projects: List[Project] = []

class TailoredResume(MasterResume):
    job_description: Optional[str] = None
