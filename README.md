# Para rodar o projeto
## Pré-requisitos
- Java 21
- Maven 3.9.5
- Docker
- PostgreSQL

## Iniciando os container do Docker
Deve haver dois containers docker rodando com postgres, um para armazenamento das NF's e o outro para as compras e etc.

Docker container do sistema de compras:
```
docker run --name trabalhomarcel -e POSTGRES_USER=postgres -e POSTGRES_PASSWORD=postgres -p 5555:5432 -d postgres:latest
```

Docker container do sistema de NF's:
```
docker run --name trabalhomarcel_nf -e POSTGRES_USER=postgres -e POSTGRES_PASSWORD=postgres -p 5556:5432 -d postgres:latest
```

## Iniciando o sistema de NF's
- Os containers devem estar rodando
- No root dos arquivos, siga os comandos abaixo:
```
- cd marcelEmissaoNf
- mvn clean install
- mvn spring-boot:run
```
#### Após estar rodando, o sistema de NF's deve estar rodando na porta 8081.
(A porta não faz diferença, pois não possui nenhuma aplicação REST, somente a funcionalidade gRPC)
#### O sistema de NF's estará escutando os envios de gRPC na porta 6565, conforme os padões do arquivo [faturamento.proto](./marcelEmissaoNf/src/main/proto/faturamento.proto)

## Iniciando o sistema de compras
- Os containers devem estar rodando
- No root dos arquivos, siga os comandos abaixo:
```
- cd marcelCompra
- mvn clean install
- mvn spring-boot:run
```
#### Após estar rodando, o sistema de compras deve estar rodando na porta 8080.