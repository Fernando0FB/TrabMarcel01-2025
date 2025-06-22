package com.marcel.service;

import com.marcel.dto.ClienteRequest;
import com.marcel.dto.ClienteResponse;
import com.marcel.entity.Cliente;
import com.marcel.mapper.ClienteMapper;
import com.marcel.repository.ClienteRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ClienteService {

    @Autowired
    private ClienteRepository clienteRepository;


    public List<ClienteResponse> findAll() {
        return clienteRepository.findAll().stream()
                .map(ClienteMapper::toResponse)
                .toList();
    }

    public ClienteResponse findById(Long id) {
        return clienteRepository.findById(id)
                .map(ClienteMapper::toResponse)
                .orElseThrow(
                        () -> new RuntimeException("Cliente not found with id: " + id)
                );
    }

    public void delete(Long id) {
        clienteRepository.deleteById(id);
    }

    public ClienteResponse save(ClienteRequest request) {
        Cliente cliente = ClienteMapper.toEntity(request);
        cliente = clienteRepository.save(cliente);
        return ClienteMapper.toResponse(cliente);
    }


}
