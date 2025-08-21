package com.canteen.Canteen.backend.dto;

import com.canteen.Canteen.backend.model.Order;
import lombok.Data;
import java.math.BigDecimal;
import java.util.List;

@Data
public class AdminDashboardStatsDTO {
    private long totalOrders;
    private BigDecimal totalRevenue;
    private long totalUsers;
    private List<Order> recentOrders;
    private List<TopSellingItemDTO> topSellingItems;

    public AdminDashboardStatsDTO(long totalOrders, BigDecimal totalRevenue, long totalUsers, List<Order> recentOrders, List<TopSellingItemDTO> topSellingItems) {
        this.totalOrders = totalOrders;
        this.totalRevenue = totalRevenue;
        this.totalUsers = totalUsers;
        this.recentOrders = recentOrders;
        this.topSellingItems = topSellingItems;
    }

    public AdminDashboardStatsDTO() {}
} 