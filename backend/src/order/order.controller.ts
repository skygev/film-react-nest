import { Body, Controller, Post } from '@nestjs/common';

import { CreateOrderDto, OrderResultDto } from './dto/order.dto';
import { OrderService } from './order.service';
import { ListResponseDto } from '../common/dto/list-response.dto';

@Controller('order')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @Post()
  create(
    @Body() dto: CreateOrderDto,
  ): Promise<ListResponseDto<OrderResultDto>> {
    return this.orderService.createOrder(dto);
  }
}
