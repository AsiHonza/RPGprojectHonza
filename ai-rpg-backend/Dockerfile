FROM python:3.11-slim

# Set environment variables
ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1 \
    PORT=8000

WORKDIR /app

# Install uv for fast dependency resolution
RUN pip install uv

# Copy requirements or lockfile. For now we will generate requirements.txt from uv
COPY requirements.txt .

# Install dependencies
RUN uv pip install --system -r requirements.txt

# Copy the rest of the application
COPY . .

# Expose port
EXPOSE 8000

# Command to run the application
CMD uvicorn main:app --host 0.0.0.0 --port ${PORT}
