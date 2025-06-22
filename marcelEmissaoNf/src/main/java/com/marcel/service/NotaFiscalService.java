package com.marcel.service;

import com.marcel.entity.NotaFiscal;
import com.marcel.repository.NotaFiscalRepository;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class NotaFiscalService {

    @Autowired
    private NotaFiscalRepository notaFiscalRepository;

    @Transactional
    public Optional<NotaFiscal> findByCodigoNFAndOrigemCompra(String codigoNF, String origemCompra) {
        return notaFiscalRepository.findByCodigoNFAndOrigemCompra(codigoNF, origemCompra);
    }

    public NotaFiscal save(NotaFiscal notaFiscal) {
        return notaFiscalRepository.save(notaFiscal);
    }
}
