package com.canteen.Canteen.backend.config;

import com.canteen.Canteen.backend.model.Meal;
import com.canteen.Canteen.backend.model.Staff;
import com.canteen.Canteen.backend.repository.MealRepository;
import com.canteen.Canteen.backend.repository.StaffRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.util.Arrays;
import java.util.List;

@Component
public class DataInitializer implements CommandLineRunner {

    private final StaffRepository staffRepository;
    private final MealRepository mealRepository;
    private final PasswordEncoder passwordEncoder;

    public DataInitializer(StaffRepository staffRepository, MealRepository mealRepository, PasswordEncoder passwordEncoder) {
        this.staffRepository = staffRepository;
        this.mealRepository = mealRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public void run(String... args) {
        seedStaff();
        seedMeals();
    }

    private void seedStaff() {
        if (staffRepository.findByUsername("admin").isEmpty()) {
            Staff admin = Staff.builder()
                    .username("admin")
                    .password(passwordEncoder.encode("admin123"))
                    .name("Admin User")
                    .role("ADMIN")
                    .department("IT")
                    .staffId("UB001")
                    .build();
            staffRepository.save(admin);
        }

        if (staffRepository.findByUsername("user").isEmpty()) {
            Staff user = Staff.builder()
                    .username("user")
                    .password(passwordEncoder.encode("user123"))
                    .name("Regular User")
                    .role("USER")
                    .department("Operations")
                    .staffId("USR001")
                    .build();
            staffRepository.save(user);
        }
    }

    private void seedMeals() {
        // This improved logic checks for each meal individually, so it will add any missing default meals
        // without needing to clear the table first.
        List<Meal> defaultMeals = Arrays.asList(
            newMeal("Jollof Rice with Chicken", "Spicy Nigerian jollof rice served with grilled chicken and vegetables", new BigDecimal("1500"), "lunch", "images/jollof-rice-and-chicken.jpg"),
            newMeal("Yam Porridge", "Delicious yam porridge cooked with vegetables and spices", new BigDecimal("1200"), "breakfast", "images/yam-porridge.jpg"),
            newMeal("Spaghetti", "Classic spaghetti pasta served with tomato sauce and beef", new BigDecimal("1100"), "lunch", "images/spaghetti.jpg"),
            newMeal("Pepper Soup", "Traditional Nigerian pepper soup with goat meat or fish", new BigDecimal("1300"), "dinner", "images/pepper-soup.jpg"),
            newMeal("Moin Moin & Eko", "Steamed bean pudding served with solidified corn meal", new BigDecimal("800"), "breakfast", "images/moin-moin-and-eko.jpg"),
            newMeal("Fried Rice & Fish", "Nigerian fried rice served with fried fish and coleslaw", new BigDecimal("1500"), "lunch", "images/fried-rice-and-fish.jpg"),
            newMeal("Pounded Yam & Egusi", "Smooth pounded yam served with melon seed soup and meat", new BigDecimal("1700"), "dinner", "images/pounded-yam-and-egusi.jpg"),
            newMeal("Meat Pie", "Baked pastry filled with seasoned minced meat and vegetables", new BigDecimal("500"), "snacks", "images/meat-pie.jpg"),
            newMeal("Fruit Salad", "Fresh tropical fruits mixed with yogurt", new BigDecimal("800"), "snacks", "images/fruit-salad.jpg")
        );

        defaultMeals.forEach(meal -> {
            if (mealRepository.findByName(meal.getName()).isEmpty()) {
                mealRepository.save(meal);
            }
        });
    }

    private Meal newMeal(String name, String description, BigDecimal price, String category, String imageUrl) {
        Meal meal = new Meal();
        meal.setName(name);
        meal.setDescription(description);
        meal.setPrice(price);
        meal.setCategory(category);
        meal.setImageUrl(imageUrl);
        meal.setAvailable(true);
        return meal;
    }
}
