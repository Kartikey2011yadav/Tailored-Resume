from fastapi import APIRouter, HTTPException
from fastapi.responses import FileResponse
from pydantic import BaseModel
from app.models import MasterResume, TailoredResume
from app.services.ai_brain import tailor_resume
from app.services.pdf_generator import generate_latex, compile_pdf

router = APIRouter()

class TailorRequest(BaseModel):
    resume: MasterResume
    job_description: str

@router.post("/tailor", response_model=TailoredResume)
async def tailor_resume_endpoint(request: TailorRequest):
    """
    Tailor a resume based on the job description.
    """
    try:
        tailored = await tailor_resume(request.resume, request.job_description)
        tailored.job_description = request.job_description
        return tailored
    except Exception as e:
        # Log error in production
        print(f"Error tailoring resume: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/generate-pdf")
async def generate_pdf_endpoint(resume: TailoredResume):
    """
    Generate a PDF from the provided resume data.
    """
    try:
        latex = generate_latex(resume)
        # Use safe filename
        safe_name = "".join(c for c in resume.basics.name if c.isalnum() or c in (' ','_','-')).rstrip()
        filename = f"resume_{safe_name.replace(' ', '_')}.pdf"
        
        pdf_path = compile_pdf(latex, output_filename=filename)
        return FileResponse(pdf_path, media_type="application/pdf", filename=filename)
    except Exception as e:
        print(f"Error generating PDF: {e}")
        raise HTTPException(status_code=500, detail=str(e))
