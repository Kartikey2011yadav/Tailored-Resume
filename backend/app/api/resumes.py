from fastapi import APIRouter, Depends, HTTPException
from typing import List
from uuid import UUID
from sqlmodel import Session, select
from app.db import get_session
from app.models import Resume

router = APIRouter()

@router.post("/", response_model=Resume)
def create_resume(resume: Resume, session: Session = Depends(get_session)):
    session.add(resume)
    session.commit()
    session.refresh(resume)
    return resume

@router.get("/", response_model=List[Resume])
def list_resumes(session: Session = Depends(get_session)):
    resumes = session.exec(select(Resume)).all()
    return resumes

@router.get("/{resume_id}", response_model=Resume)
def get_resume(resume_id: UUID, session: Session = Depends(get_session)):
    resume = session.get(Resume, resume_id)
    if not resume:
        raise HTTPException(status_code=404, detail="Resume not found")
    return resume

@router.delete("/{resume_id}")
def delete_resume(resume_id: UUID, session: Session = Depends(get_session)):
    resume = session.get(Resume, resume_id)
    if not resume:
        raise HTTPException(status_code=404, detail="Resume not found")
    session.delete(resume)
    session.commit()
    return {"ok": True}

@router.patch("/{resume_id}", response_model=Resume)
def update_resume(resume_id: UUID, resume_data: Resume, session: Session = Depends(get_session)):
    resume = session.get(Resume, resume_id)
    if not resume:
        raise HTTPException(status_code=404, detail="Resume not found")
    
    # Update fields using exclude_unset=True logic manually or via Pydantic magic
    # Here we just iterate typical fields. A more robust way:
    # resume_data_dict = resume_data.model_dump(exclude_unset=True)
    # for key, value in resume_data_dict.items():
    #     setattr(resume, key, value)
    
    # Explicit update for safety + Pydantic-SQLModel quirkiness with JSON columns
    resume.title = resume_data.title
    resume.slug = resume_data.slug
    resume.basics = resume_data.basics
    resume.work = resume_data.work
    resume.education = resume_data.education
    resume.skills = resume_data.skills
    resume.projects = resume_data.projects
    resume.resume_metadata = resume_data.resume_metadata
    
    session.add(resume)
    session.commit()
    session.refresh(resume)
    return resume
