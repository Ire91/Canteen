package com.canteen.Canteen.backend.controller;

import com.canteen.Canteen.backend.dto.MealDTO;
import com.canteen.Canteen.backend.model.Meal;
import com.canteen.Canteen.backend.repository.MealRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/menu")
public class MenuController {

    @Autowired
    private MealRepository mealRepository;

    @GetMapping
    public List<Meal> getAllMeals() {
        return mealRepository.findAll();
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public Meal addMeal(@RequestBody MealDTO mealDTO) {
        Meal meal = new Meal();
        meal.setName(mealDTO.getName());
        meal.setDescription(mealDTO.getDescription());
        meal.setPrice(mealDTO.getPrice());
        meal.setCategory(mealDTO.getCategory());
        meal.setImageUrl(mealDTO.getImageUrl());
        meal.setAvailable(mealDTO.isAvailable());
        return mealRepository.save(meal);
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Meal> updateMeal(@PathVariable Long id, @RequestBody MealDTO mealDTO) {
        return mealRepository.findById(id)
                .map(meal -> {
                    meal.setName(mealDTO.getName());
                    meal.setDescription(mealDTO.getDescription());
                    meal.setPrice(mealDTO.getPrice());
                    meal.setCategory(mealDTO.getCategory());
                    meal.setImageUrl(mealDTO.getImageUrl());
                    meal.setAvailable(mealDTO.isAvailable());
                    return ResponseEntity.ok(mealRepository.save(meal));
                })
                .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> deleteMeal(@PathVariable Long id) {
        if (!mealRepository.existsById(id)) {
            return ResponseEntity.notFound().build();
        }
        mealRepository.deleteById(id);
        return ResponseEntity.noContent().build();
    }
} 