package com.marcel.mapper;

import com.marcel.dto.ProdutoCompraResponse;
import com.marcel.entity.ProdutoCompra;

import java.util.List;

public class ProdutoCompraMapper {
    public static ProdutoCompraResponse toResponse(ProdutoCompra produtoCompra) {
        if (produtoCompra == null) {
            return null;
        }

        return new ProdutoCompraResponse(
                produtoCompra.getId(),
                produtoCompra.getNomeProduto(),
                produtoCompra.getQuantidade(),
                produtoCompra.getPrecoUnitario(),
                CompraMapper.toResponse(produtoCompra.getCompra()),
                ProdutoMapper.toResponse(produtoCompra.getProduto())
        );
    }

    public static List<ProdutoCompraResponse> toResponseList(List<ProdutoCompra> produtosCompra) {
        if (produtosCompra == null || produtosCompra.isEmpty()) {
            return List.of();
        }

        return produtosCompra.stream()
                .map(ProdutoCompraMapper::toResponse)
                .toList();
    }

    public static ProdutoCompra toEntity(ProdutoCompraResponse produtoCompraResponse) {
        if (produtoCompraResponse == null) {
            return null;
        }

        ProdutoCompra produtoCompra = new ProdutoCompra();
        produtoCompra.setId(produtoCompraResponse.getId());
        produtoCompra.setNomeProduto(produtoCompraResponse.getNomeProduto());
        produtoCompra.setQuantidade(produtoCompraResponse.getQuantidade());
        produtoCompra.setPrecoUnitario(produtoCompraResponse.getPrecoUnitario());

        if (produtoCompraResponse.getCompra() != null) {
            produtoCompra.setCompra(CompraMapper.responseToEntity(produtoCompraResponse.getCompra()));
        }

        if (produtoCompraResponse.getProduto() != null) {
            produtoCompra.setProduto(ProdutoMapper.responseToEntity(produtoCompraResponse.getProduto()));
        }

        return produtoCompra;
    }

    public static List<ProdutoCompra> toEntityList(List<ProdutoCompraResponse> produtosCompraResponses) {
        if (produtosCompraResponses == null || produtosCompraResponses.isEmpty()) {
            return List.of();
        }

        return produtosCompraResponses.stream()
                .map(ProdutoCompraMapper::toEntity)
                .toList();
    }
}
