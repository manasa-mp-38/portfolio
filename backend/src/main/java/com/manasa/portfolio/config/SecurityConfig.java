package com.manasa.portfolio.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.provisioning.InMemoryUserDetailsManager;
import org.springframework.security.web.SecurityFilterChain;

/**
 * Spring Security Configuration.
 * Protects administrative contact endpoints and authenticates admin credentials
 * while leaving public endpoints (contact form submission, static assets) openly accessible.
 */
@Configuration
@EnableWebSecurity
public class SecurityConfig {

    @Value("${portfolio.admin.username:admin}")
    private String adminUsername;

    @Value("${portfolio.admin.password:Admin@Manasa2025}")
    private String adminPassword;

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public UserDetailsService userDetailsService(PasswordEncoder passwordEncoder) {
        UserDetails admin = User.builder()
                .username(adminUsername)
                .password(passwordEncoder.encode(adminPassword))
                .roles("ADMIN")
                .build();
        return new InMemoryUserDetailsManager(admin);
    }

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
            .csrf(csrf -> csrf.disable())
            .cors(Customizer.withDefaults())
            .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
            .authorizeHttpRequests(auth -> auth
                // Allow CORS pre-flight requests
                .requestMatchers(HttpMethod.OPTIONS, "/**").permitAll()

                // Public Contact Submission Endpoint
                .requestMatchers(HttpMethod.POST, "/api/contact").permitAll()

                // Admin Login Verification Endpoint
                .requestMatchers(HttpMethod.POST, "/api/admin/login").permitAll()

                // Static Web Resources (if hosted from Spring Boot static folder)
                .requestMatchers("/", "/index.html", "/admin.html", "/css/**", "/js/**", "/assets/**", "/favicon.ico").permitAll()

                // Secured Administrative Endpoints
                .requestMatchers(HttpMethod.GET, "/api/contact/**").hasRole("ADMIN")
                .requestMatchers(HttpMethod.DELETE, "/api/contact/**").hasRole("ADMIN")
                .requestMatchers(HttpMethod.PATCH, "/api/contact/**").hasRole("ADMIN")
                .requestMatchers("/api/admin/**").hasRole("ADMIN")

                // Any other request must be authenticated
                .anyRequest().authenticated()
            )
            .httpBasic(Customizer.withDefaults());

        return http.build();
    }
}
