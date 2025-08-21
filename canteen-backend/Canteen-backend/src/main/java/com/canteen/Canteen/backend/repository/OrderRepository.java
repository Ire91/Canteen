package com.canteen.Canteen.backend.repository;

import com.canteen.Canteen.backend.model.Order;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import com.canteen.Canteen.backend.dto.TopSellingItemDTO;
import org.springframework.data.domain.Pageable;

import java.util.List;

@Repository
public interface OrderRepository extends JpaRepository<Order, Long> {
    List<Order> findByUsername(String username);
    void deleteByUsername(String username);

    @Query("SELECT new com.canteen.Canteen.backend.dto.TopSellingItemDTO(oi.mealName, SUM(oi.quantity)) FROM OrderItem oi GROUP BY oi.mealName ORDER BY SUM(oi.quantity) DESC")
    List<TopSellingItemDTO> findTopSellingItems(Pageable pageable);
} 