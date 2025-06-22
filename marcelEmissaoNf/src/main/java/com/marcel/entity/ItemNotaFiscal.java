package com.marcel.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
public class ItemNotaFiscal {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private Long produtoId;
    private String descricao;
    private Integer quantidade;
    private Double valorUnitario;
    private Double valorTotal;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "nota_fiscal_id", nullable = false)
    private NotaFiscal notaFiscal;
}