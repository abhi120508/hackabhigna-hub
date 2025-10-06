FROM node:20-bullseye-slim

# Install a reasonably small set of TeX packages needed for pdflatex
RUN apt-get update \
  && apt-get install -y --no-install-recommends \
    ca-certificates \
    wget \
    xz-utils \
    fontconfig \
    ghostscript \
    poppler-utils \
    texlive-latex-recommended \
    texlive-latex-extra \
    texlive-fonts-recommended \
    texlive-fonts-extra \
  && rm -rf /var/lib/apt/lists/*

WORKDIR /usr/src/app

# Copy only package manifests first for caching
COPY package*.json ./
RUN npm ci --omit=dev

# Copy application code
COPY . .

# Ensure pdflatex is on PATH and export a helper env var
ENV PDFLATEX_PATH=/usr/bin/pdflatex

EXPOSE 5000

CMD ["node", "server/server.js"]
