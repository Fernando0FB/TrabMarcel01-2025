package com.marcel.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDate;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class CompraResponse {
    private Long id;
    private BigDecimal valorTotalcompra;
    private LocalDate dataCompra;
    private ClienteResponse cliente;
}
