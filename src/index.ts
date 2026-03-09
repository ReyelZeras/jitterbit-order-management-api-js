import express, { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import swaggerUi from "swagger-ui-express";
import { AppDataSource } from "./data-source";
import { OrderController } from "./controllers/OrderController";

const app = express();
app.use(express.json());

const JWT_SECRET = "super-secret-key-muda-em-prod";

// --- MIDDLEWARE DE AUTENTICAÇÃO ---
const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(401).json({ message: "Token não fornecido" });

  try {
    jwt.verify(token, JWT_SECRET);
    next();
  } catch (err) {
    return res.status(403).json({ message: "Token inválido" });
  }
};

// --- ROTAS DA API ---
const orderController = new OrderController();

// Login Fake para pegar o Token JWT
app.post("/auth/login", (req, res) => {
  // Na vida real, validaria user/password no DB
  const token = jwt.sign({ user: "admin" }, JWT_SECRET, { expiresIn: "1h" });
  res.json({ token });
});

// Agrupamento de rotas de Pedido (Com Proteção JWT)
const orderRouter = express.Router();
orderRouter.use(authMiddleware); // Aplica o filtro JWT em todas as rotas abaixo

orderRouter.post("/", (req, res) => orderController.create(req, res));
orderRouter.get("/list", (req, res) => orderController.listAll(req, res)); 
orderRouter.get("/:id", (req, res) => orderController.getById(req, res));
orderRouter.put("/:id", (req, res) => orderController.update(req, res));
orderRouter.delete("/:id", (req, res) => orderController.delete(req, res));

app.use("/order", orderRouter);

// --- SWAGGER DOCUMENTAÇÃO ---
const swaggerDocument = {
  openapi: "3.0.0",
  info: { 
    title: "Order API", 
    description: "Documentação da API de Gestão de Pedidos e Itens para o Teste Técnico",
    version: "1.0.0" 
  },
  components: {
    securitySchemes: {
      bearerAuth: {
        type: "http",
        scheme: "bearer",
        bearerFormat: "JWT"
      }
    }
  },
  paths: {
    "/auth/login": {
      post: {
        tags: ["Autenticação"],
        summary: "Gera um token JWT válido",
        responses: {
          200: { 
            description: "Token gerado com sucesso",
            content: { "application/json": { schema: { type: "object", properties: { token: { type: "string" } } } } }
          }
        }
      }
    },
    "/order": {
      post: {
        tags: ["Pedidos"],
        summary: "Cria um novo pedido com os seus itens",
        security: [{ bearerAuth: [] }],
        requestBody: {
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  numeroPedido: { type: "string", example: "PEDIDO-999" },
                  valorTotal: { type: "number", example: 1500.50 },
                  dataCriacao: { type: "string", format: "date-time", example: "2024-03-09T15:00:00Z" },
                  items: {
                    type: "array",
                    items: {
                      type: "object",
                      properties: {
                        idItem: { type: "string", example: "PROD-001" },
                        quantidadeItem: { type: "number", example: 5 },
                        valorItem: { type: "number", example: 300.10 }
                      }
                    }
                  }
                }
              }
            }
          }
        },
        responses: {
          201: { description: "Pedido criado com sucesso" },
          401: { description: "Não autorizado (Token ausente)" },
          500: { description: "Erro interno no servidor" }
        }
      }
    },
    "/order/list": {
      get: {
        tags: ["Pedidos"],
        summary: "Lista todos os pedidos registados no sistema",
        security: [{ bearerAuth: [] }],
        responses: {
          200: { description: "Lista retornada com sucesso" }
        }
      }
    },
    "/order/{id}": {
      get: {
        tags: ["Pedidos"],
        summary: "Obtém detalhes de um pedido específico",
        security: [{ bearerAuth: [] }],
        parameters: [
          { name: "id", in: "path", required: true, schema: { type: "string" }, description: "O número do pedido" }
        ],
        responses: {
          200: { description: "Pedido encontrado" },
          404: { description: "Pedido não localizado" }
        }
      },
      put: {
        tags: ["Pedidos"],
        summary: "Atualiza os dados de um pedido",
        security: [{ bearerAuth: [] }],
        parameters: [
          { name: "id", in: "path", required: true, schema: { type: "string" } }
        ],
        requestBody: {
          content: { "application/json": { schema: { type: "object" } } }
        },
        responses: {
          200: { description: "Pedido atualizado com sucesso" }
        }
      },
      delete: {
        tags: ["Pedidos"],
        summary: "Remove um pedido e os seus itens",
        security: [{ bearerAuth: [] }],
        parameters: [
          { name: "id", in: "path", required: true, schema: { type: "string" } }
        ],
        responses: {
          200: { description: "Pedido removido com sucesso" }
        }
      }
    }
  }
};

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));


// --- INICIALIZAÇÃO  ---
AppDataSource.initialize().then(() => {
  console.log("🔥 Banco de dados conectado via TypeORM");
  app.listen(3000, () => {
    console.log("🚀 Servidor rodando em http://localhost:3000");
    console.log("📚 Swagger em http://localhost:3000/api-docs");
  });
}).catch(error => console.log(error));