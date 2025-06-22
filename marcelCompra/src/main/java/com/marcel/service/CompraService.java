package com.marcel.service;

import com.marcel.dto.CompraRequest;
import com.marcel.dto.CompraResponse;
import com.marcel.entity.Compra;
import com.marcel.grpc.FaturamentoResponse;
import com.marcel.grpc.FaturamentoXmlResponse;
import com.marcel.mapper.ClienteMapper;
import com.marcel.mapper.CompraMapper;
import com.marcel.repository.CompraRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;

@Service
public class CompraService {

    private final CompraRepository compraRepository;
    private final ClienteService clienteService;
    private final ProdutoCompraService produtoCompraService;
    private final EmissaoNFService emissaoNFService;

    public CompraService(CompraRepository compraRepository,
                         ClienteService clienteService,
                         ProdutoCompraService produtoCompraService,
                         EmissaoNFService emissaoNFService) {
        this.compraRepository = compraRepository;
        this.clienteService = clienteService;
        this.produtoCompraService = produtoCompraService;
        this.emissaoNFService = emissaoNFService;
    }

    public List<CompraResponse> findAll() {
        return compraRepository.findAll().stream()
                .map(CompraMapper::toResponse)
                .toList();
    }

    public CompraResponse findById(Long id) {
        return compraRepository.findById(id)
                .map(CompraMapper::toResponse)
                .orElseThrow(() -> new RuntimeException("Compra não encontrada: " + id));
    }

    public void delete(Long id) {
        if (!compraRepository.existsById(id)) {
            throw new RuntimeException("Compra não encontrada: " + id);
        }
        compraRepository.deleteById(id);
    }

    @Transactional
    public CompraResponse save(CompraRequest request) {
        Compra compra = CompraMapper.toEntity(request);
        compra.setCliente(ClienteMapper.responseToEntity(
                clienteService.findById(request.getClienteId())));
        compra = compraRepository.save(compra);

        if (request.getProdutos() != null && !request.getProdutos().isEmpty()) {
            BigDecimal valorTotalCompra = produtoCompraService.saveProdutosCompra(request.getProdutos(), compra);

            compra.setValorTotalcompra(valorTotalCompra);
        }

        compra = compraRepository.save(compra);

        return CompraMapper.toResponse(compra);
    }

    public CompraResponse save(Compra compra) {
        compra = compraRepository.save(compra);
        return CompraMapper.toResponse(compra);
    }

    public byte[] getNotaFiscal(Long idCompra) {
        Compra compra = compraRepository.findById(idCompra)
                .orElseThrow(() -> new RuntimeException("Compra não encontrada: " + idCompra));

        if (compra.getCodigoNotaFiscal() == null) {
            FaturamentoResponse infosNotaFiscal = emissaoNFService.emitirNF(compra);
            compra.setCodigoNotaFiscal(infosNotaFiscal.getCodigoNf());
            save(compra);

            return infosNotaFiscal.getArquivoXml().toByteArray();
        }

        FaturamentoXmlResponse infosNotaFiscal = emissaoNFService.consultarNF(compra.getCodigoNotaFiscal());

        return infosNotaFiscal.getObjetoNfGet().getArquivoXml().toByteArray();
    }
}
