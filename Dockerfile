# Use a slim Python base image for smaller footprint
FROM python:3.10-slim

# Set environment variables
ENV PYTHONDONTWRITEBYTECODE 1
ENV PYTHONUNBUFFERED 1

# Install system dependencies if needed (e.g., for database drivers, though not strictly necessary here)
RUN apt-get update \
    && apt-get install -y --no-install-recommends gcc build-essential \
    && rm -rf /var/lib/apt/lists/*

# Set the working directory in the container
WORKDIR /app

# Copy dependency files and install Python packages first (for better layer caching)
COPY requirements.txt .
RUN pip wheel --no-binary :all: --wheel-dir /usr/src/wheels -r requirements.txt

# Copy the rest of the application code
COPY . .

# Create a non-root user for security best practices
RUN useradd --no-create-home appuser
USER appuser

# Command to run the application using Gunicorn (a production WSGI server)
# We assume gunicorn will be installed via pip in the requirements.txt or we add it here.
# For this example, I'll assume 'gunicorn' is added to requirements.txt later if needed.
CMD ["gunicorn", "-w", "4", "-b", "0.0.0.0:5000", "app:app"]