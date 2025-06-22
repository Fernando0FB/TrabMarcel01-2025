package com.marcel.repository;

import com.marcel.entity.Cliente;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ClienteRepository extends JpaRepository<Cliente, Long> {
    Cliente save(Cliente cliente);
}
