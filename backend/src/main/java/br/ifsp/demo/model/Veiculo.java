package br.ifsp.demo.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import br.ifsp.demo.validation.ValidCor;
import jakarta.validation.constraints.NotBlank;
import java.time.LocalDateTime;
import java.util.UUID;
import java.util.regex.Pattern;

@Entity
public class Veiculo {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @JsonIgnore
    private Long id;

    @Column(unique = true, nullable = false)
    @NotBlank(message = "License plate is required")
    private String placa;

    @Column(nullable = false)
    @NotBlank(message = "Vehicle type is required")
    private String tipoVeiculo;

    @Column(nullable = false)
    @NotBlank(message = "Model is required")
    private String modelo;

    @Column(nullable = false)
    @NotBlank(message = "Color is required")
    @ValidCor
    private String cor;

    private static final Pattern APENAS_NUMEROS = Pattern.compile("^\\d+$");
    private static final Pattern CARACTERES_ESPECIAIS = Pattern.compile("[^a-zA-ZÀ-ÿ\\s]");

    protected Veiculo() {}

    public Veiculo(String placa, String tipoVeiculo, String modelo, String cor) {

        if(placa == null || placa.trim().isEmpty())
            throw new IllegalArgumentException("Plate cannot be null or empty");

        if(tipoVeiculo == null || tipoVeiculo.trim().isEmpty())
            throw new IllegalArgumentException("Vehicle type cannot be null or empty");

        if (modelo == null || modelo.trim().isEmpty())
            throw new IllegalArgumentException("Vehicle model cannot be null or empty");

        if (cor == null || cor.trim().isEmpty())
            throw new IllegalArgumentException("Vehicle color cannot be null or empty");

        if (APENAS_NUMEROS.matcher(cor.trim()).matches()) {
            throw new IllegalArgumentException("Color cannot be only numbers. Use names like: white, black, blue, etc.");
        }

        if (CARACTERES_ESPECIAIS.matcher(cor.trim()).find()) {
            throw new IllegalArgumentException("Color cannot contain special characters (@#!$%). Use letters only.");
        }

        this.placa = placa;
        this.tipoVeiculo = tipoVeiculo;
        this.modelo = modelo;
        this.cor = cor;
    }

    public Long getId() { return id; }
    public String getPlaca() { return placa; }
    public String getTipoVeiculo() { return tipoVeiculo; }
    public String getModelo() { return modelo; }
    public String getCor() { return cor; }
}
