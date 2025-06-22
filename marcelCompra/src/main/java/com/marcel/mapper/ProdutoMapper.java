package com.marcel.mapper;

import com.marcel.dto.ProdutoRequest;
import com.marcel.dto.ProdutoResponse;
import com.marcel.entity.Produto;

public class ProdutoMapper {
    public static ProdutoResponse toResponse(Produto produto) {
        if (produto == null) {
            return null;
        }

        return new ProdutoResponse(
                produto.getId(),
                produto.getNome(),
                produto.getDescricao(),
                produto.getPreco()
        );
    }

    public static Produto toEntity(ProdutoRequest request) {
        if (request == null) {
            return null;
        }

        Produto produto = new Produto();
        produto.setNome(request.getNome());
        produto.setDescricao(request.getDescricao());
        produto.setPreco(request.getPreco());

        return produto;
    }

    public static Produto responseToEntity(ProdutoResponse response) {
        if (response == null) {
            return null;
        }

        Produto produto = new Produto();
        produto.setId(response.getId());
        produto.setNome(response.getNome());
        produto.setDescricao(response.getDescricao());
        produto.setPreco(response.getPreco());

        return produto;
    }
}
