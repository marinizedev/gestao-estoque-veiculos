package br.com.marinize.gestaoestoqueveiculos.dto;

import br.com.marinize.gestaoestoqueveiculos.entity.StatusVeiculo;
import jakarta.validation.constraints.*;
import java.math.BigDecimal;

public record VeiculoRequest(
        @NotNull(message = "O identificador do modelo é obrigatório.")
        @Positive(message = "O identificador do modelo deve ser positivo.")
        Long modeloId,
        @NotNull(message = "O ano de fabricação é obrigatório.")
        @Min(value = 1886, message = "O ano de fabricação informado é inválido.")
        @Max(value = 2100, message = "O ano de fabricação informado é inválido.")
        Integer anoFabricacao,
        @NotBlank(message = "A cor é obrigatória.")
        @Size(max = 50, message = "A cor deve ter no máximo 50 caracteres.")
        String cor,
        @NotNull(message = "O preço é obrigatório.")
        @DecimalMin(value = "0.0", inclusive = true, message = "O preço não pode ser negativo.")
        @Digits(integer = 10, fraction = 2, message = "O preço deve ter até 10 dígitos inteiros e 2 decimais.")
        BigDecimal preco,
        @NotNull(message = "A quilometragem é obrigatória.")
        @Min(value = 0, message = "A quilometragem não pode ser negativa.")
        Integer quilometragem,
        @NotNull(message = "O status é obrigatório.")
        StatusVeiculo status
) { }
