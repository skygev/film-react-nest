import { Test, TestingModule } from '@nestjs/testing';

import { OrderController } from './order.controller';
import { OrderService } from './order.service';
import { CreateOrderDto, OrderResultDto } from './dto/order.dto';
import { ListResponseDto } from '../common/dto/list-response.dto';

describe('OrderController', () => {
  let controller: OrderController;
  const orderService = {
    createOrder: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [OrderController],
      providers: [
        {
          provide: OrderService,
          useValue: orderService,
        },
      ],
    }).compile();

    controller = module.get<OrderController>(OrderController);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should delegate order creation to service', async () => {
    const dto = {
      tickets: [{ film: 'film', session: 'session', row: 1, seat: 1 }],
      email: 'user@example.com',
    } as CreateOrderDto;

    const expected: ListResponseDto<OrderResultDto> = {
      total: 1,
      items: [
        {
          id: 'ticket-1',
          film: 'film',
          session: 'session',
          row: 1,
          seat: 1,
          daytime: '2024-06-01T10:00:00.000Z',
          price: 450,
        },
      ],
    };

    orderService.createOrder.mockResolvedValueOnce(expected);

    const result = await controller.create(dto);

    expect(result).toEqual(expected);
    expect(orderService.createOrder).toHaveBeenCalledWith(dto);
  });
});
