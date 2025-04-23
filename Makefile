.PHONY: help setup-backend setup-frontend install-all run-backend run-frontend run-dev

# Define your virtual environment and flask app
VENV = myenv
FLASK_APP = app.py

help:
	@echo "Usage:"
	@echo "  make setup-backend     # Set up Python virtualenv and install backend deps"
	@echo "  make setup-frontend    # Install frontend (React) dependencies"
	@echo "  make install-all       # Setup both backend and frontend"
	@echo "  make run-backend       # Run Flask backend server"
	@echo "  make run-frontend      # Run React frontend dev server"
	@echo "  make run-dev           # Run both frontend and backend (requires tmux or terminal split)"

setup-backend:
	cd backend && python3 -m venv $(VENV) && . $(VENV)/bin/activate && pip install -r requirements.txt

setup-frontend:
	cd frontend && npm install

install-all: setup-backend setup-frontend

clean:
	cd backend && rm -rf $(VENV) && rm -rf __pycache__ && find . -name "*.pyc" -delete
	cd frontend && rm -rf node_modules
	cd frontend && rm -rf package-lock.json
	cd frontend && rm -rf build

reinstall: clean install-all
	@echo "Reinstalled backend and frontend dependencies"
	@echo "Please run 'make run-dev' to start the servers"

run-backend:
	cd backend && . $(VENV)/bin/activate && FLASK_APP=$(FLASK_APP) flask run

run-frontend:
	cd frontend && npm run dev

run-dev:
	@echo "Run backend and frontend in separate terminals or use tmux"
