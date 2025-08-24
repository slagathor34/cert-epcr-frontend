# Sacramento Fire CERT ePCR System

A comprehensive Electronic Patient Care Records (ePCR) system designed specifically for Sacramento Fire Community Emergency Response Team (CERT) operations.

![Docker Pulls](https://img.shields.io/docker/pulls/sstormes/sacfire-cert-epcr)
![Docker Image Size](https://img.shields.io/docker/image-size/sstormes/sacfire-cert-epcr/latest)
![Docker Image Version](https://img.shields.io/docker/v/sstormes/sacfire-cert-epcr)

## 🏥 Overview

The Sacramento Fire CERT ePCR system is a modern, web-based application for emergency medical documentation and patient care reporting. Built with React TypeScript and deployed as a containerized solution, it provides first responders with an intuitive interface for comprehensive medical documentation.

## 🚀 Quick Start

### Run with Docker

```bash
# Pull and run the latest version
docker pull sstormes/sacfire-cert-epcr:latest
docker run -d -p 80:80 --name sacfire-epcr sstormes/sacfire-cert-epcr:latest
```

Access the application at `http://localhost`

### Run with Docker Compose

Create a `docker-compose.yml` file:

```yaml
version: '3.8'
services:
  sacfire-epcr:
    image: sstormes/sacfire-cert-epcr:latest
    container_name: sacfire-epcr
    ports:
      - "80:80"
    restart: unless-stopped
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost/"]
      interval: 30s
      timeout: 10s
      retries: 3
      start_period: 40s
```

Then run: `docker-compose up -d`

### Run with Custom Port

```bash
docker run -d -p 8080:80 --name sacfire-epcr sstormes/sacfire-cert-epcr:latest
```

Access at `http://localhost:8080`

## 🏗️ Architecture

- **Frontend**: React 18.3+ with TypeScript
- **UI Framework**: Material-UI v5 (MUI)
- **Web Server**: Nginx (Alpine Linux)
- **Authentication**: Role-based access control with localStorage
- **Forms**: React Hook Form with comprehensive validation
- **Routing**: React Router v6 with protected routes

## ✨ Features

### 📋 Patient Care Documentation
- Comprehensive patient assessment forms
- Interactive anatomical body diagrams
- Vital signs tracking with timestamps
- Treatment and medication logging
- Incident timeline documentation

### 👥 User Management
- Role-based access control (Admin, Supervisor, Responder, Trainee, Viewer)
- User authentication and authorization
- Permission-based feature access
- Profile management and preferences

### 🔒 Security
- Secure authentication system
- Protected routes with role validation
- Data validation and sanitization
- HTTPS-ready configuration
- Security headers configured

### 📊 Dashboard & Reporting
- Real-time dashboard with key metrics
- Report management and filtering
- Export capabilities
- User activity tracking

## 🔐 Default Login

For initial setup and testing:

- **Username**: admin@sacfire.cert
- **Password**: cert22!@
- **Role**: Administrator

*Change default credentials immediately in production environments*

## 📦 Container Details

- **Base Image**: nginx:alpine
- **Size**: ~81.5MB (optimized)
- **Architecture**: Multi-platform (ARM64, AMD64)
- **Security**: Non-root user, minimal attack surface
- **Health Check**: Built-in HTTP health monitoring

## 🚀 Deployment Options

### Kubernetes

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: sacfire-epcr
spec:
  replicas: 2
  selector:
    matchLabels:
      app: sacfire-epcr
  template:
    metadata:
      labels:
        app: sacfire-epcr
    spec:
      containers:
      - name: sacfire-epcr
        image: sstormes/sacfire-cert-epcr:1.0.0
        ports:
        - containerPort: 80
        resources:
          requests:
            memory: "64Mi"
            cpu: "50m"
          limits:
            memory: "128Mi"
            cpu: "100m"
---
apiVersion: v1
kind: Service
metadata:
  name: sacfire-epcr-service
spec:
  selector:
    app: sacfire-epcr
  ports:
  - port: 80
    targetPort: 80
  type: LoadBalancer
```

### Docker Swarm

```bash
docker service create \
  --name sacfire-epcr \
  --publish 80:80 \
  --replicas 2 \
  --restart-condition any \
  sstormes/sacfire-cert-epcr:1.0.0
```

### Cloud Platforms

#### AWS ECS
- Use the provided task definition template
- Configure ALB for load balancing
- Set up CloudWatch for monitoring

#### Google Cloud Run
```bash
gcloud run deploy sacfire-epcr \
  --image sstormes/sacfire-cert-epcr:latest \
  --platform managed \
  --port 80 \
  --allow-unauthenticated
```

#### Azure Container Instances
```bash
az container create \
  --resource-group myResourceGroup \
  --name sacfire-epcr \
  --image sstormes/sacfire-cert-epcr:latest \
  --ports 80 \
  --dns-name-label sacfire-epcr
```

## 🔧 Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `NGINX_PORT` | Port for Nginx to listen on | 80 |
| `NGINX_WORKER_PROCESSES` | Number of Nginx worker processes | auto |
| `NGINX_WORKER_CONNECTIONS` | Max connections per worker | 1024 |

## 📊 Monitoring & Health Checks

### Built-in Health Check
The container includes a health check endpoint:
```bash
curl http://localhost/health
```

### Monitoring Integration
- **Prometheus**: Nginx metrics available
- **Grafana**: Dashboard templates provided
- **CloudWatch**: AWS integration ready
- **Application Insights**: Azure monitoring support

## 🔒 Security Considerations

### Production Deployment
1. **Change default credentials** immediately
2. **Enable HTTPS** with proper SSL certificates
3. **Configure firewall** rules
4. **Regular security updates** of base images
5. **Implement backup** strategies
6. **Monitor access logs** for suspicious activity

### Network Security
- Deploy behind reverse proxy (nginx, Cloudflare, etc.)
- Use container networking for service isolation
- Implement rate limiting
- Enable CORS policies as needed

## 📈 Performance

### Optimization Features
- **Gzipped assets** for faster loading
- **Cached static resources** with proper headers
- **Minified JavaScript** and CSS
- **Optimized images** and assets
- **Service worker** for offline capability

### Resource Requirements
- **Minimum**: 64MB RAM, 0.1 CPU cores
- **Recommended**: 128MB RAM, 0.2 CPU cores
- **Storage**: ~100MB for container and temporary files

## 🛠️ Development

### Local Development
```bash
# Clone the repository
git clone https://github.com/yourusername/sacfire-cert-epcr

# Install dependencies
npm install

# Start development server
npm start
```

### Building Custom Images
```bash
# Build with custom tags
docker build -t your-registry/sacfire-epcr:custom .

# Multi-platform build
docker buildx build --platform linux/amd64,linux/arm64 \
  -t your-registry/sacfire-epcr:latest .
```

## 📝 Available Tags

| Tag | Description | Size |
|-----|-------------|------|
| `latest` | Latest stable release | ~81.5MB |
| `1.0.0` | Version 1.0.0 release | ~81.5MB |

## 🤝 Support & Contributing

### Issues & Bug Reports
- Report issues via GitHub Issues
- Provide detailed reproduction steps
- Include environment information

### Feature Requests
- Submit enhancement requests
- Describe use cases and benefits
- Consider backward compatibility

### Security Reports
- Report security issues privately
- Include detailed vulnerability information
- Follow responsible disclosure practices

## 📄 License

This project is licensed under the MIT License. See the LICENSE file for details.

## 🏆 Acknowledgments

- Sacramento Fire Department
- Community Emergency Response Team (CERT)
- Open source community contributors

---

**Maintained by**: Sacramento Fire CERT Team  
**Last Updated**: August 2025  
**Container Registry**: [Docker Hub](https://hub.docker.com/r/sstormes/sacfire-cert-epcr)

For questions or support, please contact the Sacramento Fire CERT team.