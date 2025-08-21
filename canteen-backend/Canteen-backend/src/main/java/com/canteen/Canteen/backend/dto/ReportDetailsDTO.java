package com.canteen.Canteen.backend.dto;

import lombok.Data;
import java.math.BigDecimal;
import java.util.List;
import java.util.Map;

@Data
public class ReportDetailsDTO {
    private List<Map<String, Object>> salesByDay; // [{date: '2024-07-01', total: 5000}, ...]
    private List<Map<String, Object>> salesByCategory; // [{category: 'lunch', total: 12000}, ...]
    private List<Map<String, Object>> userActivity; // [{username: 'john', orders: 5}, ...]
    private List<TopSellingItemDTO> topSellingItems;

    public void setSalesByDay(List<Map<String, Object>> salesByDay) { this.salesByDay = salesByDay; }
    public void setSalesByCategory(List<Map<String, Object>> salesByCategory) { this.salesByCategory = salesByCategory; }
    public void setUserActivity(List<Map<String, Object>> userActivity) { this.userActivity = userActivity; }
    public void setTopSellingItems(List<TopSellingItemDTO> topSellingItems) { this.topSellingItems = topSellingItems; }
} 