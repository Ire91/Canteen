package com.canteen.Canteen.backend.controller;

import com.canteen.Canteen.backend.dto.AdminDashboardStatsDTO;
import com.canteen.Canteen.backend.dto.ReportDetailsDTO;
import com.canteen.Canteen.backend.dto.TopSellingItemDTO;
import com.canteen.Canteen.backend.model.Order;
import com.canteen.Canteen.backend.repository.OrderRepository;
import com.canteen.Canteen.backend.repository.StaffRepository;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/admin/dashboard")
@PreAuthorize("hasRole('ADMIN')")
public class AdminDashboardController {

    @Autowired
    private OrderRepository orderRepository;

    @Autowired
    private StaffRepository staffRepository;

    @PersistenceContext
    private EntityManager entityManager;

    @GetMapping("/stats")
    public ResponseEntity<AdminDashboardStatsDTO> getDashboardStats() {
        long totalOrders = orderRepository.count();
        long totalUsers = staffRepository.count();

        // Use the same logic as reports for real-time data
        LocalDateTime sevenDaysAgo = LocalDateTime.now().minusDays(7);

        // Real-time total revenue (all time)
        List<Order> allOrders = orderRepository.findAll();
        BigDecimal totalRevenue = allOrders.stream()
                .map(Order::getTotalAmount)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        // Real-time recent orders (last 5 by date)
        List<Order> recentOrders = orderRepository.findAll(
            PageRequest.of(0, 5, Sort.by(Sort.Direction.DESC, "orderDate"))
        ).getContent();

        // Real-time top selling items (by quantity)
        List<TopSellingItemDTO> topItems = orderRepository.findTopSellingItems(PageRequest.of(0, 5));

        AdminDashboardStatsDTO stats = new AdminDashboardStatsDTO(
            totalOrders,
            totalRevenue,
            totalUsers,
            recentOrders,
            topItems
        );

        return ResponseEntity.ok(stats);
    }

    @GetMapping("/reports")
    public ResponseEntity<ReportDetailsDTO> getDetailedReports() {
        ReportDetailsDTO report = new ReportDetailsDTO();

        // Sales by day (last 7 days)
        LocalDateTime sevenDaysAgo = LocalDateTime.now().minusDays(7);
        List<Map<String, Object>> salesByDay = (List<Map<String, Object>>) (List<?>) entityManager.createQuery(
            "SELECT NEW map(FUNCTION('DATE', o.orderDate) as date, SUM(o.totalAmount) as total) " +
            "FROM Order o WHERE o.orderDate >= :sevenDaysAgo GROUP BY FUNCTION('DATE', o.orderDate) ORDER BY date DESC",
            Map.class
        ).setParameter("sevenDaysAgo", sevenDaysAgo)
        .getResultList();
        report.setSalesByDay(salesByDay);

        // Sales by category
        List<Map<String, Object>> salesByCategory = (List<Map<String, Object>>) (List<?>) entityManager.createQuery(
            "SELECT NEW map(m.category as category, SUM(oi.price * oi.quantity) as total) " +
            "FROM OrderItem oi JOIN Meal m ON oi.mealId = m.id GROUP BY m.category",
            Map.class
        ).getResultList();
        report.setSalesByCategory(salesByCategory);

        // User activity (top 5 users by order count)
        List<Map<String, Object>> userActivity = (List<Map<String, Object>>) (List<?>) entityManager.createQuery(
            "SELECT NEW map(o.username as username, COUNT(o.id) as orders) " +
            "FROM Order o GROUP BY o.username ORDER BY orders DESC",
            Map.class
        ).setMaxResults(5).getResultList();
        report.setUserActivity(userActivity);
        
        // Add top selling items
        List<TopSellingItemDTO> topItems = orderRepository.findTopSellingItems(PageRequest.of(0, 5));
        report.setTopSellingItems(topItems);

        return ResponseEntity.ok(report);
    }
} 