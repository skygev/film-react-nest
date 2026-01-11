import { Body, Controller, Post } from '@nestjs/common';

import { CreateOrderDto, OrderStatusDto } from './dto/order.dto';
import { OrderService } from './order.service';

@Controller('order')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @Post()
  create(@Body() dto: CreateOrderDto): OrderStatusDto {
    return this.orderService.createOrder(dto);
  }
}
