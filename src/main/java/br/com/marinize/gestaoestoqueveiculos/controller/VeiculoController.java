package br.com.marinize.gestaoestoqueveiculos.controller;

import br.com.marinize.gestaoestoqueveiculos.dto.VeiculoRequest;
import br.com.marinize.gestaoestoqueveiculos.dto.VeiculoResponse;
import br.com.marinize.gestaoestoqueveiculos.entity.StatusVeiculo;
import br.com.marinize.gestaoestoqueveiculos.service.VeiculoService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import java.math.BigDecimal;
import java.util.List;

@RestController
@RequestMapping("/api/veiculos")
public class VeiculoController {
    private final VeiculoService service;
    public VeiculoController(VeiculoService service) { this.service = service; }

    @GetMapping
    public List<VeiculoResponse> listar(
            @RequestParam(required = false) String marca,
            @RequestParam(required = false) String modelo,
            @RequestParam(required = false) Integer ano,
            @RequestParam(required = false) BigDecimal precoMin,
            @RequestParam(required = false) BigDecimal precoMax,
            @RequestParam(required = false) StatusVeiculo status) {
        return service.listar(marca, modelo, ano, precoMin, precoMax, status);
    }
    @GetMapping("/{id}") public VeiculoResponse buscar(@PathVariable Long id) { return service.buscar(id); }
    @PostMapping @ResponseStatus(HttpStatus.CREATED)
    public VeiculoResponse criar(@Valid @RequestBody VeiculoRequest request) { return service.criar(request); }
    @PutMapping("/{id}") public VeiculoResponse atualizar(@PathVariable Long id, @Valid @RequestBody VeiculoRequest request) {
        return service.atualizar(id, request);
    }
    @DeleteMapping("/{id}") @ResponseStatus(HttpStatus.NO_CONTENT)
    public void excluir(@PathVariable Long id) { service.excluir(id); }
}
