<<<<<<< HEAD
# 🍽️ Union Bank Canteen Backend

Spring Boot RESTful API that allows Union Bank staff to log in, order meals, mark favorites, and enjoy account-based privileges (e.g., CEO priority access).

---

## 🚀 Features

- JWT-based user authentication
- Staff meal ordering
- Favorites management
- Role-based access (e.g., CEO, CISO)
- RESTful architecture

---

## 📂 Tech Stack

- Java 17
- Spring Boot
- Spring Security
- Maven
- H2 (or MySQL, update accordingly)
- GitHub Actions

---

## 🛠️ Getting Started

1. Clone the repo:
```bash
git clone https://github.com/Ire91/Canteen.git
cd Canteen
=======
# Union Bank Canteen Management System

A comprehensive web-based canteen management system built with Spring Boot backend and HTML/CSS/JavaScript frontend. The system provides meal ordering, user management, admin dashboard, and real-time analytics.

## 🚀 Features

### Public Features (No Login Required)
- **Home Page**: Landing page with company information
- **About Section**: Company details and mission
- **Contact Section**: Contact information and form
- **Menu Preview**: View available meals without ordering

### User Features (Login Required)
- **Meal Ordering**: Browse and order meals with cart functionality
- **Order History**: View past orders with filtering by status
- **Profile Management**: Update personal information
- **Quick Reorder**: Reorder previous meals with one click
- **Feedback System**: Rate meals and leave comments
- **Real-time Order Tracking**: Track order status updates

### Admin Features (Admin Role Required)
- **Dashboard Analytics**: Real-time statistics and metrics
- **Order Management**: View, update status, and manage all orders
- **Menu Management**: Add, edit, and remove menu items
- **Detailed Reports**: Sales analytics, user activity, and revenue charts
- **User Management**: View user statistics and activity

## 🛠️ Technology Stack

### Backend
- **Spring Boot 3.x**: Main framework
- **Spring Security**: Authentication and authorization
- **Spring Data JPA**: Database operations
- **MySQL**: Primary database
- **JWT**: Token-based authentication
- **Lombok**: Boilerplate code reduction

### Frontend
- **HTML5**: Structure
- **CSS3**: Styling with responsive design
- **JavaScript (ES6+)**: Client-side functionality
- **Chart.js**: Data visualization
- **Font Awesome**: Icons

## 📋 Prerequisites

Before running this project, ensure you have:

- **Java 21** or higher
- **Maven 3.6+**
- **MySQL 8.0+**
- **Node.js** (for development tools, optional)

## 🚀 Quick Start

### 1. Database Setup

1. **Install MySQL** if not already installed
2. **Create Database**:
   ```sql
   CREATE DATABASE canteen_db;
   ```
3. **Configure Database** (update `application.properties` if needed):
   ```properties
   spring.datasource.url=jdbc:mysql://localhost:3306/canteen_db
   spring.datasource.username=root
   spring.datasource.password=root
   ```

### 2. Backend Setup

1. **Navigate to backend directory**:
   ```bash
   cd canteen-backend/Canteen-backend
   ```

2. **Build the project**:
   ```bash
   ./mvnw clean install
   ```

3. **Run the application**:
   ```bash
   ./mvnw spring-boot:run
   ```

4. **Verify backend is running**:
   - Open: `http://localhost:8082`
   - Should redirect to: `http://localhost:8082/home.html`

### 3. Frontend Setup

1. **Navigate to frontend directory**:
   ```bash
   cd canteen-html
   ```

2. **Serve static files** (optional - can be served by Spring Boot):
   ```bash
   # Using Python (if available)
   python -m http.server 8000
   
   # Using Node.js (if available)
   npx serve .
   ```

3. **Access the application**:
   - Main URL: `http://localhost:8082`
   - Home Page: `http://localhost:8082/home.html`
   - Login: `http://localhost:8082/login.html`

