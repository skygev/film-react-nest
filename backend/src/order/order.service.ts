import { Injectable } from '@nestjs/common';

import { CreateOrderDto, OrderStatusDto } from './dto/order.dto';

@Injectable()
export class OrderService {
  private readonly orders: OrderStatusDto[] = [];

  createOrder(dto: CreateOrderDto): OrderStatusDto {
    const order: OrderStatusDto = {
      orderId: `order-${Date.now()}`,
      status: 'processing',
      totalPrice: dto.ticketsCount * 450,
    };

    this.orders.push(order);

    return order;
  }
}
