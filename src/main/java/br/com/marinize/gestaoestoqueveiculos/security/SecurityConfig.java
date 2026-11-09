package br.com.marinize.gestaoestoqueveiculos.security;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.http.HttpStatus;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.HttpStatusEntryPoint;
import org.springframework.security.web.servlet.util.matcher.PathPatternRequestMatcher;

@Configuration
public class SecurityConfig {

    @Bean
    SecurityFilterChain securityFilterChain(HttpSecurity http ) throws Exception {
        http
            // 1. Recursos públicos necessários para exibir o login
            //    e obter o token CSRF inicial.
            .authorizeHttpRequests(auth -> auth
                .requestMatchers(
                    HttpMethod.GET,
                    "/login.html",
                    "/login.js",
                    "/styles.css",
                    "/visual-addon.css",
                    "/assets/**",
                    "/api/csrf"
                ).permitAll()

                // 2. O restante do sistema exige uma conta administradora.
                .anyRequest().hasRole("ADMIN")
            )

            // 3. Login do Spring Security com nossa página personalizada.
            .formLogin(form -> form
                .loginPage("/login.html")
                .loginProcessingUrl("/login")
                .defaultSuccessUrl("/", true)
                .failureUrl("/login.html?error")
                .permitAll()
            )

            // 4. Logout por POST; a proteção CSRF continua habilitada.
            .logout(logout -> logout
                .logoutUrl("/logout")
                .logoutSuccessUrl("/login.html?logout")
                .permitAll()
            )

            // 5. Chamadas da API sem sessão recebem 401, em vez de
            //    serem redirecionadas para a página HTML de login.
            .exceptionHandling(ex -> ex
                .defaultAuthenticationEntryPointFor(
                    new HttpStatusEntryPoint(HttpStatus.UNAUTHORIZED),
                    PathPatternRequestMatcher.pathPattern("/api/**")
                )
            );

        // Importante: não desabilite a proteção CSRF.
        return http.build();
    }
}
