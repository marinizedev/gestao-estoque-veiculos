package br.com.marinize.gestaoestoqueveiculos.security;

import java.util.Map;

import jakarta.servlet.http.HttpServletRequest;
import org.springframework.security.web.csrf.CsrfToken;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class CsrfController {

    @GetMapping("/api/csrf")
    public Map<String, String> obterTokenCsrf(HttpServletRequest request) {
        CsrfToken token = (CsrfToken) request.getAttribute("_csrf");

        if (token == null) {
            throw new IllegalStateException("Token CSRF não foi disponibilizado pelo Spring Security.");
        }

        return Map.of(
            "headerName", token.getHeaderName(),
            "token", token.getToken()
        );
    }
}
