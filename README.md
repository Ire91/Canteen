# 🍽️ Union Bank Canteen Management System

A full-stack canteen management system built with **Java, Spring Boot, MySQL, JWT authentication, REST APIs, HTML, CSS, and JavaScript**.

The system provides secure user authentication, meal ordering, order management, role-based access control, menu management, user management, and administrative analytics.

## 🚀 Features

### User Features

* Secure JWT-based authentication
* Staff meal ordering
* Browse available meals
* Shopping cart functionality
* Order history
* Quick reorder
* Favorites management
* Profile management
* Feedback and meal ratings
* Real-time order tracking

### Admin Features

* Administrative dashboard
* Real-time statistics and analytics
* Order management
* Menu management
* User management
* Sales and activity reports
* Role-based access control

## 🛠️ Technology Stack

### Backend

* **Java**
* **Spring Boot 3.x**
* **Spring Security**
* **Spring Data JPA**
* **MySQL**
* **JWT Authentication**
* **Maven**
* **Lombok**

### Frontend

* **HTML5**
* **CSS3**
* **JavaScript (ES6+)**
* **Chart.js**
* **Font Awesome**

### Development & Deployment

* **Git**
* **GitHub Actions**
* **Docker**
* **Postman**
* **Swagger/OpenAPI**
* **Render**

## 🏗️ Architecture

The project is organized into separate backend and frontend components.

```text
Canteen/
├── canteen-backend/
│   └── Canteen-backend/
│       ├── src/main/java/
│       │   └── com/canteen/Canteen/backend/
│       │       ├── controller/
│       │       ├── model/
│       │       ├── repository/
│       │       ├── dto/
│       │       ├── security/
│       │       └── config/
│       │
│       └── src/main/resources/
│           ├── static/
│           └── application.properties
│
├── canteen-html/
│   ├── css/
│   ├── js/
│   ├── images/
│   └── *.html
│
├── images/
├── README.md
└── DEPLOYMENT_GUIDE.md
```

## 🔐 Authentication & Security

The application uses Spring Security and JWT-based authentication to protect application resources.

Security-related functionality includes:

* JWT-based authentication
* Role-based access control
* Protected REST API endpoints
* Input validation
* Authentication and authorization controls
* Secure database access through Spring Data JPA

> **Security note:** Database credentials, JWT secrets, API keys, and other sensitive configuration values should be supplied through local environment/configuration files and should not be committed to the repository.

## 📊 REST API

The application exposes RESTful endpoints for authentication, orders, menus, and administrative operations.

### Authentication

| Method | Endpoint           | Description                             |
| ------ | ------------------ | --------------------------------------- |
| POST   | `/api/auth/login`  | Authenticate a user                     |
| POST   | `/api/auth/logout` | Log out an authenticated user           |
| PUT    | `/api/auth/me`     | Update the authenticated user's profile |

### Orders

| Method | Endpoint           | Description              |
| ------ | ------------------ | ------------------------ |
| GET    | `/api/orders`      | Retrieve user orders     |
| POST   | `/api/orders`      | Create an order          |
| DELETE | `/api/orders`      | Clear user order history |
| DELETE | `/api/orders/{id}` | Delete a specific order  |

### Menu

| Method | Endpoint         | Description              |
| ------ | ---------------- | ------------------------ |
| GET    | `/api/menu`      | Retrieve available meals |
| POST   | `/api/menu`      | Add a meal               |
| PUT    | `/api/menu/{id}` | Update a meal            |
| DELETE | `/api/menu/{id}` | Delete a meal            |

### Administration

| Method | Endpoint                        | Description                   |
| ------ | ------------------------------- | ----------------------------- |
| GET    | `/api/admin/dashboard/stats`    | Retrieve dashboard statistics |
| GET    | `/api/admin/dashboard/reports`  | Retrieve detailed reports     |
| GET    | `/api/admin/orders/all`         | Retrieve all orders           |
| PUT    | `/api/admin/orders/{id}/status` | Update order status           |

## 📋 Prerequisites

Before running the application locally, install:

* Java
* Maven
* MySQL

Optional development tools:

* Node.js
* Docker
* Postman

## 🚀 Running Locally

### 1. Database Setup

Create a local MySQL database:

```sql
CREATE DATABASE canteen_db;
```

Configure the database connection using your local `application.properties` or environment-specific configuration.

**Do not commit database passwords or other sensitive credentials to GitHub.**

### 2. Backend Setup

Navigate to the backend directory:

```bash
cd canteen-backend/Canteen-backend
```

Build the application:

```bash
./mvnw clean install
```

Run the Spring Boot application:

```bash
./mvnw spring-boot:run
```

The application is configured to run on:

```text
http://localhost:8082
```

### 3. Frontend

The frontend is located in:

```text
canteen-html/
```

It can be served using a local development server or through the Spring Boot application's static resources configuration.

## 🐳 Docker Deployment

The backend can be packaged and deployed using Docker.

Build the application:

```bash
./mvnw clean package -DskipTests
```

Build the Docker image:

```bash
docker build -t canteen-app .
```

Run the container:

```bash
docker run -p 8082:8082 canteen-app
```

## 📈 Performance & Database

The application uses MySQL and Spring Data JPA for data persistence.

Database optimization considerations include:

* Database indexes
* Connection pooling
* Efficient queries
* Appropriate entity relationships
* Transaction management

## 🧪 Testing & Development

The project is structured to support:

* Backend unit testing
* Integration testing
* API testing
* Frontend testing
* End-to-end testing

API endpoints can be tested using **Postman** and documented/tested through **Swagger/OpenAPI** where configured.

## 🔒 Security Considerations

For production deployment:

* Use HTTPS
* Store secrets outside the source code
* Change development credentials
* Use strong JWT secrets
* Apply appropriate database permissions
* Keep dependencies updated
* Monitor application logs
* Maintain regular database backups

## 📌 Project Highlights

This project demonstrates practical experience with:

* Full-stack web application development
* Java and Spring Boot backend development
* RESTful API design
* JWT authentication
* Role-based authorization
* MySQL database integration
* Spring Data JPA
* Frontend development with HTML, CSS and JavaScript
* API testing and documentation
* Git-based development
* Docker-based deployment

## 👨‍💻 Author

**Balogun Ireoluwa**

GitHub: [@Ire91](https://github.com/Ire91)

LinkedIn: [Ireoluwa Balogun](https://www.linkedin.com/in/ireoluwa-balogun-7a7931321/)

## 📄 License

This project is licensed under the MIT License.
