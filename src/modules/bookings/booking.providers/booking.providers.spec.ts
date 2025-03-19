import { Test, TestingModule } from '@nestjs/testing';
import { bookingProviders } from './booking.providers';

describe('BookingProviders', () => {
  let provider: any[];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [...bookingProviders],
    }).compile();

    provider = module.get('BOOKING_REPOSITORY');
  });

  it('should be defined', () => {
    expect(provider).toBeDefined();
  });
});
