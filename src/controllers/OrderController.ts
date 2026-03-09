import { Request, Response } from "express";
import { AppDataSource } from "../data-source";
import { Order } from "../entities/Order";
import { OrderMapper, OrderInputDTO } from "../dtos/OrderMapper";

export class OrderController {
  private orderRepository = AppDataSource.getRepository(Order);

  // POST /order
  async create(req: Request, res: Response): Promise<Response> {
    try {
      const payload = req.body as OrderInputDTO;
      
      // Verifica se já existe
      const exists = await this.orderRepository.findOneBy({ orderId: payload.numeroPedido });
      if (exists) {
        return res.status(409).json({ message: "Pedido já existe" });
      }

      // Mapping e Save (Cascade salvará os itens automaticamente)
      const orderEntity = OrderMapper.toEntity(payload);
      const savedOrder = await this.orderRepository.save(orderEntity);

      return res.status(201).json(OrderMapper.toResponse(savedOrder));
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: "Erro interno no servidor" });
    }
  }

  // GET /order/list
  async listAll(req: Request, res: Response): Promise<Response> {
    try {
      const orders = await this.orderRepository.find();
      const response = orders.map(o => OrderMapper.toResponse(o));
      return res.status(200).json(response);
    } catch (error) {
      return res.status(500).json({ message: "Erro ao buscar pedidos" });
    }
  }

  // GET /order/:id
  async getById(req: Request, res: Response): Promise<Response> {
    try {
      const { id } = req.params;
      const order = await this.orderRepository.findOneBy({ orderId: id });
      
      if (!order) return res.status(404).json({ message: "Pedido não encontrado" });
      
      return res.status(200).json(OrderMapper.toResponse(order));
    } catch (error) {
      return res.status(500).json({ message: "Erro ao buscar pedido" });
    }
  }

  // PUT /order/:id
  async update(req: Request, res: Response): Promise<Response> {
    try {
      const { id } = req.params;
      const payload = req.body as OrderInputDTO;

      let order = await this.orderRepository.findOneBy({ orderId: id });
      if (!order) return res.status(404).json({ message: "Pedido não encontrado" });

      // No TypeORM, para atualizar dependências (Cascade), removemos e inserimos
      // Para manter simples, atualizamos os dados raiz e reescrevemos os itens
      const updatedEntity = OrderMapper.toEntity(payload);
      updatedEntity.orderId = id; // Garante que o ID não muda

      await this.orderRepository.save(updatedEntity);
      
      return res.status(200).json(OrderMapper.toResponse(updatedEntity));
    } catch (error) {
      return res.status(500).json({ message: "Erro ao atualizar pedido" });
    }
  }

  // DELETE /order/:id
  async delete(req: Request, res: Response): Promise<Response> {
    try {
      const { id } = req.params;
      const order = await this.orderRepository.findOneBy({ orderId: id });
      
      if (!order) return res.status(404).json({ message: "Pedido não encontrado" });

      await this.orderRepository.remove(order); // Remove em cascata os items
      return res.status(204).send();
    } catch (error) {
      return res.status(500).json({ message: "Erro ao deletar pedido" });
    }
  }
}