## 👥 Default Users

The system comes with pre-configured users:

### Admin User
- **Username**: `admin`
- **Password**: `admin123`
- **Role**: ADMIN
- **Access**: Full system access

### Regular User
- **Username**: `user`
- **Password**: `user123`
- **Role**: USER
- **Access**: Order meals, view history, manage profile

## 📁 Project Structure

```
Canteen/
├── canteen-backend/                 # Spring Boot Backend
│   └── Canteen-backend/
│       ├── src/main/java/
│       │   └── com/canteen/Canteen/backend/
│       │       ├── controller/      # REST Controllers
│       │       ├── model/          # JPA Entities
│       │       ├── repository/     # Data Access Layer
│       │       ├── dto/            # Data Transfer Objects
│       │       ├── security/       # Security Configuration
│       │       └── config/         # Application Config
│       └── src/main/resources/
│           ├── static/             # Frontend Files
│           └── application.properties
├── canteen-html/                   # Frontend Files
│   ├── css/                       # Stylesheets
│   ├── js/                        # JavaScript Files
│   ├── images/                    # Images
│   └── *.html                     # HTML Pages
└── README.md                      # This file
```

## 🔧 Configuration

### Application Properties

Key configuration in `application.properties`:

```properties
# Server Configuration
server.port=8082

# Database Configuration
spring.datasource.url=jdbc:mysql://localhost:3306/canteen_db
spring.datasource.username=root
spring.datasource.password=root
spring.datasource.driver-class-name=com.mysql.cj.jdbc.Driver

# JPA Configuration
spring.jpa.hibernate.ddl-auto=update
spring.jpa.show-sql=true
spring.jpa.properties.hibernate.dialect=org.hibernate.dialect.MySQL8Dialect

# JWT Configuration
jwt.secret=your-secret-key-here
jwt.expiration=86400000

# Session Management
spring.session.jdbc.initialize-schema=always
```

## 📊 API Documentation

### Authentication Endpoints

| Method | Endpoint | Description | Access |
|--------|----------|-------------|---------|
| POST | `/api/auth/login` | User login | Public |
| POST | `/api/auth/logout` | User logout | Authenticated |
| PUT | `/api/auth/me` | Update profile | Authenticated |

### Order Endpoints

| Method | Endpoint | Description | Access |
|--------|----------|-------------|---------|
| GET | `/api/orders` | Get user orders | Authenticated |
| POST | `/api/orders` | Create new order | Authenticated |
| DELETE | `/api/orders` | Clear user history | Authenticated |
| DELETE | `/api/orders/{id}` | Delete specific order | Authenticated |

### Admin Endpoints

| Method | Endpoint | Description | Access |
|--------|----------|-------------|---------|
| GET | `/api/admin/dashboard/stats` | Dashboard statistics | Admin |
| GET | `/api/admin/dashboard/reports` | Detailed reports | Admin |
| GET | `/api/admin/orders/all` | All orders | Admin |
| PUT | `/api/admin/orders/{id}/status` | Update order status | Admin |

### Menu Endpoints

| Method | Endpoint | Description | Access |
|--------|----------|-------------|---------|
| GET | `/api/menu` | Get all meals | Public |
| POST | `/api/menu` | Add new meal | Admin |
| PUT | `/api/menu/{id}` | Update meal | Admin |
| DELETE | `/api/menu/{id}` | Delete meal | Admin |

## 🚀 Deployment

### Local Development

1. **Start MySQL service**
2. **Run Spring Boot application**:
   ```bash
   ./mvnw spring-boot:run
   ```
3. **Access application**: `http://localhost:8082`

### Production Deployment

#### Option 1: JAR Deployment

1. **Build JAR file**:
   ```bash
   ./mvnw clean package -DskipTests
   ```

2. **Run JAR file**:
   ```bash
   java -jar target/Canteen-backend-0.0.1-SNAPSHOT.jar
   ```

