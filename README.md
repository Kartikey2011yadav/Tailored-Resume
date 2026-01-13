# Tailored-Resume

Tailored-Resume is an AI-powered web application designed to generate professional, ATS-optimized LaTeX resumes. It takes a "Master Resume" (JSON) and a Job Description, uses an AI "Brain" to select the most relevant experience and skills, and compiles a high-quality PDF using Tectonic.

## 🚀 Features

- **Data-First Approach**: Edit your resume as JSON data, not design.
- **AI Tailoring**: Automatically optimizes bullet points and selects projects based on the Job Description.
- **Zero-Config PDF**: Uses [Tectonic](https://tectonic-typesetting.github.io/) for reproducible, fast LaTeX compilation.
- **Monorepo Structure**: Frontend and Backend in a single repository for easy development.
- **Modern Stack**:
  - **Frontend**: Next.js (App Router), Tailwind CSS, Shadcn/UI.
  - **Backend**: FastAPI (Python), LangChain, SQLModel.

## 🛠️ Technology Stack

| Component      | Technology   | Description                                 |
| -------------- | ------------ | ------------------------------------------- |
| **Frontend**   | Next.js      | React framework for the dashboard and form. |
| **Styling**    | Tailwind CSS | Utility-first CSS framework.                |
| **UI Lib**     | Shadcn/UI    | Reusable components built with Radix UI.    |
| **Backend**    | FastAPI      | High-performance Python API.                |
| **Data Gen**   | LangChain    | Framework for LLM integration (stubbed).    |
| **PDF Engine** | Tectonic     | Rust-based LaTeX engine.                    |
| **Schema**     | JSON Schema  | Robust validation for Master Resume format. |

## 🏁 Getting Started

### Prerequisites

- **Node.js**: v18 or higher.
- **Python**: v3.10 or higher.
- **Tectonic**: Install via package manager:
  - Windows (Scoop): `scoop install tectonic`
  - macOS (Brew): `brew install tectonic`
  - Linux: `apt-get install tectonic`
- **Make** (Optional): For using the Makefile.

### Installation & Run

We recommend using the provided `Makefile` for convenience.

#### 1. Quick Start (Windows with manage.ps1)

We have provided a PowerShell script for easy management on Windows.

**Install Dependencies:**

```powershell
.\manage.ps1 install
```

**Run Development Servers:**
You will need two terminal windows:

Terminal 1 (Backend):

```powershell
.\manage.ps1 dev-backend
```

Terminal 2 (Frontend):

```powershell
.\manage.ps1 dev-frontend
```

#### 2. Alternative (with Make)

If you have `make` installed (e.g. via Chocolatey or WSL):

```bash
make install
make dev-backend
make dev-frontend
```

#### 3. Manual Setup

#### 2. Manual Setup

If you don't have `make` or prefer manual steps:

**Backend:**

```bash
# Create venv
python -m venv backend/venv

# Activate (Windows PowerShell)
.\backend\venv\Scripts\Activate.ps1
# Activate (Bash)
# source backend/venv/bin/activate

# Install
pip install -r backend/requirements.txt

# Run
cd backend
uvicorn main:app --reload
```

**Frontend:**

```bash
cd frontend
npm install
npm run dev
```

## 📂 Project Structure

- **/frontend**: Next.js application.
- **/backend**: FastAPI application.
- **/shared**: Shared resources like `schema.json`.
- **/templates**: LaTeX templates (`resume.tex`).
- **/docs**: Detailed documentation.

## 📖 Documentation

For more detailed information, please refer to the `docs/` folder:

- [Architecture & System Design](docs/ARCHITECTURE.md)
- [Mechanisms & AI Logic](docs/MECHANISMS.md)
