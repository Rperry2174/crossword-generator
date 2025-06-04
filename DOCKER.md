# Docker Deployment Guide

This guide explains how to run the Crossword Generator application using Docker and Docker Compose.

## Prerequisites

- [Docker](https://docs.docker.com/get-docker/) (version 20.10+)
- [Docker Compose](https://docs.docker.com/compose/install/) (version 2.0+)

## Quick Start

### 1. Clone and Configure Environment

```bash
# Clone the repository
git clone https://github.com/Rperry2174/crossword-generator.git
cd crossword-generator

# Copy environment template
cp .env.template .env

# Edit .env with your LLM API keys
nano .env  # or use your preferred editor
```

### 2. Run with Docker Compose

```bash
# Start all services (development mode)
docker-compose up -d

# View logs
docker-compose logs -f

# Stop all services
docker-compose down
```

The application will be available at:
- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:8000
- **API Documentation**: http://localhost:8000/docs

## Environment Configuration

### LLM Provider Setup

Edit your `.env` file to configure your preferred LLM provider:

#### Option 1: OpenAI
```env
LLM_PROVIDER=openai
OPENAI_API_KEY=sk-your-openai-api-key-here
```

#### Option 2: Anthropic Claude
```env
LLM_PROVIDER=anthropic
ANTHROPIC_API_KEY=sk-ant-your-anthropic-api-key-here
```

#### Option 3: Local Ollama
```env
LLM_PROVIDER=ollama
OLLAMA_BASE_URL=http://ollama:11434
```

To use Ollama, uncomment the ollama service in `docker-compose.yml`:

```yaml
ollama:
  image: ollama/ollama:latest
  container_name: crossword-ollama
  ports:
    - "11434:11434"
  volumes:
    - ollama-data:/root/.ollama
  restart: unless-stopped
  networks:
    - crossword-network
```

#### Option 4: Mock Mode (No API Keys Required)
```env
LLM_PROVIDER=mock
```

## Deployment Modes

### Development Mode (Default)

```bash
docker-compose up -d
```

Features:
- Hot reloading enabled for backend
- Source code mounted as volumes
- Development-optimized settings

### Production Mode

```bash
docker-compose -f docker-compose.yml -f docker-compose.prod.yml up -d
```

Features:
- Optimized for performance
- Multi-worker backend
- Resource limits configured
- No development volumes

## Service Architecture

### Frontend (React)
- **Container**: `crossword-frontend`
- **Port**: 3000 (mapped to host)
- **Technology**: React 18 with TypeScript
- **Web Server**: Nginx (production build)

### Backend (FastAPI)
- **Container**: `crossword-backend`
- **Port**: 8000 (mapped to host)
- **Technology**: Python FastAPI with Uvicorn
- **Features**: LLM integration, crossword generation

### Optional: Ollama (Local LLM)
- **Container**: `crossword-ollama`
- **Port**: 11434 (mapped to host)
- **Technology**: Ollama local LLM server

## Docker Commands Reference

### Building and Running

```bash
# Build all services
docker-compose build

# Build specific service
docker-compose build backend

# Run in background
docker-compose up -d

# Run with logs visible
docker-compose up

# Run specific service
docker-compose up backend
```

### Monitoring and Debugging

```bash
# View all logs
docker-compose logs

# Follow logs for specific service
docker-compose logs -f backend

# Check service status
docker-compose ps

# Execute commands in running container
docker-compose exec backend bash
docker-compose exec frontend sh
```

### Maintenance

```bash
# Stop all services
docker-compose down

# Stop and remove volumes
docker-compose down -v

# Remove all containers and images
docker-compose down --rmi all

# Restart specific service
docker-compose restart backend

# Update and rebuild
docker-compose pull
docker-compose build --no-cache
docker-compose up -d
```

## Health Checks

Both services include health checks:

- **Backend**: `curl -f http://localhost:8000/health`
- **Frontend**: `wget --spider http://localhost/health`

Check health status:
```bash
docker-compose ps
```

## Troubleshooting

### Common Issues

#### Port Already in Use
```bash
# Check what's using the port
lsof -i :3000
lsof -i :8000

# Kill the process or change ports in docker-compose.yml
```

#### Backend API Connection Issues
1. Check backend logs: `docker-compose logs backend`
2. Verify environment variables in `.env`
3. Test API directly: `curl http://localhost:8000/health`

#### Frontend Build Failures
1. Check frontend logs: `docker-compose logs frontend`
2. Verify Node.js version compatibility
3. Clear Docker build cache: `docker-compose build --no-cache frontend`

#### LLM API Issues
1. Verify API keys in `.env` file
2. Check backend logs for API error messages
3. Test with mock provider: `LLM_PROVIDER=mock`

### Performance Optimization

#### For Development
- Use volume mounts for hot reloading
- Single worker for easier debugging
- Enable detailed logging

#### For Production
- Remove development volumes
- Use multi-worker backend configuration
- Configure resource limits
- Enable gzip compression (Nginx)

## Security Considerations

### Development
- API keys in `.env` file (not committed to git)
- Local network isolation
- Development CORS settings

### Production
- Use Docker secrets for API keys
- Configure proper firewall rules
- Enable HTTPS with SSL certificates
- Set up reverse proxy (Nginx)
- Configure security headers

### Example Production Security Setup

```yaml
# docker-compose.prod.yml additions
services:
  backend:
    environment:
      - OPENAI_API_KEY_FILE=/run/secrets/openai_api_key
    secrets:
      - openai_api_key

secrets:
  openai_api_key:
    file: ./secrets/openai_api_key.txt
```

## Scaling

### Horizontal Scaling

```yaml
# Scale backend instances
services:
  backend:
    deploy:
      replicas: 3
```

### Load Balancing

Add Nginx reverse proxy:

```yaml
nginx:
  image: nginx:alpine
  volumes:
    - ./nginx/nginx.conf:/etc/nginx/nginx.conf:ro
  ports:
    - "80:80"
  depends_on:
    - backend
    - frontend
```

## Monitoring

### Basic Monitoring

```bash
# Resource usage
docker stats

# Container status
docker-compose ps

# Health checks
curl http://localhost:8000/health
curl http://localhost:3000/health
```

### Advanced Monitoring

Consider adding:
- Prometheus metrics collection
- Grafana dashboards
- Log aggregation (ELK stack)
- Error tracking (Sentry)

## Backup and Recovery

### Data Persistence

Currently, the application is stateless, but for future database integration:

```yaml
volumes:
  postgres_data:
    driver: local
```

### Configuration Backup

```bash
# Backup configuration
cp .env .env.backup
cp docker-compose.yml docker-compose.yml.backup
```

## Integration with CI/CD

### GitHub Actions Example

```yaml
name: Docker Build and Deploy

on:
  push:
    branches: [main]

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      
      - name: Build and test
        run: |
          docker-compose build
          docker-compose up -d
          docker-compose exec -T backend python -m pytest
          
      - name: Deploy
        run: |
          docker-compose -f docker-compose.yml -f docker-compose.prod.yml up -d
```

This Docker setup provides a robust, scalable foundation for deploying the Crossword Generator application in any environment.