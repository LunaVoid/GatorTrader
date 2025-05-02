# Stage 1: Build the React frontend
FROM node:18 AS frontend-build

# Copy frontend files
COPY GatorTraderFrontend /app/GatorTraderFrontend
WORKDIR /app/GatorTraderFrontend
ENV FLASK_ENV=production
ENV PYTHONUNBUFFERED=1
RUN rm -rf node_modules
# Install dependencies and build
RUN npm install
RUN npm run build

# Stage 2: Setup Python backend
FROM python:3.9

# Create the directory structure
RUN mkdir -p /app/GatorTraderBackend /app/GatorTraderFrontend/dist

# Copy the built frontend
COPY --from=frontend-build /app/GatorTraderFrontend/dist /app/GatorTraderFrontend/dist

# Copy backend files
COPY GatorTraderBackend /app/GatorTraderBackend

# Set working directory to backend
WORKDIR /app/GatorTraderBackend

# Install dependencies
RUN pip install -r requirements.txt

# Command to run
CMD ["sh", "-c", "python initdb.py && gunicorn -w 4 -b 0.0.0.0:80 main:app"]
