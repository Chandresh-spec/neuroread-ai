# Multi-stage/production Dockerfile for NeuroReader on AWS EC2
FROM python:3.12-slim

# Prevent Python from writing .pyc files and enable unbuffered output for real-time logging
ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1 \
    DEBIAN_FRONTEND=noninteractive

# Set container working directory
WORKDIR /app

# Install system dependencies (build-essential, curl for healthcheck)
RUN apt-get update && apt-get install -y --no-install-recommends \
    build-essential \
    curl \
    && rm -rf /var/lib/apt/lists/*

# Install Python dependencies first (leverages Docker cache layer)
COPY requirements.txt /app/
RUN pip install --no-cache-dir --upgrade pip && \
    pip install --no-cache-dir -r requirements.txt

# Copy application source code
COPY . /app/

# Convert entrypoint script to unix line endings and make it executable
RUN sed -i 's/\r$//' /app/entrypoint.sh && \
    chmod +x /app/entrypoint.sh

# Expose Django Gunicorn port
EXPOSE 8000

# Set entrypoint to run migrations and collectstatic, then launch Gunicorn
ENTRYPOINT ["/app/entrypoint.sh"]
CMD ["gunicorn", "Zsquad.wsgi:application", "--bind", "0.0.0.0:8000", "--workers", "3", "--timeout", "120"]
