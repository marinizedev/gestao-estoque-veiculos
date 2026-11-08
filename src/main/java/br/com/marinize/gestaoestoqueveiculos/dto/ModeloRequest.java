package br.com.marinize.gestaoestoqueveiculos.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import jakarta.validation.constraints.Size;

public record ModeloRequest(
        @NotBlank(message = "O nome do modelo é obrigatório.")
        @Size(max = 100, message = "O nome do modelo deve ter no máximo 100 caracteres.")
        String nome,
        @NotNull(message = "O identificador da marca é obrigatório.")
        @Positive(message = "O identificador da marca deve ser positivo.")
        Long marcaId
) { }
