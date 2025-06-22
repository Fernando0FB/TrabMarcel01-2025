package com.marcel.mapper;

import com.marcel.dto.ClienteRequest;
import com.marcel.dto.ClienteResponse;
import com.marcel.entity.Cliente;

public class ClienteMapper {
    public static Cliente toEntity(ClienteRequest clienteRequest) {
        if (clienteRequest == null) {
            return null;
        }

        Cliente cliente = new Cliente();
        cliente.setNome(clienteRequest.getNome());
        cliente.setEmail(clienteRequest.getEmail());
        cliente.setTelefone(clienteRequest.getTelefone());
        cliente.setCpf(clienteRequest.getCpf());

        return cliente;
    }

    public static Cliente responseToEntity(ClienteResponse clienteResponse) {
        if (clienteResponse == null) {
            return null;
        }

        Cliente cliente = new Cliente();
        cliente.setId(clienteResponse.getId());
        cliente.setNome(clienteResponse.getNome());
        cliente.setEmail(clienteResponse.getEmail());
        cliente.setTelefone(clienteResponse.getTelefone());
        cliente.setCpf(clienteResponse.getCpf());

        return cliente;
    }

    public static ClienteResponse toResponse(Cliente cliente) {
        if (cliente == null) {
            return null;
        }

        String cpfComMascara = cliente.getCpf() != null && cliente.getCpf().length() == 11
                ? "*****" + cliente.getCpf().substring(5, 9) + "**"
                : cliente.getCpf();

        return new ClienteResponse(
                cliente.getId(),
                cliente.getNome(),
                cliente.getEmail(),
                cliente.getTelefone(),
                cpfComMascara
        );
    }

}
