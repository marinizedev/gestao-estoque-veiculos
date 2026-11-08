package br.com.marinize.gestaoestoqueveiculos.dto;

import br.com.marinize.gestaoestoqueveiculos.entity.StatusVeiculo;
import java.math.BigDecimal;

public record VeiculoResponse(
        Long id,
        Long modeloId,
        String modelo,
        Long marcaId,
        String marca,
        Integer anoFabricacao,
        String cor,
        BigDecimal preco,
        Integer quilometragem,
        StatusVeiculo status
) { }
