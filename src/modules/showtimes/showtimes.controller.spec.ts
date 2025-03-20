import { Test, TestingModule } from '@nestjs/testing';
import { ShowtimesController } from './showtimes.controller';
import mock = jest.mock;
import { ShowtimesService } from './showtimes.service';

describe('ShowtimesController', () => {
  let controller: ShowtimesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ShowtimesController],
      providers: [
        {
          provide: ShowtimesService,
          useValue: mock,
        },
      ],
    }).compile();

    controller = module.get<ShowtimesController>(ShowtimesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
