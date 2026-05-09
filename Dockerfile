# Trivia Maze – Team Delta
# Clones https://github.com/citronoiseau/S504_TriviaMaze_TeamDelta and runs the CLI.
#
# Build:
#   docker build -t trivia-maze .
#
# Run (interactive — the game requires stdin/stdout):
#   docker run -it trivia-maze

FROM python:3.11-slim

# Install git and minimal system libs needed by sqlmodel/SQLite
ARG DEBIAN_FRONTEND=noninteractive
RUN apt-get update \
    && apt-get install -y --no-install-recommends git \
    && rm -rf /var/lib/apt/lists/*

# Clone the repository into /app
RUN git clone https://github.com/citronoiseau/S504_TriviaMaze_TeamDelta.git /app

WORKDIR /app

# Install dependencies.
# pygame-ce is listed in requirements.txt but is only used by the optional
# 3-D renderer (pygame_3d.py).  The CLI (main.py) does not import pygame,
# so we install all deps but the container does not need a display server.
RUN pip install --no-cache-dir -r requirements.txt

# The game is interactive; always allocate a TTY with `docker run -it`.
CMD ["python", "main.py"]
