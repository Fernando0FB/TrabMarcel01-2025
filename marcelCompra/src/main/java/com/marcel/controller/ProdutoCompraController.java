package com.marcel.controller;

import com.marcel.dto.ProdutoCompraResponse;
import com.marcel.service.ProdutoCompraService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/produtos-compras")
public class ProdutoCompraController {

    @Autowired
    private ProdutoCompraService produtoCompraService;

    @GetMapping
    public ResponseEntity<List<ProdutoCompraResponse>> findAll() {
        List<ProdutoCompraResponse> produtosCompras = produtoCompraService.findAll();
        return ResponseEntity.ok(produtosCompras);
    }

    @GetMapping("/{id}")
    public ResponseEntity<ProdutoCompraResponse> findById(@PathVariable Long id) {
        ProdutoCompraResponse produtoCompra = produtoCompraService.findById(id);
        return ResponseEntity.ok(produtoCompra);
    }

    @GetMapping("/produto/{produtoId}/compra/{compraId}")
    public ResponseEntity<ProdutoCompraResponse> findByProdutoAndCompra(@PathVariable Long produtoId, @PathVariable Long compraId) {
        ProdutoCompraResponse produtoCompra = produtoCompraService.findByProdutoAndCompra(produtoId, compraId);
        return ResponseEntity.ok(produtoCompra);
    }

    @GetMapping("/compra/{compraId}")
    public ResponseEntity<List<ProdutoCompraResponse>> findByCompra(@PathVariable Long compraId) {
        List<ProdutoCompraResponse> produtosCompras = produtoCompraService.findByCompra(compraId);
        return ResponseEntity.ok(produtosCompras);
    }
}
