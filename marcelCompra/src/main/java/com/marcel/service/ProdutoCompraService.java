package com.marcel.service;

import com.marcel.dto.ProdutoCompraRequest;
import com.marcel.dto.ProdutoCompraResponse;
import com.marcel.entity.Compra;
import com.marcel.entity.Produto;
import com.marcel.entity.ProdutoCompra;
import com.marcel.mapper.CompraMapper;
import com.marcel.mapper.ProdutoCompraMapper;
import com.marcel.repository.CompraRepository;
import com.marcel.repository.ProdutoCompraRepository;
import com.marcel.repository.ProdutoRepository;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.List;

@Service
public class ProdutoCompraService {

    private final ProdutoCompraRepository produtoCompraRepository;
    private final CompraRepository compraRepository;
    private final ProdutoRepository produtoRepository;

    public ProdutoCompraService(ProdutoCompraRepository produtoCompraRepository, CompraRepository compraRepository, ProdutoRepository produtoRepository) {
        this.produtoCompraRepository = produtoCompraRepository;
        this.compraRepository = compraRepository;
        this.produtoRepository = produtoRepository;
    }

    public List<ProdutoCompraResponse> findAll() {
        return produtoCompraRepository.findAll().stream()
                .map(ProdutoCompraMapper::toResponse)
                .toList();
    }

    public ProdutoCompraResponse findById(Long id) {
        return produtoCompraRepository.findById(id)
                .map(ProdutoCompraMapper::toResponse)
                .orElseThrow(() -> new RuntimeException("ProdutoCompra not found with id: " + id));
    }

    public List<ProdutoCompraResponse> findByCompraId(Long compraId) {
        return produtoCompraRepository.findByCompraId(compraId).stream()
                .map(ProdutoCompraMapper::toResponse)
                .toList();
    }

    public ProdutoCompraResponse findByProdutoAndCompra(Long produtoId, Long compraId) {
        return produtoCompraRepository.findByProdutoIdAndCompraId(produtoId, compraId)
                .map(ProdutoCompraMapper::toResponse)
                .orElseThrow(() -> new RuntimeException("ProdutoCompra not found with produtoId: " + produtoId + " and compraId: " + compraId));
    }

    @Transactional
    public BigDecimal saveProdutosCompra(List<ProdutoCompraRequest> produtos, Compra compra) {
        if (produtos == null || produtos.isEmpty()) {
            return BigDecimal.ZERO;
        }

        BigDecimal valorTotalCompra = BigDecimal.ZERO;

        Long id = compra.getId();
        compra = compraRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Compra não encontrada: " + id));

        for (ProdutoCompraRequest produtoRequest : produtos) {
            Produto produto = produtoRepository.findById(produtoRequest.getProdutoId())
                    .orElseThrow(() -> new RuntimeException("Produto não encontrado: " + produtoRequest.getProdutoId()));

            ProdutoCompra pc = new ProdutoCompra();
            pc.setCompra(compra);
            pc.setProduto(produto);
            pc.setNomeProduto(produto.getNome());
            pc.setPrecoUnitario(produto.getPreco());
            pc.setQuantidade(produtoRequest.getQuantidade());
            produtoCompraRepository.save(pc);

            valorTotalCompra = valorTotalCompra.add(produto.getPreco().multiply(BigDecimal.valueOf(pc.getQuantidade())));
        }

        return valorTotalCompra;
    }

    public List<ProdutoCompraResponse> findByCompra(Long compraId) {
    return produtoCompraRepository.findByCompraId(compraId).stream()
            .map(ProdutoCompraMapper::toResponse)
            .toList();
    }
}
