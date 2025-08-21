package com.canteen.Canteen.backend.dto;

import lombok.Data;
import lombok.AllArgsConstructor;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class TopSellingItemDTO {
    private String mealName;
    private long totalQuantity;
} 