FROM python:3.11-slim

# Prevent interactive prompts during package installation
ARG DEBIAN_FRONTEND=noninteractive

# Install git so we can clone the repo
RUN apt-get update && apt-get install -y git && rm -rf /var/lib/apt/lists/*

# Clone your repository
RUN git clone https://github.com/spadeguy1-cloud/Swilliams-landing-page.git /app

# Set the working directory
WORKDIR /app

# Serve the static site on port 8000
CMD ["python", "-m", "http.server", "8000", "--bind", "0.0.0.0"]
