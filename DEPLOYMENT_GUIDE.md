# Deployment Guide - Union Bank Canteen Management System

## 📋 Overview

This guide provides step-by-step instructions for deploying the Canteen Management System across different environments and platforms.

## 🏗️ Prerequisites

### System Requirements

- **Java**: OpenJDK 21 or Oracle JDK 21
- **MySQL**: 8.0 or higher
- **Memory**: Minimum 2GB RAM (4GB recommended)
- **Storage**: Minimum 10GB free space
- **Network**: Port 8082 available (configurable)

### Required Software

- **Maven**: 3.6 or higher
- **Git**: For version control
- **MySQL Client**: For database management
- **Docker**: (Optional, for containerized deployment)

## 🚀 Local Development Deployment

### Step 1: Environment Setup

1. **Install Java 21**:
   ```bash
   # Ubuntu/Debian
   sudo apt update
   sudo apt install openjdk-21-jdk
   
   # macOS (using Homebrew)
   brew install openjdk@21
   
   # Windows
   # Download from Oracle or use Chocolatey
   choco install openjdk21
   ```

2. **Install MySQL**:
   ```bash
   # Ubuntu/Debian
   sudo apt install mysql-server
   
   # macOS
   brew install mysql
   
   # Windows
   # Download MySQL Installer from official website
   ```

3. **Install Maven**:
   ```bash
   # Ubuntu/Debian
   sudo apt install maven
   
   # macOS
   brew install maven
   
   # Windows
   # Download from Apache Maven website
   ```

### Step 2: Database Setup

1. **Start MySQL Service**:
   ```bash
   # Ubuntu/Debian
   sudo systemctl start mysql
   sudo systemctl enable mysql
   
   # macOS
   brew services start mysql
   
   # Windows
   # Start MySQL service from Services
   ```

2. **Create Database**:
   ```bash
   mysql -u root -p
   ```
   ```sql
   CREATE DATABASE canteen_db;
   CREATE USER 'canteen_user'@'localhost' IDENTIFIED BY 'secure_password';
   GRANT ALL PRIVILEGES ON canteen_db.* TO 'canteen_user'@'localhost';
   FLUSH PRIVILEGES;
   EXIT;
   ```

3. **Update Application Properties**:
   ```properties
   # application.properties
   spring.datasource.url=jdbc:mysql://localhost:3306/canteen_db?useSSL=false&serverTimezone=UTC
   spring.datasource.username=canteen_user
   spring.datasource.password=secure_password
   ```

### Step 3: Application Deployment

1. **Clone Repository**:
   ```bash
   git clone <repository-url>
   cd Canteen
   ```

2. **Build Application**:
   ```bash
   cd canteen-backend/Canteen-backend
   ./mvnw clean package -DskipTests
   ```

3. **Run Application**:
   ```bash
   # Option 1: Using Maven
   ./mvnw spring-boot:run
   
   # Option 2: Using JAR
   java -jar target/Canteen-backend-0.0.1-SNAPSHOT.jar
   
   # Option 3: With custom properties
   java -jar target/Canteen-backend-0.0.1-SNAPSHOT.jar --spring.profiles.active=dev
   ```

4. **Verify Deployment**:
   - Open browser: `http://localhost:8082`
   - Should redirect to: `http://localhost:8082/home.html`

## 🐳 Docker Deployment

### Step 1: Create Dockerfile

```dockerfile
# Dockerfile
FROM openjdk:21-jdk-slim

# Set working directory
WORKDIR /app

# Copy JAR file
COPY target/Canteen-backend-0.0.1-SNAPSHOT.jar app.jar

# Expose port
EXPOSE 8082

# Set environment variables
ENV SPRING_PROFILES_ACTIVE=docker
ENV JAVA_OPTS="-Xmx512m -Xms256m"

# Run application
ENTRYPOINT ["java", "-jar", "/app/app.jar"]
```

### Step 2: Create Docker Compose

