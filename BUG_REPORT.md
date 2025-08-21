# Bug Report - Union Bank Canteen Management System

## 📋 Overview

This document tracks all bugs, issues, and their resolutions encountered during the development of the Canteen Management System. This serves as a reference for future development and troubleshooting.

## 🐛 Critical Issues

### 1. Database Connection Issues

#### Issue: `Table 'canteen_db.spring_session' doesn't exist`
- **Date**: July 2025
- **Severity**: High
- **Status**: ✅ Resolved

**Description**:
```
Error: Table 'canteen_db.spring_session' doesn't exist
```

**Root Cause**: Spring Session JDBC was enabled but required tables weren't auto-created in MySQL.

**Solution**:
```properties
# Added to application.properties
spring.session.jdbc.initialize-schema=always
```

**Prevention**: Always verify Spring Session configuration when switching databases.

---

### 2. JWT Authentication Issues

#### Issue: `Whitelabel Error Page ... status=403. Access Denied`
- **Date**: July 2025
- **Severity**: High
- **Status**: ✅ Resolved

**Description**:
```
Whitelabel Error Page This application has no explicit mapping for /error, so you are seeing this as a fallback.
There was an unexpected error (type=Forbidden, status=403). Access Denied
```

**Root Cause**: New pages (`home.html`, `feedback.html`) were not whitelisted in Spring Security.

**Solution**:
```java
// Added to SecurityConfig.java
.requestMatchers(
    "/home.html",
    "/feedback.html",
    "/api/menu"
).permitAll()
```

**Prevention**: Always update security configuration when adding new public pages.

---

### 3. Circular Reference in JPA Entities

#### Issue: `Could not write JSON: Document nesting depth (1001) exceeds the maximum allowed (1000)`
- **Date**: July 2025
- **Severity**: High
- **Status**: ✅ Resolved

**Description**:
```
Error: Could not write JSON: Document nesting depth (1001) exceeds the maximum allowed (1000)
```

**Root Cause**: Circular reference between `Order` and `OrderItem` entities when converting to JSON.

**Solution**:
```java
// In Order.java
@JsonManagedReference
private List<OrderItem> items;

// In OrderItem.java
@JsonBackReference
private Order order;
```

**Prevention**: Always use `@JsonManagedReference` and `@JsonBackReference` for bidirectional relationships.

---

### 4. Compilation Errors

#### Issue: `cannot find symbol` for new Java classes
- **Date**: July 2025
- **Severity**: Medium
- **Status**: ✅ Resolved

**Description**:
```
Error: cannot find symbol: class FavoriteRepository
Error: cannot find symbol: class Order
```

**Root Cause**: IDE/compiler caching issues after adding new Java files.

**Solution**:
```bash
./mvnw clean install
```

**Prevention**: Always run clean build after adding new Java classes.

---

## 🔧 Medium Priority Issues

### 5. Frontend Image Loading Issues

#### Issue: "Quick order pictures are gone"
- **Date**: July 2025
- **Severity**: Medium
- **Status**: ✅ Resolved

**Description**: Images disappeared from quick order section after menu refactoring.

**Root Cause**: `getFrequentlyOrderedItems()` was returning hardcoded paths that didn't match actual image structure.

**Solution**:
```javascript
// Updated to filter from actual menuItems array
function getFrequentlyOrderedItems() {
    return menuItems.filter(item => 
        ['Jollof Rice with Chicken', 'Fried Rice with Beef', 'Pounded Yam with Egusi'].includes(item.name)
    );
}
```

**Prevention**: Always use dynamic data sources instead of hardcoded values.

---

### 6. Theme Toggle Button Issues

#### Issue: "Theme toggle button vanished" or "sitting on top of name tag"
- **Date**: July 2025
- **Severity**: Medium
- **Status**: ✅ Resolved

**Description**: Theme toggle button disappeared or was misaligned after navbar changes.

**Root Cause**: CSS changes affected `position: fixed` styling and HTML placement.

**Solution**:
```css
/* Moved theme toggle into navbar */
.theme-toggle {
    background-color: transparent;
    color: var(--header-text);
    border: none;
    border-radius: 50%;
    width: 40px;
    height: 40px;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    font-size: 1.2rem;
    transition: background-color 0.3s ease, color 0.3s ease, transform 0.2s ease;
}
```

**Prevention**: Test UI changes across all pages and screen sizes.

---

### 7. Order History Not Persisting

