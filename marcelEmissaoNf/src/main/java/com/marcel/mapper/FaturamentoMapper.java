package com.marcel.mapper;

import com.google.protobuf.ByteString;
import com.marcel.entity.ItemNotaFiscal;
import com.marcel.entity.NotaFiscal;
import com.marcel.grpc.FaturamentoRequest;
import com.marcel.grpc.FaturamentoXmlResponse;
import com.marcel.grpc.ObjetoNFGet;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import java.util.stream.Collectors;

public class FaturamentoMapper {
    public static NotaFiscal toEntity(FaturamentoRequest request) {
        NotaFiscal nota = new NotaFiscal();
        nota.setOrigemCompra(request.getOrigemCompra());
        nota.setCodigoNF(UUID.randomUUID().toString());
        nota.setCliente(request.getCliente());
        nota.setClienteId((long) request.getClienteId());
        nota.setValorTotal(BigDecimal.valueOf(request.getValorTotal()));
        nota.setDataEmissao(LocalDate.now());

        List<ItemNotaFiscal> itens = request.getProdutosList().stream().map(produto -> {
            ItemNotaFiscal item = new ItemNotaFiscal();
            item.setProdutoId((long) produto.getProdutoId());
            item.setDescricao(produto.getDescricao());
            item.setQuantidade(produto.getQuantidade());
            item.setValorUnitario(produto.getValorUnitario());
            item.setValorTotal(produto.getValorTotal());
            item.setNotaFiscal(nota); // vínculo reverso
            return item;
        }).collect(Collectors.toList());

        nota.setItens(itens);
        return nota;
    }

    public static FaturamentoXmlResponse toXmlResponse(Optional<NotaFiscal> notaFiscal) {
        FaturamentoXmlResponse.Builder responseBuilder = FaturamentoXmlResponse.newBuilder();

        if (!notaFiscal.isPresent()) {
            responseBuilder.setEncontrado(false);
            responseBuilder.setMensagem("Nota Fiscal não encontrada para os parâmetros informados.");
            return responseBuilder.build();
        }

        ObjetoNFGet.Builder objetoNFBuilder = ObjetoNFGet.newBuilder();
        responseBuilder.setEncontrado(true);
        responseBuilder.setMensagem("Nota Fiscal encontrada com sucesso.");
        objetoNFBuilder.setArquivoXml(ByteString.copyFrom(notaFiscal.get().getArquivoXml()));
        objetoNFBuilder.setXmlNf(notaFiscal.get().getXml_nf());
        objetoNFBuilder.setCodigoNf(notaFiscal.get().getCodigoNF());
        responseBuilder.setObjetoNfGet(objetoNFBuilder.build());

        return responseBuilder.build();
    }
}