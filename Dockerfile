# ─────────────────────────────────────────────
# Base Image: Node.js with Debian for package support
# ─────────────────────────────────────────────
FROM node:22-bullseye

# ─────────────────────────────────────────────
# Install FFmpeg for video processing
# ─────────────────────────────────────────────
RUN apt update && apt install -y ffmpeg

# ─────────────────────────────────────────────
# Set working directory inside container
# ─────────────────────────────────────────────
WORKDIR /app

# ─────────────────────────────────────────────
# Install dependencies
# ─────────────────────────────────────────────
COPY package*.json ./
RUN npm install

# ─────────────────────────────────────────────
# Copy application source code
# ─────────────────────────────────────────────
COPY . .

# ─────────────────────────────────────────────
# Expose application port
# ─────────────────────────────────────────────
EXPOSE 3000

# ─────────────────────────────────────────────
# Start the server
# ─────────────────────────────────────────────
CMD ["node", "index.js"]