package com.marcel.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class ProdutoCompraResponse {
    private Long id;
    private String nomeProduto;
    private Integer quantidade;
    private BigDecimal precoUnitario;
    private CompraResponse compra;
    private ProdutoResponse produto;
}
