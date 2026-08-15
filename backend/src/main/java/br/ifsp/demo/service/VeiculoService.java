package br.ifsp.demo.service;

import br.ifsp.demo.model.Veiculo;
import br.ifsp.demo.repository.VeiculoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.time.LocalDateTime;
import java.util.Optional;

@Service
public class VeiculoService {

    private final VeiculoRepository veiculoRepository;

    @Autowired
    public VeiculoService(VeiculoRepository veiculoRepository) {
        this.veiculoRepository = veiculoRepository;
    }

    public Veiculo cadastrarVeiculo(String placa, String tipoVeiculo, String modelo, String cor) {

        if (placa == null || placa.trim().isEmpty()) {
            throw new IllegalArgumentException("Plate cannot be empty");
        }
        if (veiculoRepository.findByPlaca(placa).isPresent()) {
            throw new IllegalArgumentException("Plate already registered");
        }

        Veiculo novoVeiculo = new Veiculo(placa, tipoVeiculo, modelo, cor);
        return veiculoRepository.save(novoVeiculo);
    }

    public void deletarVeiculo(Long id) {
        Veiculo veiculoParaDeletar = veiculoRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Vehicle not found"));
        veiculoRepository.delete(veiculoParaDeletar);
    }

    public Veiculo obterOuCadastrarVeiculo(Veiculo veiculoDados) {
        return buscarPorPlaca(veiculoDados.getPlaca())
                .orElseGet(() -> cadastrarVeiculo(
                        veiculoDados.getPlaca(),
                        veiculoDados.getTipoVeiculo(),
                        veiculoDados.getModelo(),
                        veiculoDados.getCor()
                ));
    }

    public Optional<Veiculo> buscarPorPlaca(String placa) {
        return veiculoRepository.findByPlaca(placa);
    }
}