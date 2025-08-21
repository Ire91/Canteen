package com.canteen.Canteen.backend.controller;

import com.canteen.Canteen.backend.dto.FeedbackDTO;
import com.canteen.Canteen.backend.model.Feedback;
import com.canteen.Canteen.backend.repository.FeedbackRepository;
import com.canteen.Canteen.backend.security.jwt.JwtUtil;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;

@RestController
@RequestMapping("/api/feedback")
public class FeedbackController {

    @Autowired
    private FeedbackRepository feedbackRepository;

    @Autowired
    private JwtUtil jwtUtil;

    @PostMapping
    public ResponseEntity<Void> submitFeedback(@RequestBody FeedbackDTO feedbackDTO, HttpServletRequest request) {
        String username = getUsernameFromRequest(request);
        if (username == null) {
            return ResponseEntity.status(401).build(); // Unauthorized
        }

        Feedback feedback = new Feedback();
        feedback.setUsername(username);
        feedback.setRating(feedbackDTO.getRating());
        feedback.setComments(feedbackDTO.getComments());
        feedback.setSubmissionDate(LocalDateTime.now());

        feedbackRepository.save(feedback);

        return ResponseEntity.ok().build();
    }

    private String getUsernameFromRequest(HttpServletRequest request) {
        String authHeader = request.getHeader("Authorization");
        if (authHeader != null && authHeader.startsWith("Bearer ")) {
            String token = authHeader.substring(7);
            return jwtUtil.extractUsername(token);
        }
        return null;
    }
} 