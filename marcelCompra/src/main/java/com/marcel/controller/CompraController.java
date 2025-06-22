package com.marcel.controller;

import com.marcel.dto.CompraRequest;
import com.marcel.dto.CompraResponse;
import com.marcel.service.CompraService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/compras")
public class CompraController {

    @Autowired
    private CompraService compraService;

    @GetMapping
    public ResponseEntity<List<CompraResponse>> findAll() {
        List<CompraResponse> compras = compraService.findAll();
        return ResponseEntity.ok(compras);
    }

    @GetMapping("/{id}")
    public ResponseEntity<CompraResponse> findById(@PathVariable  Long id) {
        CompraResponse compra = compraService.findById(id);
        return ResponseEntity.ok(compra);
    }

    @PostMapping
    public ResponseEntity<CompraResponse> create(@RequestBody CompraRequest compraRequest) {
        CompraResponse createdCompra = compraService.save(compraRequest);
        return ResponseEntity.status(201).body(createdCompra);
    }

    @DeleteMapping
    public ResponseEntity<Void> delete(@RequestParam Long id) {
        compraService.delete(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/{id}/emitir-nota-fiscal")
    public ResponseEntity<byte[]> emitirNotaFiscal(@PathVariable Long id) {
        byte[] xml = compraService.getNotaFiscal(id);
        return ResponseEntity.ok(xml);
    }
}
