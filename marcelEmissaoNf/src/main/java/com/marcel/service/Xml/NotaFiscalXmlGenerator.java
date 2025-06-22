package com.marcel.service.Xml;

import com.marcel.entity.ItemNotaFiscal;
import com.marcel.entity.NotaFiscal;
import org.springframework.stereotype.Service;

import java.io.File;
import java.io.FileOutputStream;
import java.io.IOException;
import java.nio.charset.StandardCharsets;

@Service
public class NotaFiscalXmlGenerator {

    public String gerarXmlNotaFiscal(NotaFiscal nota) {
        StringBuilder sb = new StringBuilder();

        sb.append("<NotaFiscal>\n");
        sb.append("  <CodigoNF>").append(nota.getCodigoNF()).append("</CodigoNF>\n");
        sb.append("  <OrigemCompra>").append(nota.getOrigemCompra()).append("</OrigemCompra>\n");
        sb.append("  <Numero>").append(nota.getNumero()).append("</Numero>\n");
        sb.append("  <Cliente id=\"").append(nota.getClienteId()).append("\">")
                .append(nota.getCliente()).append("</Cliente>\n");
        sb.append("  <DataEmissao>").append(nota.getDataEmissao()).append("</DataEmissao>\n");
        sb.append("  <ValorTotal>").append(nota.getValorTotal()).append("</ValorTotal>\n");
        sb.append("  <Produtos>\n");

        for (ItemNotaFiscal item : nota.getItens()) {
            sb.append("    <Produto>\n");
            sb.append("      <Id>").append(item.getProdutoId()).append("</Id>\n");
            sb.append("      <Descricao>").append(item.getDescricao()).append("</Descricao>\n");
            sb.append("      <Quantidade>").append(item.getQuantidade()).append("</Quantidade>\n");
            sb.append("      <ValorUnitario>").append(item.getValorUnitario()).append("</ValorUnitario>\n");
            sb.append("      <ValorTotal>").append(item.getValorTotal()).append("</ValorTotal>\n");
            sb.append("    </Produto>\n");
        }

        sb.append("  </Produtos>\n");
        sb.append("</NotaFiscal>");

        return sb.toString();
    }

    public byte[] gerarBytesArquivoXml(NotaFiscal nota) throws IOException {
        String xml = gerarXmlNotaFiscal(nota);

        // Gera os bytes diretamente da string
        return xml.getBytes(StandardCharsets.UTF_8);
    }

    public File salvarEmDisco(NotaFiscal nota, String caminho) throws IOException {
        byte[] xmlBytes = gerarBytesArquivoXml(nota);
        File arquivo = new File(caminho);
        try (FileOutputStream fos = new FileOutputStream(arquivo)) {
            fos.write(xmlBytes);
        }
        return arquivo;
    }
}
