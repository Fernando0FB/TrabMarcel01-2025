package com.marcel.service.Xml;

import org.springframework.stereotype.Service;

import java.io.File;
import java.io.FileOutputStream;
import java.io.IOException;
import java.nio.file.Paths;

@Service
public class XmlFileWriter {

    public static File salvarXmlEmDisco(byte[] conteudoXml, String nomeArquivo, String diretorioDestino) throws IOException {
        if (!nomeArquivo.toLowerCase().endsWith(".xml")) {
            nomeArquivo += ".xml";
        }

        File dir = new File(diretorioDestino);
        if (!dir.exists()) {
            dir.mkdirs();
        }

        File arquivo = Paths.get(diretorioDestino, nomeArquivo).toFile();

        try (FileOutputStream fos = new FileOutputStream(arquivo)) {
            fos.write(conteudoXml);
        }

        return arquivo;
    }
}