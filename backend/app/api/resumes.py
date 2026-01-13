from fastapi import APIRouter, Depends, HTTPException
from typing import List
from uuid import UUID
from sqlmodel import Session, select
from app.db import get_session
from app.models import Resume, User
from app.api.auth import get_current_user

router = APIRouter()

@router.post("/", response_model=Resume)
def create_resume(
    resume: Resume, 
    session: Session = Depends(get_session),
    user: User = Depends(get_current_user)
):
    resume.user_id = user.id
    session.add(resume)
    session.commit()
    session.refresh(resume)
    return resume

@router.get("/", response_model=List[Resume])
def list_resumes(
    session: Session = Depends(get_session),
    user: User = Depends(get_current_user)
):
    resumes = session.exec(select(Resume).where(Resume.user_id == user.id)).all()
    return resumes

@router.get("/{resume_id}", response_model=Resume)
def get_resume(
    resume_id: UUID, 
    session: Session = Depends(get_session),
    user: User = Depends(get_current_user)
):
    resume = session.exec(select(Resume).where(Resume.id == resume_id, Resume.user_id == user.id)).first()
    if not resume:
        raise HTTPException(status_code=404, detail="Resume not found")
    return resume

@router.delete("/{resume_id}")
def delete_resume(
    resume_id: UUID, 
    session: Session = Depends(get_session),
    user: User = Depends(get_current_user)
):
    resume = session.exec(select(Resume).where(Resume.id == resume_id, Resume.user_id == user.id)).first()
    if not resume:
        raise HTTPException(status_code=404, detail="Resume not found")
    session.delete(resume)
    session.commit()
    return {"ok": True}

@router.patch("/{resume_id}", response_model=Resume)
def update_resume(
    resume_id: UUID, 
    resume_data: Resume, 
    session: Session = Depends(get_session),
    user: User = Depends(get_current_user)
):
    resume = session.exec(select(Resume).where(Resume.id == resume_id, Resume.user_id == user.id)).first()
    if not resume:
        raise HTTPException(status_code=404, detail="Resume not found")
    
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
