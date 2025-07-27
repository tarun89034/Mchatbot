# Use official Python 3.11 image
FROM python:3.11-slim

# Set work directory
WORKDIR /app

# Copy requirements and install
COPY requirements.txt ./
RUN pip install --upgrade pip && pip install -r requirements.txt

# Copy the rest of the backend code
COPY . .

# Expose the port FastAPI will run on
EXPOSE 8000

# Command to run the app
CMD ["uvicorn", "app:app", "--host", "0.0.0.0", "--port", "8000"] 