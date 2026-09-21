package com.manasa.portfolio;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

/**
 * Main entry point for the Manasa M P Portfolio Backend application.
 * Developed with Spring Boot, Spring Data JPA, and Spring Security.
 */
@SpringBootApplication
public class PortfolioApplication {

    public static void main(String[] args) {
        SpringApplication.run(PortfolioApplication.class, args);
        System.out.println("=================================================");
        System.out.println("🚀 Manasa M P Portfolio Backend is Running!");
        System.out.println("📡 Server URL: http://localhost:8080");
        System.out.println("📨 Contact API: http://localhost:8080/api/contact");
        System.out.println("🔒 Admin API:   http://localhost:8080/api/admin");
        System.out.println("=================================================");
    }
}
