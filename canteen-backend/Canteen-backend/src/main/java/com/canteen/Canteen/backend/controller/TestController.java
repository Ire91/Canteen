package com.canteen.Canteen.backend.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMethod;

@RestController
@RequestMapping("/api/test")
public class TestController {

    @GetMapping("/public")
    public String publicEndpoint() {
        return "This is a public endpoint";
    }

    @GetMapping("/protected")
    // @PreAuthorize("hasRole('USER')")
    public String protectedEndpoint() {
        return "This is a protected endpoint (requires USER role)";
    }

    @GetMapping("/admin")
    // @PreAuthorize("hasRole('ADMIN')")
    public String adminEndpoint() {
        return "This is an admin endpoint";
    }
}

@Controller
class RootRedirectController {
    @RequestMapping(value = "/", method = RequestMethod.GET)
    public String redirectToHome() {
        return "redirect:/home.html";
    }
}
