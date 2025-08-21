# Bug Reports - Canteen Management System

This document contains bug reports and their resolutions from the development of the Union Bank Canteen Management System.

## 🐛 Bug Report Template

### Bug Report Format
```
**Bug ID**: [Unique identifier]
**Title**: [Brief description]
**Severity**: [Critical/High/Medium/Low]
**Priority**: [P1/P2/P3/P4]
**Status**: [Open/In Progress/Resolved/Closed]

**Description**:
[Detailed description of the bug]

**Steps to Reproduce**:
1. [Step 1]
2. [Step 2]
3. [Step 3]

**Expected Behavior**:
[What should happen]

**Actual Behavior**:
[What actually happens]

**Environment**:
- OS: [Operating System]
- Browser: [Browser and version]
- Backend: [Spring Boot version]
- Database: [MySQL version]

**Error Messages**:
```
[Error logs or console messages]
```

**Root Cause**:
[Technical explanation of why the bug occurred]

**Solution**:
[How the bug was fixed]

**Files Modified**:
- [File path 1]
- [File path 2]

**Testing**:
[How the fix was verified]

**Prevention**:
[How to prevent similar bugs in the future]
```

---

## 📋 Bug Reports

### Bug ID: BUG-001
**Title**: Whitelabel Error Page - Access Denied for home.html
**Severity**: High
**Priority**: P1
**Status**: Resolved

**Description**:
Users were unable to access the home.html page due to Spring Security blocking access with a 403 Forbidden error.

**Steps to Reproduce**:
1. Start the Spring Boot application
2. Navigate to http://localhost:8082/home.html
3. Observe Whitelabel Error Page with 403 status

**Expected Behavior**:
home.html should be accessible without authentication as it's a public landing page.

**Actual Behavior**:
Spring Security blocked access with "Access Denied" error.

**Environment**:
- OS: Windows 10
- Browser: Chrome
- Backend: Spring Boot 3.x
- Database: MySQL 8.0

**Error Messages**:
```
Whitelabel Error Page
This application has no explicit mapping for /error, so you are seeing this as a fallback.
There was an unexpected error (type=Forbidden, status=403). Access Denied
```

**Root Cause**:
The `/home.html` path was not included in the `permitAll()` list in Spring Security configuration.

**Solution**:
Added `/home.html` to the `permitAll()` list in `SecurityConfig.java`:
```java
.requestMatchers(
    "/home.html", // <-- added
    // ... other public paths
).permitAll()
```

**Files Modified**:
- `canteen-backend/Canteen-backend/src/main/java/com/canteen/Canteen/backend/security/SecurityConfig.java`

**Testing**:
Verified that home.html is now accessible without authentication.

**Prevention**:
Always ensure new public pages are added to the `permitAll()` list in security configuration.

---

### Bug ID: BUG-002
**Title**: Database Connection Error - Spring Session Tables Missing
**Severity**: Critical
**Priority**: P1
**Status**: Resolved

**Description**:
Application failed to start due to missing Spring Session database tables in MySQL.

**Steps to Reproduce**:
1. Switch from H2 to MySQL database
2. Start application
3. Observe startup failure

**Expected Behavior**:
Application should start successfully with MySQL database.

**Actual Behavior**:
Application failed to start with database connection errors.

**Environment**:
- OS: Windows 10
- Backend: Spring Boot 3.x
- Database: MySQL 8.0

**Error Messages**:
```
Table 'canteen_db.spring_session' doesn't exist
```

**Root Cause**:
Spring Session JDBC was enabled but required tables were not auto-created in MySQL.

**Solution**:
Added `spring.session.jdbc.initialize-schema=always` to `application.properties`:
```properties
spring.session.jdbc.initialize-schema=always
```

**Files Modified**:
- `canteen-backend/Canteen-backend/src/main/resources/application.properties`

**Testing**:
Verified application starts successfully with MySQL database.

**Prevention**:
Always configure Spring Session schema initialization when switching databases.

---

### Bug ID: BUG-003
**Title**: Compilation Errors - Cannot Find Symbol for New Classes
**Severity**: High
**Priority**: P2
**Status**: Resolved

