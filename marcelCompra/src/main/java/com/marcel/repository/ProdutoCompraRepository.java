package com.marcel.repository;

import com.marcel.entity.ProdutoCompra;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface ProdutoCompraRepository extends JpaRepository<ProdutoCompra, Long> {
    Optional<ProdutoCompra> findByProdutoIdAndCompraId(Long produtoId, Long compraId);
    List<ProdutoCompra> findByCompraId(Long compraId);
}
