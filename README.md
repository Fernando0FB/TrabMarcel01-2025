# Projeto Sistema de Compras com comunicação gRPC
Este repositório contém **backend** (Spring Boot) e **frontend** (React + Vite + Tailwind) para um sistema de compras com emissão de Nota Fiscal Eletrônica (DANFE).

## Pré-requisitos
- Node.js 16+ e npm para o frontend
- Java 21
- Maven 3.9.5
- Docker
- PostgreSQL

## 🚀 Como usar

1. Inicie o backend (passo ⚙️).
2. Inicie o frontend (passo ⚛️).

# ⚙️ Backend (Spring Boot)

## 🐳 Iniciando os container do Docker
- Deve haver dois containers docker rodando com postgres, um para armazenamento das NF's e o outro para as compras e etc.

1. Docker container do sistema de compras:
```
docker run --name trabalhomarcel -e POSTGRES_USER=postgres -e POSTGRES_PASSWORD=postgres -p 5555:5432 -d postgres:latest
```

2. Docker container do sistema de NF's:
```
docker run --name trabalhomarcel_nf -e POSTGRES_USER=postgres -e POSTGRES_PASSWORD=postgres -p 5556:5432 -d postgres:latest
```

## ⚙️ Iniciando o sistema de NF's
- Os containers devem estar rodando
- No root dos arquivos, siga os comandos abaixo:
```
- cd marcelEmissaoNf
- mvn clean install
- mvn spring-boot:run
```
1. #### Após estar rodando, o sistema de NF's deve estar rodando na porta 8081.
1.1 (A porta não faz diferença, pois não possui nenhuma aplicação REST, somente a funcionalidade gRPC)
2. #### O sistema de NF's estará escutando os envios de gRPC na porta 6565, conforme os padões do arquivo [faturamento.proto](./marcelEmissaoNf/src/main/proto/faturamento.proto)

## 🛒 Iniciando o sistema de compras
- Os containers devem estar rodando
- No root dos arquivos, siga os comandos abaixo:
```
- cd marcelCompra
- mvn clean install
- mvn spring-boot:run
```
1. #### Após estar rodando, o sistema de compras deve estar rodando na porta 8080.

## ⚛️ Frontend (React + Vite)

- No root dos arquivos, siga os comandos abaixo:
```
- cd frontend
- npm install
- npm run dev
```
- O frontend será iniciado na porta 5173.
- Abra o navegador em http://localhost:5173 para acessar a aplicação.

