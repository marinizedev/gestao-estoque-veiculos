package br.com.marinize.gestaoestoqueveiculos.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record MarcaRequest(
        @NotBlank(message = "O nome da marca é obrigatório.")
        @Size(max = 100, message = "O nome da marca deve ter no máximo 100 caracteres.")
        String nome
) { }