#### Issue: "Order not showing in history" after placing
- **Date**: July 2025
- **Severity**: Medium
- **Status**: ✅ Resolved

**Description**: Orders placed through checkout weren't appearing in order history.

**Root Cause**: Checkout page was only clearing cart locally, not sending data to backend.

**Solution**:
```javascript
// Added order submission to backend
const response = await fetch('/api/orders', {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify(orderRequest)
});
```

**Prevention**: Always verify data persistence when implementing new features.

---

## 🎨 UI/UX Issues

### 8. Admin Dashboard UI Problems

#### Issue: "Admin dashboard UI scrappy, navbar rounded edges"
- **Date**: July 2025
- **Severity**: Low
- **Status**: ✅ Resolved

**Description**: Admin page had visual inconsistencies and poor responsiveness.

**Root Cause**: Multiple UI changes introduced unintended regressions.

**Solution**: Reverted to original design and applied targeted fixes:
```css
/* Removed rounded edges from navbar */
.admin-navbar {
    border-radius: 0;
}

/* Fixed responsiveness */
@media (max-width: 768px) {
    .admin-sidebar {
        transform: translateX(-100%);
    }
}
```

**Prevention**: Test UI changes incrementally and maintain design consistency.

---

### 9. Tab Switching Issues

#### Issue: "Admin dashboard tabs not switching, moving up and down"
- **Date**: July 2025
- **Severity**: Medium
- **Status**: ✅ Resolved

**Description**: Admin dashboard tabs weren't switching content properly.

**Root Cause**: JavaScript functions for rendering content were accidentally deleted during real-time dashboard implementation.

**Solution**: Restored missing JavaScript functions:
```javascript
async function fetchAndDisplayOrders() {
    // Restored order management logic
}

async function fetchAndDisplayMenu() {
    // Restored menu management logic
}
```

**Prevention**: Always preserve existing functionality when adding new features.

---

## 🗄️ Database Issues

### 10. MySQL Safe Update Mode

#### Issue: `Error Code: 1175. You are using safe update mode`
- **Date**: July 2025
- **Severity**: Medium
- **Status**: ✅ Resolved

**Description**:
```
Error Code: 1175. You are using safe update mode and you tried to update a table without a WHERE that uses a KEY column
```

**Root Cause**: MySQL's `SQL_SAFE_UPDATES` mode prevented `DELETE FROM meals` without WHERE clause.

**Solution**:
```sql
SET SQL_SAFE_UPDATES = 0;
DELETE FROM meals;
SET SQL_SAFE_UPDATES = 1;
```

**Prevention**: Always use proper WHERE clauses in production SQL operations.

---

### 11. HQL Date Subtraction Error

#### Issue: `Operand of - is of type 'java.lang.Integer' which is not a temporal amount`
- **Date**: July 2025
- **Severity**: High
- **Status**: ✅ Resolved

**Description**:
```
org.hibernate.query.SemanticException: Operand of - is of type 'java.lang.Integer' which is not a temporal amount
```

**Root Cause**: Incorrect HQL syntax for date subtraction (`CURRENT_DATE - 7`).

**Solution**:
```java
// Calculate date in Java instead of HQL
LocalDateTime sevenDaysAgo = LocalDateTime.now().minusDays(7);

// Use parameter in query
.setParameter("sevenDaysAgo", sevenDaysAgo)
```

**Prevention**: Use Java date calculations instead of HQL date arithmetic.

---

## 📊 API Issues

### 12. Constructor Mismatch Errors

#### Issue: `constructor AdminDashboardStatsDTO cannot be applied to given types`
- **Date**: July 2025
- **Severity**: Medium
- **Status**: ✅ Resolved

**Description**:
```
constructor AdminDashboardStatsDTO in class AdminDashboardStatsDTO cannot be applied to given types; required: no arguments found: long,BigDecimal,long,List<Order>,List<TopSellingItemDTO>
```

**Root Cause**: Mismatch between constructor calls and available constructors due to Lombok changes.

**Solution**:
```java
// Added explicit constructors
@AllArgsConstructor
@NoArgsConstructor
public class AdminDashboardStatsDTO {
    // ... fields
}
```

**Prevention**: Always verify constructor availability when using Lombok annotations.

---

### 13. Private Field Access Error

#### Issue: `The field ReportDetailsDTO.salesByCategory is not visible`
- **Date**: July 2025
- **Severity**: Medium
- **Status**: ✅ Resolved

**Description**:
```
The field ReportDetailsDTO.salesByCategory is not visible
```

