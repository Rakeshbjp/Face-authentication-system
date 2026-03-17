# ─────────────────────────────────────────────────
#  Face Auth Backend — Production Dockerfile
# ─────────────────────────────────────────────────

FROM python:3.11-slim

# System dependencies for OpenCV, MediaPipe, and image processing
RUN apt-get update && apt-get install -y --no-install-recommends \
    libgl1-mesa-glx \
    libglib2.0-0 \
    libsm6 \
    libxext6 \
    libxrender-dev \
    libgomp1 \
    && rm -rf /var/lib/apt/lists/*

# Set working directory
WORKDIR /app

# Copy requirements first (caching layer)
COPY requirements.txt .
RUN pip install --no-cache-dir --upgrade pip && \
    pip install --no-cache-dir -r requirements.txt && \
    pip install --no-cache-dir gunicorn

# Copy application code
COPY . .

# Expose port (Render injects PORT env var)
EXPOSE 8000

# Production server command
# Render sets PORT via env var; default to 8000
CMD ["sh", "-c", "gunicorn main:app --workers 2 --worker-class uvicorn.workers.UvicornWorker --bind 0.0.0.0:${PORT:-8000} --timeout 120 --graceful-timeout 30"]
