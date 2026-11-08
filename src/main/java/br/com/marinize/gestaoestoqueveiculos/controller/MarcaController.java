package br.com.marinize.gestaoestoqueveiculos.controller;

import br.com.marinize.gestaoestoqueveiculos.dto.MarcaRequest;
import br.com.marinize.gestaoestoqueveiculos.dto.MarcaResponse;
import br.com.marinize.gestaoestoqueveiculos.service.MarcaService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/marcas")
public class MarcaController {
    private final MarcaService service;
    public MarcaController(MarcaService service) { this.service = service; }
    @GetMapping public List<MarcaResponse> listar() { return service.listar(); }
    @GetMapping("/{id}") public MarcaResponse buscar(@PathVariable Long id) { return service.buscar(id); }
    @PostMapping @ResponseStatus(HttpStatus.CREATED)
    public MarcaResponse criar(@Valid @RequestBody MarcaRequest request) { return service.criar(request); }
    @PutMapping("/{id}") public MarcaResponse atualizar(@PathVariable Long id, @Valid @RequestBody MarcaRequest request) {
        return service.atualizar(id, request);
    }
    @DeleteMapping("/{id}") @ResponseStatus(HttpStatus.NO_CONTENT)
    public void excluir(@PathVariable Long id) { service.excluir(id); }
}
