package com.marcel.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class CompraRequest {
    private Long clienteId;
    private List<ProdutoCompraRequest> produtos;
}
