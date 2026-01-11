FROM python:3.12-slim

# ---- Environment ----
ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1

# ---- Workdir ----
WORKDIR /app

# ---- System dependencies ----
RUN apt-get update && apt-get install -y \
    gcc \
    libpq-dev \
    libffi-dev \
    libssl-dev \
    libjpeg-dev \
    zlib1g-dev \
    curl \
    sudo \
    && rm -rf /var/lib/apt/lists/*

# ---- Create non-root user ----
# Use a more flexible UID/GID
ARG USER_ID=1003
ARG GROUP_ID=1000

RUN groupadd -g ${GROUP_ID} appuser && \
    useradd -l -u ${USER_ID} -g appuser appuser && \
    install -d -m 0755 -o appuser -g appuser /home/appuser

# ---- Python dependencies (cached layer) ----
COPY requirements.txt .
RUN pip install --upgrade pip \
    && pip install --no-cache-dir -r requirements.txt

# ---- App code ----
COPY . .

# ---- Fix permissions ----
RUN chown -R appuser:appuser /app

# ---- Switch to non-root user ----
USER appuser

# ---- Default command (override in docker-compose) ----
CMD ["gunicorn", "CoreApi.wsgi:application", "--bind", "0.0.0.0:8000"]