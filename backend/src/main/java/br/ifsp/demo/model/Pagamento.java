package br.ifsp.demo.model;

import br.ifsp.demo.service.CalculadoraDeTarifa;
import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import java.time.LocalDateTime;
import java.util.UUID;

@Entity
public class Pagamento {

    @Id
    @JsonIgnore
    @GeneratedValue(strategy = GenerationType.AUTO)
    private UUID uuid;

    @Column(nullable = false)
    private String placa;

    @Column(nullable = false)
    private LocalDateTime horaEntrada;

    @Column(nullable = false)
    private LocalDateTime horaSaida;

    @Column(nullable = false)
    private double valor;

    protected Pagamento() {}

    public Pagamento(RegistroEntrada registroEntrada, LocalDateTime horaSaida, CalculadoraDeTarifa tarifa) {
        if(registroEntrada == null)
            throw new IllegalArgumentException("Entry record cannot be null");
        if(horaSaida == null)
            throw new IllegalArgumentException("Exit time cannot be null");
        if(tarifa == null)
            throw new IllegalArgumentException("Tariff cannot be null");

        if(horaSaida.isBefore(registroEntrada.getHoraEntrada()))
            throw new IllegalArgumentException("Exit time cannot be before entry time");

        this.placa = registroEntrada.getVeiculo().getPlaca();
        this.horaEntrada = registroEntrada.getHoraEntrada();
        this.horaSaida = horaSaida;
        this.valor = tarifa.calcularValor(this.horaEntrada, this.horaSaida);

        if(this.valor < 0)
            throw new IllegalArgumentException("Tariff value cannot be negative");
    }

    public Pagamento(RegistroEntrada registroEntrada, LocalDateTime horaEntrada, LocalDateTime horaSaida, CalculadoraDeTarifa tarifa) {
        if(registroEntrada == null)
            throw new IllegalArgumentException("Entry record cannot be null");
        if(horaEntrada == null)
            throw new IllegalArgumentException("Entry time cannot be null");
        if(horaSaida == null)
            throw new IllegalArgumentException("Exit time cannot be null");
        if(tarifa == null)
            throw new IllegalArgumentException("Tariff cannot be null");

        if(horaSaida.isBefore(horaEntrada))
            throw new IllegalArgumentException("Exit time cannot be before entry time");

        this.placa = registroEntrada.getVeiculo().getPlaca();
        this.horaEntrada = horaEntrada;
        this.horaSaida = horaSaida;
        this.valor = tarifa.calcularValor(this.horaEntrada, this.horaSaida);

        if(this.valor < 0)
            throw new IllegalArgumentException("Tariff value cannot be negative");
    }

    public UUID getUuid() {
        return uuid;
    }
    public String getPlaca() {
        return placa;
    }
    public LocalDateTime getHoraEntrada() {
        return horaEntrada;
    }
    public LocalDateTime getHoraSaida() {
        return horaSaida;
    }
    public double getValor() {
        return valor;
    }

}