# Teste BackEnd

## Sobre

Este projeto é uma aplicação NODE versão 11 que segue os princípios de DDD (Domain-Driven Design) e Clean Code para fornecer uma base sólida, modular e fácil de manter.

## Tecnologias e Ferramentas
- **Node.js 11**: Plataforma JavaScript para construção da aplicação backend.
- **MongoDB**: Banco de dados NoSQL usado para armazenar os dados da aplicação.
- **Swagger**: Ferramenta para gerar a documentação dos endpoints da API, acessível em [http://localhost:3000/api-docs/](http://localhost:3000/api-docs/).
- **Docker**: Utilizado para containerização e fácil deploy da aplicação.

## Arquitetura

A aplicação é estruturada seguindo os princípios de DDD e Clean Architecture, garantindo a separação de responsabilidades, facilidade de teste e manutenção, e flexibilidade na integração com outras aplicações e serviços.

### Estrutura de Diretórios

```plaintext

├── config/
│   └── default.json
├── src/
│   ├── api/
│   │   ├── controllers/
│   │   │   └── utility-consumption-controller.ts
│   │   └── routes/
│   │       └── utility-consumption-router.ts
│   ├── application/
│   │   ├── interface/
│   │   │   ├── core/
│   │   │   ├── repository/
│   │   │   ├── request/
│   │   │   ├── response/
│   │   │   └── service/
│   │   └── service/
│   │       └── utility-consumption-service.ts
│   ├── config/
│   │   ├── config.d.ts
│   │   ├── express.ts
│   │   └── swaggerConfig.ts
│   ├── domain/
│   │   ├── entity/
│   │   │   └── utility-consumption-reading-entity.ts
│   │   └── enum/
│   └── repository/
│       └── utility-consumption-repository.ts
├── server.ts
├── .gitignore
├── Dockerfile
├── docker-compose.yml
├── package.json
├── tsconfig.json
└── README.md 
```
#### Configuração e Instalação

Para configurar e iniciar o projeto em seu ambiente local, siga os passos abaixo. Certifique-se de ter o docker instalado em sua máquina.
- **Clone o repositório:**
	```
	git clone https://github.com/juliabrauber/ShopperAPI.git
	cd seu-repositorio	
	```
- **Crie e configure o arquivo .env:**
	```
	# .env
	GEMINI_API_KEY=sua_chave_gemini
	PORT=3000
	```
- **Comandos Docker:**
   ```docker
   docker-compose up -d
   ```
