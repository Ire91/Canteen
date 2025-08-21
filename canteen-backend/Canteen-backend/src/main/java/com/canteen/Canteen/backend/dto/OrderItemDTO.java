package com.canteen.Canteen.backend.dto;

import java.math.BigDecimal;

public class OrderItemDTO {
    private Integer mealId;
    private String mealName;
    private int quantity;
    private BigDecimal price;

    // Getters and Setters
    public Integer getMealId() { return mealId; }
    public void setMealId(Integer mealId) { this.mealId = mealId; }
    public String getMealName() { return mealName; }
    public void setMealName(String mealName) { this.mealName = mealName; }
    public int getQuantity() { return quantity; }
    public void setQuantity(int quantity) { this.quantity = quantity; }
    public BigDecimal getPrice() { return price; }
    public void setPrice(BigDecimal price) { this.price = price; }
} 