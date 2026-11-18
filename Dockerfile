
# Stage 1: build frontend
FROM node:22-slim AS frontend-build
WORKDIR /app/GatorTraderFrontend
COPY GatorTraderFrontend/package*.json ./
RUN npm ci
COPY GatorTraderFrontend ./
RUN npm run build

# Stage 2: backend
FROM python:3.9-slim
ENV PYTHONUNBUFFERED=1
RUN apt-get update && apt-get install -y --no-install-recommends libmagic1 && rm -rf /var/lib/apt/lists/*
WORKDIR /app/GatorTraderBackend
COPY GatorTraderBackend/requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt
COPY GatorTraderBackend ./
COPY --from=frontend-build /app/GatorTraderFrontend/dist /app/GatorTraderFrontend/dist
CMD ["sh", "-c", "python initdb.py && gunicorn -w 4 -b 0.0.0.0:80 main:app"]