**Description**:
IDE and Maven compilation failed after adding new Java classes (Order, OrderItem, etc.).

**Steps to Reproduce**:
1. Add new Java entity classes
2. Try to compile or restart application
3. Observe compilation errors

**Expected Behavior**:
New classes should be recognized and compile successfully.

**Actual Behavior**:
Compiler reported "cannot find symbol" errors for new classes.

**Environment**:
- OS: Windows 10
- IDE: IntelliJ IDEA
- Backend: Spring Boot 3.x
- Build Tool: Maven

**Error Messages**:
```
cannot find symbol: class Order
cannot find symbol: class OrderItem
```

**Root Cause**:
IDE caching issues and incomplete project rebuild after adding new files.

**Solution**:
Forced complete project rebuild:
```bash
./mvnw clean install
```

**Files Modified**:
- All newly created Java files

**Testing**:
Verified all new classes compile successfully.

**Prevention**:
Always run `mvn clean install` after adding new Java classes to ensure proper compilation.

---

### Bug ID: BUG-004
**Title**: Circular Reference Error in JSON Serialization
**Severity**: High
**Priority**: P2
**Status**: Resolved

**Description**:
Order creation failed due to circular reference between Order and OrderItem entities during JSON serialization.

**Steps to Reproduce**:
1. Create a new order through the frontend
2. Submit order
3. Observe JSON serialization error

**Expected Behavior**:
Order should be created successfully and returned to frontend.

**Actual Behavior**:
Application crashed with JSON serialization error.

**Environment**:
- OS: Windows 10
- Backend: Spring Boot 3.x
- Database: MySQL 8.0

**Error Messages**:
```
Could not write JSON: Document nesting depth (1001) exceeds the maximum allowed (1000)
```

**Root Cause**:
Circular reference between Order and OrderItem entities when converting to JSON.

**Solution**:
Added `@JsonManagedReference` and `@JsonBackReference` annotations:
```java
// In Order.java
@OneToMany(mappedBy = "order", cascade = CascadeType.ALL)
@JsonManagedReference
private List<OrderItem> items;

// In OrderItem.java
@ManyToOne(fetch = FetchType.LAZY)
@JoinColumn(name = "order_id")
@JsonBackReference
private Order order;
```

**Files Modified**:
- `canteen-backend/Canteen-backend/src/main/java/com/canteen/Canteen/backend/model/Order.java`
- `canteen-backend/Canteen-backend/src/main/java/com/canteen/Canteen/backend/model/OrderItem.java`

**Testing**:
Verified orders can be created successfully without serialization errors.

**Prevention**:
Always handle circular references in JPA entities using Jackson annotations.

---

### Bug ID: BUG-005
**Title**: Theme Toggle Button Disappeared from Navbar
**Severity**: Medium
**Priority**: P3
**Status**: Resolved

**Description**:
Theme toggle button vanished from the navbar after UI modifications.

**Steps to Reproduce**:
1. Navigate to any page with navbar
2. Look for theme toggle button
3. Observe button is missing

**Expected Behavior**:
Theme toggle button should be visible in the navbar.

**Actual Behavior**:
Theme toggle button disappeared from navbar.

**Environment**:
- OS: Windows 10
- Browser: Chrome
- Frontend: HTML/CSS/JavaScript

**Error Messages**:
None - UI issue

**Root Cause**:
CSS changes for navbar logo affected the theme toggle's `position: fixed` style, and HTML structure was inconsistent across pages.

**Solution**:
1. Moved theme toggle button HTML into navbar `<ul>` on all pages
2. Updated CSS to make it a regular navbar item instead of fixed position
3. Ensured consistent placement across all pages

**Files Modified**:
- `canteen-html/index.html`
- `canteen-html/home.html`
- `canteen-html/checkout.html`
- `canteen-html/my-orders.html`
- `canteen-html/profile.html`
- `canteen-html/css/styles.css`

**Testing**:
Verified theme toggle button appears correctly on all pages.

**Prevention**:
Maintain consistent HTML structure and CSS classes across all pages.

---

### Bug ID: BUG-006
**Title**: Orders Not Showing in History After Placement
**Severity**: High
**Priority**: P1
**Status**: Resolved

