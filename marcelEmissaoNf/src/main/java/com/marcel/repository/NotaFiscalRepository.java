package com.marcel.repository;

import com.marcel.entity.NotaFiscal;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface NotaFiscalRepository extends JpaRepository<NotaFiscal, Long> {
    Optional<NotaFiscal> findByCodigoNFAndOrigemCompra(String codigoNf, String origemCompra);
    List<NotaFiscal> findByOrigemCompra(String origemCompra);
}
