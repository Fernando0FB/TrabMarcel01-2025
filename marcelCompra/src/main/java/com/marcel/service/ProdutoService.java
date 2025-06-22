package com.marcel.service;

import com.marcel.dto.ProdutoRequest;
import com.marcel.dto.ProdutoResponse;
import com.marcel.entity.Produto;
import com.marcel.mapper.ProdutoMapper;
import com.marcel.repository.ProdutoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ProdutoService {

    @Autowired
    private ProdutoRepository produtoRepository;

    public List<ProdutoResponse> findAll() {
        return produtoRepository.findAll().stream()
                .map(ProdutoMapper::toResponse)
                .toList();
    }

    public ProdutoResponse findById(Long id) {
        return produtoRepository.findById(id)
                .map(ProdutoMapper::toResponse)
                .orElseThrow(
                        () -> new RuntimeException("Produto not found with id: " + id)
                );
    }

    public void delete(Long id) {
        produtoRepository.deleteById(id);
    }

    public ProdutoResponse save(ProdutoRequest request) {
        Produto produto = ProdutoMapper.toEntity(request);
        produto = produtoRepository.save(produto);
        return ProdutoMapper.toResponse(produto);
    }

}