**Description**:
Orders placed through checkout were not appearing in the order history page.

**Steps to Reproduce**:
1. Add items to cart
2. Proceed to checkout
3. Complete order
4. Check order history
5. Observe no orders listed

**Expected Behavior**:
Placed orders should appear in order history.

**Actual Behavior**:
Order history remained empty after placing orders.

**Environment**:
- OS: Windows 10
- Browser: Chrome
- Backend: Spring Boot 3.x
- Frontend: HTML/JavaScript

**Error Messages**:
None - functionality issue

**Root Cause**:
Checkout page was only clearing cart locally and not sending order data to the backend.

**Solution**:
1. Created `OrderItemDTO` and `OrderRequestDTO` for structured data transfer
2. Added `POST /api/orders` endpoint in `OrderController`
3. Updated `checkout.html` to send order data to backend

**Files Modified**:
- `canteen-backend/Canteen-backend/src/main/java/com/canteen/Canteen/backend/dto/OrderItemDTO.java`
- `canteen-backend/Canteen-backend/src/main/java/com/canteen/Canteen/backend/dto/OrderRequestDTO.java`
- `canteen-backend/Canteen-backend/src/main/java/com/canteen/Canteen/backend/controller/OrderController.java`
- `canteen-html/checkout.html`

**Testing**:
Verified orders appear in history after placement.

**Prevention**:
Always ensure frontend sends data to backend for persistence.

---

### Bug ID: BUG-007
**Title**: Menu Page Empty - Error Fetching Menu Items
**Severity**: High
**Priority**: P1
**Status**: Resolved

**Description**:
Menu page showed no items and displayed "error fetching" message.

**Steps to Reproduce**:
1. Navigate to menu page (index.html)
2. Observe empty menu
3. Check browser console for errors

**Expected Behavior**:
Menu should display all available meal items.

**Actual Behavior**:
Menu page was empty with error message.

**Environment**:
- OS: Windows 10
- Browser: Chrome
- Backend: Spring Boot 3.x
- Database: MySQL 8.0

**Error Messages**:
```
Error fetching menu items
```

**Root Cause**:
1. `/api/menu` endpoint was not in `permitAll()` list
2. `DataInitializer` was not properly populating the `meals` table

**Solution**:
1. Added `/api/menu` to `SecurityConfig.java` permitAll list
2. Fixed `DataInitializer` to always check and insert missing default meals

**Files Modified**:
- `canteen-backend/Canteen-backend/src/main/java/com/canteen/Canteen/backend/security/SecurityConfig.java`
- `canteen-backend/Canteen-backend/src/main/java/com/canteen/Canteen/backend/config/DataInitializer.java`

**Testing**:
Verified menu displays all items correctly.

**Prevention**:
Always ensure public endpoints are properly configured in security settings.

---

### Bug ID: BUG-008
**Title**: HQL Query Error - Invalid Date Subtraction
**Severity**: High
**Priority**: P2
**Status**: Resolved

**Description**:
Admin dashboard reports failed to load due to invalid HQL syntax for date operations.

**Steps to Reproduce**:
1. Navigate to admin dashboard
2. Click on Reports tab
3. Observe 500 error

**Expected Behavior**:
Reports should load with sales data and charts.

**Actual Behavior**:
Server returned 500 error with HQL syntax error.

**Environment**:
- OS: Windows 10
- Backend: Spring Boot 3.x
- Database: MySQL 8.0

**Error Messages**:
```
Operand of - is of type 'java.lang.Integer' which is not a temporal amount
```

**Root Cause**:
Incorrect HQL syntax for date subtraction (`CURRENT_DATE - 7`).

**Solution**:
Calculated date in Java and passed as parameter:
```java
LocalDateTime sevenDaysAgo = LocalDateTime.now().minusDays(7);
// Use :sevenDaysAgo parameter in query
```

**Files Modified**:
- `canteen-backend/Canteen-backend/src/main/java/com/canteen/Canteen/backend/controller/AdminDashboardController.java`

**Testing**:
Verified reports load successfully with correct date filtering.

