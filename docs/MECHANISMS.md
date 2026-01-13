# Mechanisms & Internals

This document details the specific internal mechanisms used in Tailored-Resume, explaining "how it works" under the hood.

## 1. The "AI Brain" Mechanism

The AI Brain (`backend/app/services/ai_brain.py`) is responsible for semantic understanding of the Job Description (JD) and the Resume.

### Current Implementation (Stub)

Currently, the brain is a functional stub that performs:

- **Project Selection**: Truncates projects to the top 3 to fit on a page.
- **Summary Tagging**: Appends `[Tailored]` to the summary to demonstrate modification.

### Planned Implementation (LLM)

In the production version, this service will:

1. **Embed** the JD to extract key technical skills (e.g., "Python", "AWS", "CI/CD").
2. **Score** each project in `Master Resume` against these skills.
3. **Rewrite** bullet points using an LLM (e.g., GPT-4o) to emphasize relevant experience.
   - _Input_: "Built a web app." + JD Skill "Scalability"
   - _Output_: "Architected a scalable web application handling 10k users..."

## 2. The PDF Generation Pipeline

We use **Tectonic** instead of `pdflatex` because Tectonic automatically downloads required LaTeX packages, eliminating the need for a massive multi-gigabyte TexLive installation.

**Steps:**

1. **Jinja2 Rendering**:
   The `MasterResume` Pydantic model is dumped to a dictionary (`model_dump()`). Jinja2 replaces placeholders in `templates/resume.tex`:

   ```latex
   \textbf{ {{ basics.name }} }
   ```

   becomes

   ```latex
   \textbf{ Jane Doe }
   ```

2. **File IO**:
   The rendered LaTeX string is written to a temporary file `output/temp.tex`.

3. **Subprocess Call**:
   Python calls the tectonic binary:

   ```python
   subprocess.run(["tectonic", "-X", "compile", tex_file, "-o", OUTPUT_DIR])
   ```

4. **Cleanup**:
   The resulting PDF is read and streamed back to the user. Temporary files can be cleaned up (or kept for debugging).

## 3. Frontend "Split View" Logic

The Frontend is designed for a "Review before Commit" workflow.

- **State A (Input)**: The Left panel contains the raw inputs.
- **State B (Tailored)**: The Right panel is initially empty. After calling `/api/tailor`, it populates with the _result_ of the AI process.
- **Editing**: The user can manually tweak the JSON in the Right panel if the AI missed something. This "Human-in-the-loop" design ensures the final PDF is exactly what the user wants.
