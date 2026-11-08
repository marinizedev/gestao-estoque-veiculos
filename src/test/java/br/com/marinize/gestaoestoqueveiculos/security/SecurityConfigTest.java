package br.com.marinize.gestaoestoqueveiculos.security;

import br.com.marinize.gestaoestoqueveiculos.controller.MarcaController;
import br.com.marinize.gestaoestoqueveiculos.dto.MarcaRequest;
import br.com.marinize.gestaoestoqueveiculos.dto.MarcaResponse;
import br.com.marinize.gestaoestoqueveiculos.service.MarcaService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.context.annotation.Import;
import org.springframework.http.MediaType;
import org.springframework.mock.web.MockHttpSession;
import org.springframework.test.context.TestPropertySource;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.MvcResult;

import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.csrf;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.user;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@WebMvcTest(controllers = MarcaController.class)
@Import({SecurityConfig.class, AdminUserConfig.class})
@TestPropertySource(properties = {
    "app.security.admin.username=test-admin",
    "app.security.admin.password=Teste-Apenas-Teste-2026!"
})
class SecurityConfigTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private MarcaService marcaService;

    @Test
    void deveNegarConsultaSemLogin() throws Exception {
        mockMvc.perform(get("/api/marcas"))
                .andExpect(status().isUnauthorized());
    }

    @Test
    void deveNegarCadastroSemLoginMesmoComTokenCsrf() throws Exception {
        mockMvc.perform(post("/api/marcas")
                        .with(csrf())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                            {"nome":"Toyota"}
                            """))
                .andExpect(status().isUnauthorized());
    }

    @Test
    void deveNegarAlteracaoSemTokenCsrfMesmoComAdministrador() throws Exception {
        mockMvc.perform(post("/api/marcas")
                        .with(user("test-admin").roles("ADMIN"))
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                            {"nome":"Toyota"}
                            """))
                .andExpect(status().isForbidden());
    }

    @Test
    void administradorAutenticadoPodeConsultarMarcas() throws Exception {
        when(marcaService.listar())
                .thenReturn(List.of(new MarcaResponse(1L, "Toyota")));

        mockMvc.perform(get("/api/marcas")
                        .with(user("test-admin").roles("ADMIN")))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].nome").value("Toyota"));
    }

    @Test
    void administradorPodeCadastrarComTokenCsrfValido() throws Exception {
        when(marcaService.criar(any(MarcaRequest.class)))
                .thenReturn(new MarcaResponse(2L, "Honda"));

        mockMvc.perform(post("/api/marcas")
                        .with(user("test-admin").roles("ADMIN"))
                        .with(csrf())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                            {"nome":"Honda"}
                            """))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.nome").value("Honda"));
    }

    @Test
    void loginRealCriaSessaoQuePermiteConsultarApi() throws Exception {
        when(marcaService.listar()).thenReturn(List.of());

        MvcResult resultadoLogin = mockMvc.perform(post("/login")
                        .with(csrf())
                        .contentType(MediaType.APPLICATION_FORM_URLENCODED)
                        .param("username", "test-admin")
                        .param("password", "Teste-Apenas-Teste-2026!"))
                .andExpect(status().is3xxRedirection())
                .andReturn();

        MockHttpSession sessao =
                (MockHttpSession) resultadoLogin.getRequest().getSession(false);

        assertThat(sessao).isNotNull();

        mockMvc.perform(get("/api/marcas").session(sessao))
                .andExpect(status().isOk());
    }
}
