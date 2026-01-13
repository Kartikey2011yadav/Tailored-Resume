import subprocess
import os
import shutil
from jinja2 import Environment, FileSystemLoader
from app.models import MasterResume

TECTONIC_CMD = "tectonic"
TEMPLATE_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), "../../../templates"))
OUTPUT_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), "../../../output"))

if not os.path.exists(OUTPUT_DIR):
    os.makedirs(OUTPUT_DIR)

def generate_latex(resume_data: MasterResume) -> str:
    env = Environment(loader=FileSystemLoader(TEMPLATE_DIR))
    template = env.get_template("resume.tex")
    
    # Jinja2 expects dicts usually, but Pydantic models work too if accessed properly
    # We dump to dict for safety with Jinja
    return template.render(resume_data.model_dump())

def compile_pdf(latex_content: str, output_filename: str = "resume.pdf") -> str:
    # Write latex to temp file
    tex_file = os.path.join(OUTPUT_DIR, "temp.tex")
    with open(tex_file, "w") as f:
        f.write(latex_content)
    
    # Run tectonic
    # tectonic -X compile temp.tex -o output_dir
    try:
        subprocess.run([TECTONIC_CMD, "-X", "compile", tex_file, "-o", OUTPUT_DIR], check=True, stdout=subprocess.PIPE, stderr=subprocess.PIPE)
    except FileNotFoundError:
        raise RuntimeError("Tectonic not found. Please install tectonic.")
    except subprocess.CalledProcessError as e:
        raise RuntimeError(f"Tectonic failed: {e.stderr.decode()}")

    pdf_path = os.path.join(OUTPUT_DIR, "temp.pdf")
    final_path = os.path.join(OUTPUT_DIR, output_filename)
    
    if os.path.exists(pdf_path):
        os.rename(pdf_path, final_path)
        return final_path
    else:
        raise RuntimeError("PDF file was not created.")