**Prevention**:
Always use proper date handling in HQL queries with parameters.

---

### Bug ID: BUG-009
**Title**: Constructor Mismatch in DTO Classes
**Severity**: Medium
**Priority**: P3
**Status**: Resolved

**Description**:
Application failed to start due to constructor mismatch in DTO classes.

**Steps to Reproduce**:
1. Start Spring Boot application
2. Observe startup failure

**Expected Behavior**:
Application should start successfully.

**Actual Behavior**:
Application failed to start with constructor error.

**Environment**:
- OS: Windows 10
- Backend: Spring Boot 3.x

**Error Messages**:
```
constructor AdminDashboardStatsDTO in class AdminDashboardStatsDTO cannot be applied to given types
```

**Root Cause**:
Mismatch between constructor being called and available constructors in DTO classes.

**Solution**:
Explicitly added both all-args constructor and no-args constructor to DTO classes:
```java
@Data
@AllArgsConstructor
@NoArgsConstructor
public class AdminDashboardStatsDTO {
    // fields...
}
```

**Files Modified**:
- `canteen-backend/Canteen-backend/src/main/java/com/canteen/Canteen/backend/dto/AdminDashboardStatsDTO.java`
- `canteen-backend/Canteen-backend/src/main/java/com/canteen/Canteen/backend/dto/ReportDetailsDTO.java`

**Testing**:
Verified application starts successfully.

**Prevention**:
Always ensure DTO classes have proper constructors when using Lombok annotations.

---

### Bug ID: BUG-010
**Title**: Charts Not Displaying on Reports Page
**Severity**: Medium
**Priority**: P3
**Status**: Resolved

**Description**:
Charts were not rendering on the admin reports page despite data being available.

**Steps to Reproduce**:
1. Navigate to admin dashboard
2. Click Reports tab
3. Observe no charts displayed

**Expected Behavior**:
Charts should display revenue and top-selling items data.

**Actual Behavior**:
Charts were not visible on the page.

**Environment**:
- OS: Windows 10
- Browser: Chrome
- Frontend: HTML/JavaScript

**Error Messages**:
None - UI issue

**Root Cause**:
Missing Chart.js library script and JavaScript functions to initialize and render charts.

**Solution**:
1. Added Chart.js library script to admin.html
2. Added JavaScript functions to render charts
3. Ensured proper chart initialization

**Files Modified**:
- `canteen-backend/Canteen-backend/src/main/resources/static/admin.html`

**Testing**:
Verified charts display correctly with real data.

**Prevention**:
Always include required libraries and ensure proper JavaScript initialization for UI components.

---

## 📊 Bug Statistics

### Summary
- **Total Bugs**: 10
- **Critical**: 1
- **High**: 5
- **Medium**: 3
- **Low**: 1

### Categories
- **Security**: 2 bugs
- **Database**: 2 bugs
- **Frontend**: 3 bugs
- **Backend**: 2 bugs
- **Configuration**: 1 bug

### Resolution Time
- **Average**: 1-2 hours per bug
- **Longest**: BUG-007 (Menu page issues)
- **Shortest**: BUG-005 (Theme toggle)

## 🔧 Lessons Learned

1. **Security Configuration**: Always update security config when adding new public pages
2. **Database Migration**: Properly configure schema initialization when switching databases
3. **IDE Caching**: Force rebuild after adding new Java classes
4. **Circular References**: Handle JPA entity relationships with Jackson annotations
5. **Frontend Consistency**: Maintain consistent HTML structure across pages
6. **API Integration**: Ensure frontend properly sends data to backend
7. **Public Endpoints**: Configure security settings for all public APIs
8. **Date Handling**: Use proper date parameters in HQL queries
9. **DTO Constructors**: Ensure proper constructors when using Lombok
10. **UI Libraries**: Include required libraries and initialization code

## 🚀 Prevention Strategies

1. **Automated Testing**: Implement unit and integration tests
2. **Code Review**: Review all changes before deployment
3. **Documentation**: Maintain up-to-date documentation
4. **Environment Consistency**: Use consistent development environments
5. **Error Monitoring**: Implement proper error logging and monitoring 