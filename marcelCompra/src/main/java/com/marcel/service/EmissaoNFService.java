package com.marcel.service;

import com.marcel.dto.ProdutoCompraResponse;
import com.marcel.entity.Compra;
import com.marcel.entity.ProdutoCompra;
import com.marcel.grpc.*;
import io.grpc.ManagedChannel;
import io.grpc.ManagedChannelBuilder;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.List;

@Service
public class EmissaoNFService {

    private final ProdutoCompraService produtoCompraService;

    public EmissaoNFService(ProdutoCompraService produtoCompraService) {
        this.produtoCompraService = produtoCompraService;
    }

    public FaturamentoXmlResponse consultarNF(String codigoNf) {
        System.out.println("Método 'consultarNF' emite uma requisição via gRPC com código, para buscar a NF: " + codigoNf);
        FaturamentoXmlRequest request = FaturamentoXmlRequest.newBuilder()
                .setCodigoNf(codigoNf)
                .setOrigemCompra("sistema_compras")
                .build();

        ManagedChannel channel = ManagedChannelBuilder.forAddress("localhost", 6565)
                .usePlaintext()
                .build();

        FaturamentoServiceGrpc.FaturamentoServiceBlockingStub stub = FaturamentoServiceGrpc.newBlockingStub(channel);
        FaturamentoXmlResponse response = stub.getFaturamento(request);
        System.out.println("Resposta recebida via gRPC: " + response);
        channel.shutdown();

        return response;
    }

    public FaturamentoResponse emitirNF(Compra compra) {
        System.out.println("Método 'emitirNF' emite uma requisição via gRPC para gerar a NF para a compra: " + compra.getId());
        FaturamentoRequest request = createFaturamentoRequestDTO(compra);

        ManagedChannel channel = ManagedChannelBuilder.forAddress("localhost", 6565)
                .usePlaintext()
                .build();

        FaturamentoServiceGrpc.FaturamentoServiceBlockingStub stub = FaturamentoServiceGrpc.newBlockingStub(channel);
        FaturamentoResponse response = stub.makeFaturamento(request);
        System.out.println("Resposta recebida via gRPC: " + response);
        channel.shutdown();

        return response;
    }

    public FaturamentoRequest createFaturamentoRequestDTO(Compra compra) {
        System.out.println("Criando FaturamentoRequest para a compra: " + compra.getId());
        List<ProdutoCompraResponse> produtosCompra = produtoCompraService.findByCompraId(compra.getId());

        List<Produto> produtos = produtosCompra.stream()
                .map(produtoCompra -> Produto.newBuilder()
                        .setProdutoId(Integer.valueOf(produtoCompra.getProduto().getId().toString()))
                        .setDescricao(produtoCompra.getProduto().getNome())
                        .setQuantidade(produtoCompra.getQuantidade())
                        .setValorUnitario(produtoCompra.getPrecoUnitario().doubleValue())
                        .setValorTotal(produtoCompra.getPrecoUnitario().multiply(BigDecimal.valueOf(produtoCompra.getQuantidade())).doubleValue())
                        .build())
                .toList();

        FaturamentoRequest request = FaturamentoRequest.newBuilder()
                .setIdCompra(Integer.valueOf(compra.getId().toString()))
                .setOrigemCompra("sistema_compras")
                .setCliente(compra.getCliente().getNome())
                .setClienteId(Integer.valueOf(compra.getCliente().getId().toString()))
                .setValorTotal(compra.getValorTotalcompra().doubleValue())
                .addAllProdutos(produtos)
                .build();

        return request;
    }
}