```yaml
# docker-compose.yml
version: '3.8'

services:
  mysql:
    image: mysql:8.0
    container_name: canteen-mysql
    environment:
      MYSQL_ROOT_PASSWORD: root
      MYSQL_DATABASE: canteen_db
      MYSQL_USER: canteen_user
      MYSQL_PASSWORD: secure_password
    ports:
      - "3306:3306"
    volumes:
      - mysql_data:/var/lib/mysql
    networks:
      - canteen-network

  canteen-app:
    build: .
    container_name: canteen-app
    depends_on:
      - mysql
    environment:
      SPRING_DATASOURCE_URL: jdbc:mysql://mysql:3306/canteen_db?useSSL=false&serverTimezone=UTC
      SPRING_DATASOURCE_USERNAME: canteen_user
      SPRING_DATASOURCE_PASSWORD: secure_password
    ports:
      - "8082:8082"
    networks:
      - canteen-network

volumes:
  mysql_data:

networks:
  canteen-network:
    driver: bridge
```

### Step 3: Deploy with Docker

```bash
# Build and run
docker-compose up -d

# Check logs
docker-compose logs -f canteen-app

# Stop services
docker-compose down
```

## ☁️ Cloud Deployment

### AWS EC2 Deployment

#### Step 1: Launch EC2 Instance

1. **Launch Instance**:
   - AMI: Amazon Linux 2 or Ubuntu 20.04
   - Instance Type: t3.medium (2 vCPU, 4GB RAM)
   - Security Group: Allow ports 22 (SSH), 80 (HTTP), 443 (HTTPS), 8082 (App)

2. **Connect to Instance**:
   ```bash
   ssh -i your-key.pem ec2-user@your-instance-ip
   ```

#### Step 2: Install Dependencies

```bash
# Update system
sudo yum update -y  # Amazon Linux
# sudo apt update && sudo apt upgrade -y  # Ubuntu

# Install Java
sudo yum install java-21-amazon-corretto -y  # Amazon Linux
# sudo apt install openjdk-21-jdk -y  # Ubuntu

# Install MySQL
sudo yum install mysql -y  # Amazon Linux
# sudo apt install mysql-server -y  # Ubuntu

# Install Maven
sudo yum install maven -y  # Amazon Linux
# sudo apt install maven -y  # Ubuntu
```

#### Step 3: Configure MySQL

```bash
# Start MySQL
sudo systemctl start mysqld
sudo systemctl enable mysqld

# Secure MySQL
sudo mysql_secure_installation

# Create database
mysql -u root -p
```

```sql
CREATE DATABASE canteen_db;
CREATE USER 'canteen_user'@'localhost' IDENTIFIED BY 'secure_password';
GRANT ALL PRIVILEGES ON canteen_db.* TO 'canteen_user'@'localhost';
FLUSH PRIVILEGES;
EXIT;
```

#### Step 4: Deploy Application

```bash
# Clone repository
git clone <repository-url>
cd Canteen/canteen-backend/Canteen-backend

# Build application
./mvnw clean package -DskipTests

# Create systemd service
sudo nano /etc/systemd/system/canteen.service
```

```ini
[Unit]
Description=Canteen Management System
After=network.target

[Service]
Type=simple
User=ec2-user
WorkingDirectory=/home/ec2-user/Canteen/canteen-backend/Canteen-backend
ExecStart=/usr/bin/java -jar target/Canteen-backend-0.0.1-SNAPSHOT.jar
Restart=always
RestartSec=10

[Install]
WantedBy=multi-user.target
```

```bash
# Start service
sudo systemctl daemon-reload
sudo systemctl enable canteen
sudo systemctl start canteen

# Check status
sudo systemctl status canteen
```

### Azure App Service Deployment

#### Step 1: Prepare Application

1. **Create Azure App Service**:
   - Platform: Java 21
   - Runtime: Java 21
   - Region: Your preferred region

2. **Configure Application Settings**:
   ```properties
   SPRING_DATASOURCE_URL=jdbc:mysql://your-mysql-server.mysql.database.azure.com:3306/canteen_db
   SPRING_DATASOURCE_USERNAME=canteen_user@your-mysql-server
   SPRING_DATASOURCE_PASSWORD=secure_password
   SERVER_PORT=8082
   ```

