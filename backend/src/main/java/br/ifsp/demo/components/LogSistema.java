package br.ifsp.demo.components;

import org.springframework.stereotype.Component;

@Component
public class LogSistema {

    public void registrarCancelamento(String placa, String motivoCancelamento) {
        System.out.println("Vehicle check-in cancellation for " + placa + " completed. Reason: " + motivoCancelamento);
    }

}
