import { Test, TestingModule } from '@nestjs/testing';

import { FilmsService } from './films.service';
import { FilmsRepository } from './films.repository';

describe('FilmsService', () => {
  let service: FilmsService;
  const filmsRepository = {
    findAll: jest.fn(),
    findById: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        FilmsService,
        {
          provide: FilmsRepository,
          useValue: filmsRepository,
        },
      ],
    }).compile();

    service = module.get<FilmsService>(FilmsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should request films from repository', async () => {
    filmsRepository.findAll.mockResolvedValueOnce([]);

    const result = await service.findAll();

    expect(result).toEqual({ total: 0, items: [] });
    expect(filmsRepository.findAll).toHaveBeenCalled();
  });

  it('should return undefined when film not found', async () => {
    filmsRepository.findById.mockResolvedValueOnce(null);

    const schedule = await service.findSchedule('unknown');

    expect(schedule).toBeUndefined();
  });
});
