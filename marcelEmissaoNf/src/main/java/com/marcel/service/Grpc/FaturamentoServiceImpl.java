package com.marcel.service.Grpc;


import com.google.protobuf.ByteString;
import com.marcel.entity.NotaFiscal;
import com.marcel.grpc.*;
import com.marcel.mapper.FaturamentoMapper;
import com.marcel.service.NotaFiscalService;
import com.marcel.service.Xml.NotaFiscalXmlGenerator;
import io.grpc.stub.StreamObserver;
import org.springframework.grpc.server.service.GrpcService;

import java.io.IOException;
import java.util.Optional;

@GrpcService
public class FaturamentoServiceImpl extends FaturamentoServiceGrpc.FaturamentoServiceImplBase {

    private final NotaFiscalService notaFiscalService;
    private final NotaFiscalXmlGenerator notaFiscalXmlGenerator;
    private FaturamentoServiceImpl(NotaFiscalService notaFiscalService, NotaFiscalXmlGenerator notaFiscalXmlGenerator) {
        this.notaFiscalService = notaFiscalService;
        this.notaFiscalXmlGenerator = notaFiscalXmlGenerator;
    }

    @Override
    public void makeFaturamento(FaturamentoRequest request,
                              StreamObserver<FaturamentoResponse> responseObserver) {
        System.out.println("----------------- Recebendo requisição de criação de NF... ---------------");
        NotaFiscal notaFiscal = FaturamentoMapper.toEntity(request);
        String xmlNotaFiscal = notaFiscalXmlGenerator.gerarXmlNotaFiscal(notaFiscal);
        notaFiscal.setXml_nf(xmlNotaFiscal);
        notaFiscal.setArquivoXml(xmlNotaFiscal.getBytes());

        notaFiscalService.save(notaFiscal);


        FaturamentoResponse response = FaturamentoResponse.newBuilder()
                .setSucesso(true)
                .setMensagem("Nota salva com sucesso")
                .setCodigoNf(notaFiscal.getCodigoNF())
                .setXmlNf(notaFiscal.getXml_nf() == null ? "" : notaFiscal.getXml_nf())
                .setArquivoXml(ByteString.copyFrom(notaFiscal.getArquivoXml()))
                .build();

        System.out.println("NF criada com sucesso, resposta a ser enviada: " + response);
        System.out.println("------------------ Fim da requisição de criação de NF ---------------");
        responseObserver.onNext(response);
        responseObserver.onCompleted();
    }

    @Override
    public void getFaturamento(FaturamentoXmlRequest request,
                               StreamObserver<FaturamentoXmlResponse> responseObserver) {
        System.out.println("------------------------Recebendo requisição de consulta de NF...------------------------");
        String codigoNf = request.getCodigoNf();
        String origemCompra = request.getOrigemCompra();

        Optional<NotaFiscal> notaFiscal = notaFiscalService.findByCodigoNFAndOrigemCompra(codigoNf, origemCompra);

        FaturamentoXmlResponse response = FaturamentoMapper.toXmlResponse(notaFiscal);
        System.out.println("NF encontrado com sucesso, resposta a ser enviada: " + response);
        responseObserver.onNext(response);
        responseObserver.onCompleted();
        System.out.println("------------------------Fim da requisição de consulta de NF------------------------");
    }
}
