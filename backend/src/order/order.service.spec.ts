import { Test, TestingModule } from '@nestjs/testing';
import { ConflictException, NotFoundException } from '@nestjs/common';

import { OrderService } from './order.service';
import { FilmsRepository } from '../films/films.repository';
import { CreateOrderDto, OrderTicketRequestDto } from './dto/order.dto';

const createFilmDocument = (overrides: Partial<any> = {}) => {
  const film = {
    id: 'film-1',
    schedule: [
      {
        id: 'session-1',
        daytime: '2024-06-01T10:00:00.000Z',
        price: 450,
        taken: [],
      },
    ],
    ...overrides,
  };

  return film;
};

describe('OrderService', () => {
  let service: OrderService;
  const filmsRepository = {
    findById: jest.fn(),
    saveTakenSeats: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        OrderService,
        {
          provide: FilmsRepository,
          useValue: filmsRepository,
        },
      ],
    }).compile();

    service = module.get<OrderService>(OrderService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should throw when no tickets provided', async () => {
    const dto = { tickets: [], email: 'test@example.com' } as CreateOrderDto;
    await expect(service.createOrder(dto)).rejects.toThrow();
  });

  it('should book seats and persist film', async () => {
    const film = createFilmDocument();
    filmsRepository.findById.mockResolvedValue(film);
    filmsRepository.saveTakenSeats.mockResolvedValue(undefined);

    const tickets: OrderTicketRequestDto[] = [
      {
        film: film.id,
        session: 'session-1',
        row: 1,
        seat: 1,
        daytime: 'should be ignored',
        price: 999,
      },
    ];

    const dto: CreateOrderDto = {
      tickets,
      email: 'user@example.com',
    };

    const result = await service.createOrder(dto);

    expect(result.total).toBe(1);
    expect(film.schedule[0].taken).toContain('1:1');
    expect(filmsRepository.saveTakenSeats).toHaveBeenCalledWith([
      film.schedule[0],
    ]);
  });

  it('should prevent booking taken seat', async () => {
    const film = createFilmDocument({
      schedule: [
        {
          id: 'session-1',
          daytime: '2024-06-01T10:00:00.000Z',
          price: 450,
          taken: ['1:1'],
        },
      ],
    });
    filmsRepository.findById.mockResolvedValue(film);

    const dto: CreateOrderDto = {
      tickets: [{ film: film.id, session: 'session-1', row: 1, seat: 1 }],
      email: 'user@example.com',
    };

    await expect(service.createOrder(dto)).rejects.toThrow(ConflictException);
  });

  it('should throw when film not found', async () => {
    filmsRepository.findById.mockResolvedValue(null);

    const envelope: CreateOrderDto = {
      tickets: [{ film: 'film-unknown', session: 'session', row: 1, seat: 1 }],
      email: 'user@example.com',
    };

    await expect(service.createOrder(envelope)).rejects.toThrow(
      NotFoundException,
    );
  });

  it('should support array payload format', async () => {
    const film = createFilmDocument();
    filmsRepository.findById.mockResolvedValue(film);
    filmsRepository.saveTakenSeats.mockResolvedValue(undefined);

    const dto: CreateOrderDto = [
      { film: film.id, session: 'session-1', row: 1, seat: 1 },
    ];

    const result = await service.createOrder(dto);

    expect(result.total).toBe(1);
    expect(film.schedule[0].taken).toContain('1:1');
    expect(filmsRepository.saveTakenSeats).toHaveBeenCalledWith([
      film.schedule[0],
    ]);
  });
});
