package br.ifsp.demo.model;

import br.ifsp.demo.exception.EstacionamentoLotadoException;
import br.ifsp.demo.service.CalculadoraDeTarifa;
import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;

import java.time.LocalDateTime;
import java.util.UUID;

@Entity
public class Estacionamento {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    @JsonIgnore
    private UUID id;
    private String nome;
    private String endereco;
    private int capacidade;

    protected Estacionamento() {}

    public Estacionamento(String nome, String endereco, int capacidade) {

        if(nome == null || nome.trim().isEmpty())
            throw new IllegalArgumentException("Parking lot name cannot be null or empty");
        if(endereco == null || endereco.trim().isEmpty())
            throw new IllegalArgumentException("Parking lot address cannot be null or empty");
        if(capacidade <= 0)
            throw new IllegalArgumentException("Parking lot capacity must be greater than zero");

        setNome(nome);
        setEndereco(endereco);
        setCapacidade(capacidade);

    }

    public RegistroEntrada registrarEntrada(Veiculo veiculo, int ocupacao) {

        if(ocupacao >= this.capacidade)
            throw new EstacionamentoLotadoException("The parking lot is full");

        return new RegistroEntrada(veiculo);

    }

    public Pagamento registroSaida(RegistroEntrada registroEntrada, LocalDateTime horaSaida, CalculadoraDeTarifa tarifa) {

        if(registroEntrada == null)
            throw new IllegalArgumentException("Entry record cannot be null");

        return registroEntrada.finalizarEstadia(horaSaida, tarifa);

    }

    public UUID getId() {
        return id;
    }

    public String getEndereco() {
        return endereco;
    }

    public void setEndereco(String endereco) {
        if (endereco == null || endereco.trim().isEmpty()) {
            throw new IllegalArgumentException("Address cannot be null or empty");
        }
        this.endereco = endereco;
    }

    public String getNome() {
        return nome;
    }

    public void setNome(String nome) {
        if (nome == null || nome.trim().isEmpty()) {
            throw new IllegalArgumentException("Name cannot be null or empty");
        }
        this.nome = nome;
    }

    public int getCapacidade() {
        return capacidade;
    }

    public void setCapacidade(int capacidade) {
        if (capacidade <= 0) {
            throw new IllegalArgumentException("Capacity must be greater than zero.");
        }
        this.capacidade = capacidade;
    }


}