#### Step 2: Deploy via Azure CLI

```bash
# Login to Azure
az login

# Create resource group
az group create --name canteen-rg --location eastus

# Create app service plan
az appservice plan create --name canteen-plan --resource-group canteen-rg --sku B1

# Create web app
az webapp create --name canteen-app --resource-group canteen-rg --plan canteen-plan --runtime "JAVA|21"

# Deploy application
az webapp deployment source config-local-git --name canteen-app --resource-group canteen-rg
```

### Google Cloud Platform Deployment

#### Step 1: Prepare Application

```bash
# Install Google Cloud SDK
# Follow official documentation for your OS

# Initialize project
gcloud init

# Set project
gcloud config set project your-project-id
```

#### Step 2: Deploy to App Engine

```yaml
# app.yaml
runtime: java21
env: standard

instance_class: F1

automatic_scaling:
  target_cpu_utilization: 0.6
  min_instances: 1
  max_instances: 10

env_variables:
  SPRING_DATASOURCE_URL: jdbc:mysql://your-mysql-instance-ip:3306/canteen_db
  SPRING_DATASOURCE_USERNAME: canteen_user
  SPRING_DATASOURCE_PASSWORD: secure_password
```

```bash
# Deploy
gcloud app deploy
```

## 🔧 Production Configuration

### Environment-Specific Properties

#### Development Profile
```properties
# application-dev.properties
spring.jpa.show-sql=true
logging.level.com.canteen=DEBUG
server.port=8082
```

#### Production Profile
```properties
# application-prod.properties
spring.jpa.show-sql=false
logging.level.com.canteen=WARN
server.port=8082
spring.datasource.hikari.maximum-pool-size=20
spring.datasource.hikari.minimum-idle=5
```

#### Docker Profile
```properties
# application-docker.properties
spring.datasource.url=jdbc:mysql://mysql:3306/canteen_db?useSSL=false&serverTimezone=UTC
spring.datasource.username=canteen_user
spring.datasource.password=secure_password
```

### Security Configuration

#### SSL/HTTPS Setup

1. **Generate SSL Certificate**:
   ```bash
   # Using Let's Encrypt
   sudo apt install certbot
   sudo certbot certonly --standalone -d your-domain.com
   ```

2. **Configure SSL in Application**:
   ```properties
   # application.properties
   server.ssl.key-store=classpath:keystore.p12
   server.ssl.key-store-password=your-password
   server.ssl.key-store-type=PKCS12
   server.ssl.key-alias=tomcat
   ```

### Monitoring and Logging

#### Application Monitoring

1. **Enable Actuator**:
   ```xml
   <!-- pom.xml -->
   <dependency>
       <groupId>org.springframework.boot</groupId>
       <artifactId>spring-boot-starter-actuator</artifactId>
   </dependency>
   ```

2. **Configure Actuator**:
   ```properties
   # application.properties
   management.endpoints.web.exposure.include=health,info,metrics
   management.endpoint.health.show-details=always
   ```

#### Logging Configuration

```properties
# application.properties
logging.file.name=logs/canteen.log
logging.pattern.file=%d{yyyy-MM-dd HH:mm:ss} [%thread] %-5level %logger{36} - %msg%n
logging.level.root=INFO
logging.level.com.canteen=INFO
logging.level.org.springframework.security=WARN
```

## 🔄 CI/CD Pipeline

### GitHub Actions

```yaml
# .github/workflows/deploy.yml
name: Deploy Canteen App

on:
  push:
    branches: [ main ]

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest
    
    steps:
    - uses: actions/checkout@v3
    
    - name: Set up JDK 21
      uses: actions/setup-java@v3
      with:
        java-version: '21'
        distribution: 'temurin'
    
    - name: Build with Maven
      run: ./mvnw clean package -DskipTests
    
    - name: Deploy to EC2
      uses: appleboy/ssh-action@v0.1.5
      with:
        host: ${{ secrets.HOST }}
        username: ${{ secrets.USERNAME }}
        key: ${{ secrets.KEY }}
        script: |
          cd /home/ec2-user/Canteen/canteen-backend/Canteen-backend
          git pull origin main
          ./mvnw clean package -DskipTests
          sudo systemctl restart canteen
```