#### Option 2: Docker Deployment

1. **Create Dockerfile**:
   ```dockerfile
   FROM openjdk:21-jdk-slim
   COPY target/Canteen-backend-0.0.1-SNAPSHOT.jar app.jar
   EXPOSE 8082
   ENTRYPOINT ["java","-jar","/app.jar"]
   ```

2. **Build and run**:
   ```bash
   docker build -t canteen-app .
   docker run -p 8082:8082 canteen-app
   ```

## 🐛 Troubleshooting

### Common Issues

1. **Database Connection Error**:
   - Verify MySQL is running
   - Check database credentials in `application.properties`
   - Ensure database `canteen_db` exists

2. **Port Already in Use**:
   - Change port in `application.properties`: `server.port=8083`
   - Or kill process using port 8082

3. **JWT Token Issues**:
   - Clear browser storage
   - Restart application
   - Check JWT secret in properties

4. **Static Files Not Loading**:
   - Ensure files are in `src/main/resources/static/`
   - Check file permissions
   - Clear browser cache

### Logs and Debugging

1. **Enable Debug Logging**:
   ```properties
   logging.level.com.canteen=DEBUG
   logging.level.org.springframework.security=DEBUG
   ```

2. **View Application Logs**:
   ```bash
   tail -f logs/application.log
   ```

## 📈 Performance Optimization

### Database Optimization

1. **Index Optimization**:
   ```sql
   CREATE INDEX idx_orders_username ON orders(username);
   CREATE INDEX idx_orders_date ON orders(order_date);
   CREATE INDEX idx_order_items_meal ON order_items(meal_id);
   ```

2. **Connection Pooling**:
   ```properties
   spring.datasource.hikari.maximum-pool-size=20
   spring.datasource.hikari.minimum-idle=5
   ```

### Frontend Optimization

1. **Minify CSS/JS** for production
2. **Optimize images** (WebP format)
3. **Enable gzip compression**
4. **Use CDN** for external libraries

## 🔒 Security Considerations

### Implemented Security Features

- **JWT Authentication**: Secure token-based auth
- **Role-based Access Control**: Admin/User permissions
- **SQL Injection Prevention**: Parameterized queries
- **XSS Protection**: Input validation and sanitization
- **CSRF Protection**: Spring Security CSRF tokens

### Security Best Practices

1. **Change default passwords** in production
2. **Use HTTPS** in production
3. **Regular security updates**
4. **Database backup** procedures
5. **Log monitoring** for suspicious activity

## 📝 Development Guidelines

### Code Style

- **Java**: Follow Google Java Style Guide
- **JavaScript**: Use ES6+ features, consistent naming
- **CSS**: BEM methodology for class naming
- **HTML**: Semantic HTML5 elements

### Git Workflow

1. **Feature branches**: `feature/feature-name`
2. **Bug fixes**: `fix/bug-description`
3. **Hotfixes**: `hotfix/urgent-fix`
4. **Commit messages**: Conventional commits format

### Testing

1. **Unit Tests**: JUnit 5 for backend
2. **Integration Tests**: TestContainers for database
3. **Frontend Tests**: Jest for JavaScript
4. **E2E Tests**: Selenium WebDriver

## 🤝 Contributing

1. **Fork the repository**
2. **Create feature branch**: `git checkout -b feature/amazing-feature`
3. **Commit changes**: `git commit -m 'Add amazing feature'`
4. **Push to branch**: `git push origin feature/amazing-feature`
5. **Open Pull Request**

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👨‍💻 Author

**Ireoluwa** - *Initial work* - [Your GitHub]

## 🙏 Acknowledgments

- Spring Boot team for the excellent framework
- Chart.js for data visualization
- Font Awesome for icons
- MySQL team for the database

---

**Note**: This documentation is a living document. Please update it as the project evolves. 
>>>>>>> 34493af (First commit: add canteen site)
