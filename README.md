📦 Order Management API

API RESTful desenvolvida em Node.js com TypeScript para gerenciamento de pedidos e itens. Este projeto foi construído utilizando as melhores práticas de mercado, incluindo tipagem estática, mapeamento objeto-relacional (ORM) e documentação interativa.

🎯 Arquitetura e Padrões

TypeORM: Utilizado para gerenciar a persistência de dados no PostgreSQL, aplicando o padrão Data Mapper. O salvamento em cascata (Cascade) foi configurado para persistir Itens automaticamente ao salvar um Pedido.

DTO (Data Transfer Object) & Mapper: Implementado o OrderMapper para isolar a camada de domínio (Entidades em Inglês) do Payload exposto na API (JSON em Português-BR), garantindo que a evolução do banco de dados não quebre o contrato da API.

Segurança: Endpoints protegidos por autenticação baseada em tokens (JWT).

Documentação Viva: Contratos da API mapeados com OpenAPI 3.0 e expostos via Swagger UI.

🛠️ Pré-requisitos

Para rodar o projeto localmente, você precisará ter instalado:

Node.js (v18 ou superior)

Docker e Docker Compose (para o banco de dados)

Git

🚀 Como rodar o projeto

1. Clonar o repositório

git clone https://github.com/ReyelZeras/jitterbit-order-management-api-js.git
cd jitterbit-order-management-api-js


2. Subir o Banco de Dados (PostgreSQL)

A infraestrutura do banco de dados está conteinerizada. Na raiz do projeto, rode:

docker-compose up -d


Isso iniciará um container do PostgreSQL configurado com os dados de acesso presentes no data-source.ts.

3. Instalar as dependências

npm install


4. Iniciar a Aplicação

O TypeORM está configurado com synchronize: true, o que criará as tabelas automaticamente no banco de dados ao iniciar o servidor.

npm run start:dev


A API estará rodando em http://localhost:3000.

📖 Documentação da API (Swagger)

A API possui uma documentação interativa onde é possível visualizar o schema de cada requisição e testar os endpoints diretamente pelo navegador.

Com o servidor rodando, acesse:
👉 http://localhost:3000/api-docs

Fluxo de Teste:

Acesse a rota POST /auth/login no Swagger e clique em Try it out -> Execute.

Copie o token gerado na resposta.

Vá ao topo da página do Swagger, clique no botão Authorize 🔒, cole o token e clique em Authorize.

Agora você pode testar todas as rotas de gerenciamento de pedidos (CRUD)!

📂 Estrutura de Diretórios Principal

src/
 ├── controllers/    # Lida com as requisições HTTP e envia as respostas
 ├── dtos/           # Mappers e Definição de Tipos (Português <-> Inglês)
 ├── entities/       # Entidades do TypeORM (Order, Item)
 ├── data-source.ts  # Configuração de conexão com o banco de dados
 └── index.ts        # Ponto de entrada (Servidor, Rotas, Swagger e JWT)
