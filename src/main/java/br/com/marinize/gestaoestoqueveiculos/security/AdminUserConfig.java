package br.com.marinize.gestaoestoqueveiculos.security;

import java.nio.charset.StandardCharsets;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.provisioning.InMemoryUserDetailsManager;

@Configuration
public class AdminUserConfig {

    @Bean
    PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    UserDetailsService userDetailsService(
            PasswordEncoder passwordEncoder,
            @Value("${app.security.admin.username}") String username,
            @Value("${app.security.admin.password}") String rawPassword) {

        if (username.isBlank()) {
            throw new IllegalStateException("APP_ADMIN_USERNAME precisa estar configurada.");
        }

        int passwordBytes = rawPassword.getBytes(StandardCharsets.UTF_8).length;
        if (rawPassword.length() < 14 || passwordBytes > 72) {
            throw new IllegalStateException(
                "A senha administrativa deve ter pelo menos 14 caracteres e no máximo 72 bytes."
            );
        }

        var admin = User.withUsername(username.trim())
            .password(passwordEncoder.encode(rawPassword))
            .roles("ADMIN")
            .build();

        return new InMemoryUserDetailsManager(admin);
    }
}
