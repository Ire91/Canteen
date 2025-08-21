package com.canteen.Canteen.backend.controller;

import com.canteen.Canteen.backend.dto.OrderRequestDTO;
import com.canteen.Canteen.backend.model.Order;
import com.canteen.Canteen.backend.model.OrderItem;
import com.canteen.Canteen.backend.repository.OrderRepository;
import com.canteen.Canteen.backend.security.jwt.JwtUtil;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;
import org.springframework.http.HttpStatus;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/api/orders")
public class OrderController {

    @Autowired
    private OrderRepository orderRepository;

    @Autowired
    private JwtUtil jwtUtil;

    @PostMapping
    public ResponseEntity<Order> createOrder(@RequestBody OrderRequestDTO orderRequest, HttpServletRequest request) {
        String username = getUsernameFromRequest(request);
        if (username == null) {
            return ResponseEntity.status(401).build(); // Unauthorized
        }

        Order order = new Order();
        order.setUsername(username);
        order.setOrderDate(LocalDateTime.now());
        order.setStatus("Pending");

        List<OrderItem> orderItems = orderRequest.getItems().stream().map(itemDTO -> {
            OrderItem item = new OrderItem();
            item.setOrder(order);
            item.setMealId(itemDTO.getMealId());
            item.setMealName(itemDTO.getMealName());
            item.setQuantity(itemDTO.getQuantity());
            item.setPrice(itemDTO.getPrice());
            return item;
        }).collect(java.util.stream.Collectors.toList());

        order.setItems(orderItems);

        BigDecimal totalAmount = orderItems.stream()
                .map(item -> item.getPrice().multiply(new BigDecimal(item.getQuantity())))
                .reduce(BigDecimal.ZERO, BigDecimal::add);
        order.setTotalAmount(totalAmount);

        Order savedOrder = orderRepository.save(order);
        return ResponseEntity.ok(savedOrder);
    }

    @GetMapping
    public ResponseEntity<List<Order>> getOrderHistory(HttpServletRequest request) {
        String username = getUsernameFromRequest(request);
        List<Order> orders = orderRepository.findByUsername(username);
        return ResponseEntity.ok(orders);
    }

    // --- ADMIN ENDPOINTS ---

    @GetMapping("/admin/all")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<Order>> getAllOrders() {
        List<Order> allOrders = orderRepository.findAll();
        return ResponseEntity.ok(allOrders);
    }
    
    @PutMapping("/admin/{orderId}/status")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Order> updateOrderStatus(@PathVariable Long orderId, @RequestBody String newStatus) {
        return orderRepository.findById(orderId)
                .map(order -> {
                    order.setStatus(newStatus);
                    Order updatedOrder = orderRepository.save(order);
                    return ResponseEntity.ok(updatedOrder);
                })
                .orElse(ResponseEntity.notFound().build());
    }


    @DeleteMapping
    @Transactional
    public ResponseEntity<Void> clearOrderHistory(HttpServletRequest request) {
        String username = getUsernameFromRequest(request);
        orderRepository.deleteByUsername(username);
        return ResponseEntity.ok().build();
    }

    @DeleteMapping("/{orderId}")
    public ResponseEntity<Void> deleteOrder(@PathVariable Long orderId, HttpServletRequest request) {
        String username = getUsernameFromRequest(request);
        if (username == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }

        return orderRepository.findById(orderId)
                .map(order -> {
                    if (!order.getUsername().equals(username)) {
                        // User does not own this order
                        return new ResponseEntity<Void>(HttpStatus.FORBIDDEN);
                    }
                    orderRepository.delete(order);
                    return ResponseEntity.ok().<Void>build();
                })
                .orElse(ResponseEntity.notFound().build());
    }

    private String getUsernameFromRequest(HttpServletRequest request) {
        String authHeader = request.getHeader("Authorization");
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            // This case should ideally be handled by Spring Security,
            // but as a fallback, we prevent null pointer exceptions.
            return null;
        }
        String token = authHeader.substring(7);
        return jwtUtil.extractUsername(token);
    }
} 