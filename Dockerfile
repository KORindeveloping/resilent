FROM node:20-slim

# Install dependencies including curl for ollama
RUN apt-get update && apt-get install -y curl && rm -rf /var/lib/apt/lists/*

# Install Ollama
RUN curl -fsSL https://ollama.com/install.sh | sh

# Set working directory
WORKDIR /app

# Copy server package files
COPY server/package*.json ./server/

# Install server dependencies
RUN cd server && npm install

# Copy server application files
COPY server/ ./server/

# Set environment variables
ENV PORT=10000
ENV OLLAMA_HOST=0.0.0.0

# Create start script
RUN echo '#!/bin/bash\n\
# Start ollama in background\n\
ollama serve &\n\
\n\
# Wait for ollama API to be ready\n\
echo "Waiting for Ollama to start..."\n\
while ! curl -s http://127.0.0.1:11434 > /dev/null; do\n\
  sleep 1\n\
done\n\
echo "Ollama is running."\n\
\n\
# Pull the required model\n\
echo "Pulling gemma3:4b model..."\n\
ollama pull gemma3:4b\n\
\n\
# Start the node server\n\
echo "Starting Node API server..."\n\
cd server && npm start\n\
' > /app/start.sh

RUN chmod +x /app/start.sh

# Expose port
EXPOSE 10000

# Start script
CMD ["/app/start.sh"]