**Root Cause**: Attempting to directly assign to private fields instead of using public setters.

**Solution**:
```java
// Use public setters instead of direct assignment
report.setSalesByCategory(salesByCategory);
report.setUserActivity(userActivity);
report.setTopSellingItems(topItems);
```

**Prevention**: Always use public getter/setter methods for DTOs.

---

## 🎯 Chart.js Issues

### 14. Charts Not Displaying

#### Issue: "Charts not showing on Reports page"
- **Date**: July 2025
- **Severity**: Medium
- **Status**: ✅ Resolved

**Description**: Chart.js charts weren't rendering on the Reports page.

**Root Cause**: Missing Chart.js library script and JavaScript initialization code.

**Solution**:
```html
<!-- Added Chart.js library -->
<script src="https://cdn.jsdelivr.net/npm/chart.js"></script>

<!-- Added chart initialization functions -->
<script>
function renderRevenueByDayChart(data) {
    // Chart rendering logic
}

function renderTopItemsChart(data) {
    // Chart rendering logic
}
</script>
```

**Prevention**: Always include required libraries and initialization code.

---

## 🔍 Performance Issues

### 15. Menu Loading Performance

#### Issue: "Menu page is empty / error fetching"
- **Date**: July 2025
- **Severity**: Medium
- **Status**: ✅ Resolved

**Description**: Menu page showed empty or error after switching to dynamic loading.

**Root Cause**: Database was empty and `/api/menu` endpoint wasn't whitelisted.

**Solution**:
```java
// Added to SecurityConfig.java
.requestMatchers("/api/menu").permitAll()

// Updated DataInitializer to always populate meals
private void seedMeals() {
    defaultMeals.forEach(meal -> {
        if (mealRepository.findByName(meal.getName()).isEmpty()) {
            mealRepository.save(meal);
        }
    });
}
```

**Prevention**: Always verify data initialization and endpoint accessibility.

---

## 📝 Lessons Learned

### Development Best Practices

1. **Always test incrementally**: Make small changes and test immediately
2. **Preserve existing functionality**: Don't remove working code without replacement
3. **Use proper error handling**: Implement comprehensive try-catch blocks
4. **Document API changes**: Update security config when adding new endpoints
5. **Test across browsers**: Ensure compatibility with different browsers
6. **Backup before major changes**: Create checkpoints before significant refactoring

### Database Best Practices

1. **Use proper relationships**: Implement correct JPA annotations
2. **Handle circular references**: Use `@JsonManagedReference` and `@JsonBackReference`
3. **Initialize data properly**: Ensure default data is always available
4. **Use appropriate indexes**: Optimize query performance
5. **Test with real data**: Use realistic data sets for testing

### Frontend Best Practices

1. **Maintain consistency**: Use consistent styling across all pages
2. **Test responsiveness**: Verify mobile and desktop compatibility
3. **Handle errors gracefully**: Provide user-friendly error messages
4. **Optimize performance**: Minimize unnecessary API calls
5. **Use semantic HTML**: Improve accessibility and SEO

### Security Best Practices

1. **Whitelist public endpoints**: Always update security config for new public pages
2. **Validate user input**: Implement proper input validation
3. **Use HTTPS in production**: Secure data transmission
4. **Implement proper authentication**: Use JWT tokens correctly
5. **Log security events**: Monitor for suspicious activity

## 🚀 Future Improvements

### Planned Enhancements

1. **Real-time notifications**: WebSocket implementation for order updates
2. **Payment integration**: Stripe/PayPal payment processing
3. **Mobile app**: React Native mobile application
4. **Advanced analytics**: More detailed reporting and insights
5. **Inventory management**: Stock tracking and alerts
6. **Multi-language support**: Internationalization (i18n)
7. **Email notifications**: Order confirmations and status updates
8. **Print functionality**: Receipt printing for orders

### Technical Debt

1. **Add comprehensive tests**: Unit, integration, and E2E tests
2. **Implement caching**: Redis for session and data caching
3. **Add monitoring**: Application performance monitoring
4. **Improve error handling**: More detailed error messages
5. **Optimize database queries**: Add proper indexing and query optimization
6. **Implement rate limiting**: Prevent API abuse
7. **Add API documentation**: Swagger/OpenAPI documentation
8. **Implement logging**: Structured logging with log levels

---

**Note**: This bug report serves as a comprehensive reference for the development team and future maintainers. It should be updated as new issues are discovered and resolved. 