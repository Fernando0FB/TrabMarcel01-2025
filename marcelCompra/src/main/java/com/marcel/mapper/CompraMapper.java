package com.marcel.mapper;

import com.marcel.dto.CompraRequest;
import com.marcel.dto.CompraResponse;
import com.marcel.entity.Compra;

import java.time.LocalDate;

public class CompraMapper {
    public static CompraResponse toResponse(Compra compra) {
        if (compra == null) {
            return null;
        }

        CompraResponse response = new CompraResponse();
        response.setId(compra.getId());
        response.setValorTotalcompra(compra.getValorTotalcompra());
        response.setDataCompra(compra.getDataCompra());

        if (compra.getCliente() != null) {
            response.setCliente(ClienteMapper.toResponse(compra.getCliente()));
        }

        return response;
    }

    public static Compra toEntity(CompraRequest compraRequest) {
        if (compraRequest == null) {
            return null;
        }

        Compra compra = new Compra();
        compra.setDataCompra(LocalDate.now());

        return compra;
    }

    public static Compra responseToEntity(CompraResponse compraResponse) {
        if (compraResponse == null) {
            return null;
        }

        Compra compra = new Compra();
        compra.setValorTotalcompra(compraResponse.getValorTotalcompra());
        compra.setDataCompra(compraResponse.getDataCompra());

        if (compraResponse.getCliente() != null) {
            compra.setCliente(ClienteMapper.responseToEntity(compraResponse.getCliente()));
        }


        return compra;
    }
}
