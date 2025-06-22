package com.marcel.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
public class NotaFiscal {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String origemCompra;
    private String codigoNF = UUID.randomUUID().toString();
    private String numero;
    private String cliente;
    private Long clienteId;
    private LocalDate dataEmissao;
    private BigDecimal valorTotal;
    @Lob
    private byte[] arquivoXml;
    @Lob
    private String xml_nf;


    @OneToMany(mappedBy = "notaFiscal", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<ItemNotaFiscal> itens;
}