import { Order } from "../entities/Order";
import { Item } from "../entities/Item";

// Formato de entrada (Payload da API)
export interface OrderInputDTO {
  numeroPedido: string;
  valorTotal: number;
  dataCriacao: string;
  items: {
    idItem: string;
    quantidadeItem: number;
    valorItem: number;
  }[];
}

export class OrderMapper {
  // Converte do DTO (Português) para a Entidade (Inglês)
  static toEntity(dto: OrderInputDTO): Order {
    const order = new Order();
    order.orderId = dto.numeroPedido;
    order.value = dto.valorTotal;
    order.creationDate = new Date(dto.dataCriacao);
    
    order.items = dto.items.map(itemDto => {
      const item = new Item();
      item.productId = parseInt(itemDto.idItem);
      item.quantity = itemDto.quantidadeItem;
      item.price = itemDto.valorItem;
      return item;
    });

    return order;
  }

  // Converte da Entidade (Inglês) para o Response (Inglês, conforme spec)
  static toResponse(entity: Order) {
    return {
      orderId: entity.orderId,
      value: Number(entity.value), // Garante que decimal venha como numero
      creationDate: entity.creationDate.toISOString(),
      items: entity.items.map(item => ({
        productId: item.productId,
        quantity: item.quantity,
        price: Number(item.price)
      }))
    };
  }
}