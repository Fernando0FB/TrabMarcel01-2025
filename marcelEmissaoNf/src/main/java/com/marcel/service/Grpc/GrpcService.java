package com.marcel.service.Grpc;

import org.springframework.stereotype.Service;

@Service
public class GrpcService {
    
    private final FaturamentoServiceImpl faturamentoServiceImpl;
    public GrpcService(FaturamentoServiceImpl faturamentoServiceImpl) {
        this.faturamentoServiceImpl = faturamentoServiceImpl;
    }
    
    
    
}
