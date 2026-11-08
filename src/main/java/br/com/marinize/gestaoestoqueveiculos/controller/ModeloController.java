package br.com.marinize.gestaoestoqueveiculos.controller;

import br.com.marinize.gestaoestoqueveiculos.dto.ModeloRequest;
import br.com.marinize.gestaoestoqueveiculos.dto.ModeloResponse;
import br.com.marinize.gestaoestoqueveiculos.service.ModeloService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/modelos")
public class ModeloController {
    private final ModeloService service;
    public ModeloController(ModeloService service) { this.service = service; }
    @GetMapping public List<ModeloResponse> listar() { return service.listar(); }
    @GetMapping("/{id}") public ModeloResponse buscar(@PathVariable Long id) { return service.buscar(id); }
    @PostMapping @ResponseStatus(HttpStatus.CREATED)
    public ModeloResponse criar(@Valid @RequestBody ModeloRequest request) { return service.criar(request); }
    @PutMapping("/{id}") public ModeloResponse atualizar(@PathVariable Long id, @Valid @RequestBody ModeloRequest request) {
        return service.atualizar(id, request);
    }
    @DeleteMapping("/{id}") @ResponseStatus(HttpStatus.NO_CONTENT)
    public void excluir(@PathVariable Long id) { service.excluir(id); }
}
