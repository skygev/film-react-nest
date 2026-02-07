import { Test, TestingModule } from '@nestjs/testing';

import { FilmsController } from './films.controller';
import { FilmsService } from './films.service';
import { ListResponseDto } from '../common/dto/list-response.dto';

describe('FilmsController', () => {
  let controller: FilmsController;
  const filmsService = {
    findAll: jest.fn(),
    findSchedule: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [FilmsController],
      providers: [
        {
          provide: FilmsService,
          useValue: filmsService,
        },
      ],
    }).compile();

    controller = module.get<FilmsController>(FilmsController);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should return films list response', async () => {
    const expected: ListResponseDto<any> = { total: 0, items: [] };
    filmsService.findAll.mockResolvedValueOnce(expected);

    const result = await controller.getFilms({});

    expect(result).toEqual(expected);
    expect(filmsService.findAll).toHaveBeenCalled();
  });

  it('should throw when schedule missing', async () => {
    filmsService.findSchedule.mockResolvedValueOnce(undefined);

    await expect(controller.getSchedule('id')).rejects.toThrow();
  });
});
