import { Test, TestingModule } from '@nestjs/testing';
import { BookingsController } from './bookings.controller';
import mock = jest.mock;
import { BookingsService } from './bookings.service';

describe('BookingsController', () => {
  let controller: BookingsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [BookingsController],
      providers: [
        {
          provide: BookingsService,
          useValue: mock,
        },
      ],
    }).compile();

    controller = module.get<BookingsController>(BookingsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
