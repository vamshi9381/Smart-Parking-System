package br.ifsp.demo.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.Max;

public record VeiculoComVagaDTO(
        @NotBlank(message = "Plate cannot be empty")
        String placa,

        @NotBlank(message = "Vehicle type cannot be empty")
        String tipoVeiculo,

        @NotBlank(message = "Model cannot be empty")
        String modelo,

        @NotBlank(message = "Color cannot be empty")
        String cor,

        @Min(value = 1, message = "Spot ID must be greater than 0")
        @Max(value = 200, message = "Spot ID must be less than or equal to 200")
        Integer vagaId
) {}