### Jenkins Pipeline

```groovy
// Jenkinsfile
pipeline {
    agent any
    
    stages {
        stage('Build') {
            steps {
                sh 'mvn clean package -DskipTests'
            }
        }
        
        stage('Test') {
            steps {
                sh 'mvn test'
            }
        }
        
        stage('Deploy') {
            steps {
                sh '''
                    ssh user@server "cd /app && \
                    git pull origin main && \
                    mvn clean package -DskipTests && \
                    sudo systemctl restart canteen"
                '''
            }
        }
    }
}
```

## 🚨 Troubleshooting

### Common Deployment Issues

#### 1. Port Already in Use
```bash
# Check what's using the port
sudo netstat -tulpn | grep :8082

# Kill the process
sudo kill -9 <PID>

# Or change port in application.properties
server.port=8083
```

#### 2. Database Connection Issues
```bash
# Check MySQL status
sudo systemctl status mysql

# Check MySQL logs
sudo tail -f /var/log/mysql/error.log

# Test connection
mysql -u canteen_user -p canteen_db
```

#### 3. Memory Issues
```bash
# Check memory usage
free -h

# Increase JVM heap size
java -Xmx2g -Xms1g -jar app.jar
```

#### 4. SSL Certificate Issues
```bash
# Check certificate validity
openssl x509 -in certificate.crt -text -noout

# Test SSL connection
openssl s_client -connect your-domain.com:443
```

### Performance Optimization

#### Database Optimization
```sql
-- Add indexes for better performance
CREATE INDEX idx_orders_username ON orders(username);
CREATE INDEX idx_orders_date ON orders(order_date);
CREATE INDEX idx_order_items_meal ON order_items(meal_id);

-- Optimize MySQL configuration
SET GLOBAL innodb_buffer_pool_size = 1073741824; -- 1GB
SET GLOBAL max_connections = 200;
```

#### Application Optimization
```properties
# application.properties
spring.datasource.hikari.maximum-pool-size=20
spring.datasource.hikari.minimum-idle=5
spring.datasource.hikari.connection-timeout=30000
spring.datasource.hikari.idle-timeout=600000
spring.datasource.hikari.max-lifetime=1800000
```

## 📊 Monitoring and Maintenance

### Health Checks

1. **Application Health**:
   ```bash
   curl http://localhost:8082/actuator/health
   ```

2. **Database Health**:
   ```bash
   mysql -u canteen_user -p -e "SELECT 1;"
   ```

3. **System Resources**:
   ```bash
   # CPU and Memory
   top
   
   # Disk usage
   df -h
   
   # Network connections
   netstat -an | grep :8082
   ```

### Backup Procedures

#### Database Backup
```bash
# Create backup script
#!/bin/bash
DATE=$(date +%Y%m%d_%H%M%S)
mysqldump -u canteen_user -p canteen_db > backup_$DATE.sql

# Restore from backup
mysql -u canteen_user -p canteen_db < backup_20250101_120000.sql
```

#### Application Backup
```bash
# Backup JAR file
cp target/Canteen-backend-0.0.1-SNAPSHOT.jar backup/

# Backup configuration
cp application.properties backup/
```

### Update Procedures

#### Application Updates
```bash
# Stop application
sudo systemctl stop canteen

# Backup current version
cp target/Canteen-backend-0.0.1-SNAPSHOT.jar backup/

# Deploy new version
./mvnw clean package -DskipTests

# Start application
sudo systemctl start canteen

# Verify deployment
curl http://localhost:8082/actuator/health
```

#### Database Migrations
```sql
-- Always backup before migrations
mysqldump -u canteen_user -p canteen_db > pre_migration_backup.sql

-- Run migrations
-- (Use Flyway or Liquibase for automated migrations)
```

---

**Note**: This deployment guide should be updated as the application evolves and new deployment scenarios are added. 