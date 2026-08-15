package br.ifsp.demo.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Min;

public record CriarEstacionamentoDTO(
        @NotBlank(message = "Name cannot be empty")
        String nome,

        @NotBlank(message = "Address cannot be empty")
        String endereco,

        @Min(value = 1, message = "Capacity must be greater than 0")
        int capacidade
) {}
