package com.manasa.portfolio.controller;

import com.manasa.portfolio.dto.ApiResponse;
import com.manasa.portfolio.dto.LoginRequest;
import com.manasa.portfolio.dto.LoginResponse;
import jakarta.validation.Valid;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.web.bind.annotation.*;

import java.nio.charset.StandardCharsets;
import java.util.Base64;

/**
 * Controller handling Admin authentication and verification.
 */
@RestController
@RequestMapping("/api/admin")
@CrossOrigin(origins = "*", maxAge = 3600)
public class AdminController {

    private static final Logger logger = LoggerFactory.getLogger(AdminController.class);

    @Value("${portfolio.admin.username:admin}")
    private String adminUsername;

    @Value("${portfolio.admin.password:Admin@Manasa2025}")
    private String adminPassword;

    /**
     * Admin login endpoint.
     * Validates credentials against securely injected environment/config values.
     * Returns a base64 Basic Auth token that can be safely used in the Authorization header.
     */
    @PostMapping("/login")
    public ResponseEntity<ApiResponse<LoginResponse>> login(@Valid @RequestBody LoginRequest loginRequest) {
        logger.info("Admin login attempt for username: {}", loginRequest.getUsername());

        if (adminUsername.equals(loginRequest.getUsername()) && adminPassword.equals(loginRequest.getPassword())) {
            String rawCredentials = adminUsername + ":" + adminPassword;
            String token = Base64.getEncoder().encodeToString(rawCredentials.getBytes(StandardCharsets.UTF_8));
            LoginResponse response = new LoginResponse(true, adminUsername, token, "Authentication successful.");
            logger.info("Admin authentication successful for user: {}", adminUsername);
            return ResponseEntity.ok(ApiResponse.success("Admin login successful.", response));
        }

        logger.warn("Admin authentication failed for user: {}", loginRequest.getUsername());
        throw new BadCredentialsException("Invalid username or password.");
    }

    /**
     * Verify whether current credentials / session are valid.
     */
    @GetMapping("/verify")
    public ResponseEntity<ApiResponse<String>> verifySession() {
        return ResponseEntity.ok(ApiResponse.success("Admin session is active."));
    }
}
