
# Makefile

.PHONY: install-backend install-frontend dev-backend dev-frontend dev

install-backend:
	backend/venv/Scripts/python -m pip install -r backend/requirements.txt

install-frontend:
	cd frontend && npm install

install: install-backend install-frontend

dev-backend:
	backend/venv/Scripts/python -m uvicorn main:app --app-dir backend --reload --host 0.0.0.0 --port 8000

dev-frontend:
	cd frontend && npm run dev

dev:
	# Running both in parallel might require a tool like 'concurrently' or separate terminals
	# For make, we can just echo instructions
	@echo "Run 'make dev-backend' in one terminal and 'make dev-frontend' in another."
