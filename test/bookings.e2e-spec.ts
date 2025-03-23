import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BookingEntity } from '../src/modules/bookings/entities/booking.entity';
import { ShowtimeEntity } from '../src/modules/showtimes/entities/showtime.entity';
import { MovieEntity } from '../src/modules/movies/entities/movie.entity';
import { v4 as uuidv4 } from 'uuid';

describe('Bookings API (e2e)', () => {
  let app: INestApplication;
  let bookingsRepository: Repository<BookingEntity>;
  let showtimesRepository: Repository<ShowtimeEntity>;
  let moviesRepository: Repository<MovieEntity>;

  let testMovieId: number;
  let testShowtimeId: number;
  const testUserId = uuidv4();

  const testMovie = {
    title: 'Booking Test Movie',
    genre: 'Comedy',
    duration: 110,
    rating: 7.8,
    releaseYear: 2021,
  };

  const testShowtime = {
    price: 12.5,
    theater: 'Booking Test Theater',
    startTime: new Date('2025-05-10T18:00:00Z').toISOString(),
    endTime: new Date('2025-05-10T20:00:00Z').toISOString(),
  };

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        transform: true,
        forbidNonWhitelisted: true,
        transformOptions: {
          enableImplicitConversion: true,
        },
      }),
    );

    await app.init();

    moviesRepository = app.get<Repository<MovieEntity>>(
      getRepositoryToken(MovieEntity),
    );
    showtimesRepository = app.get<Repository<ShowtimeEntity>>(
      getRepositoryToken(ShowtimeEntity),
    );
    bookingsRepository = app.get<Repository<BookingEntity>>(
      getRepositoryToken(BookingEntity),
    );

    // Clean test data and create necessary test entities
    await bookingsRepository.delete({});
    await showtimesRepository.delete({});
    await moviesRepository.delete({ title: testMovie.title });

    const movie = await moviesRepository.save(
      moviesRepository.create(testMovie),
    );
    testMovieId = movie.id;

    const showtime = await showtimesRepository.save(
      showtimesRepository.create({
        ...testShowtime,
        movieId: testMovieId,
      }),
    );
    testShowtimeId = showtime.id;
  });

  afterEach(async () => {
    await bookingsRepository.delete({});
  });

  afterAll(async () => {
    await bookingsRepository.delete({});
    await showtimesRepository.delete({});
    await moviesRepository.delete({ title: testMovie.title });
    await app.close();
  });

  describe('/bookings (POST)', () => {
    it('should create a new booking', async () => {
      const createBookingDto = {
        showtimeId: testShowtimeId,
        seatNumber: 1,
        userId: testUserId,
      };

      const response = await request(app.getHttpServer())
        .post('/bookings')
        .send(createBookingDto)
        .expect(200);
      expect(response.body).toHaveProperty('bookingId');
      expect(typeof response.body.bookingId).toBe('string');
    });

    it('should reject booking for non-existent showtime', () => {
      const invalidBooking = {
        showtimeId: 99999, // Non-existent showtime ID
        seatNumber: 5,
        userId: testUserId,
      };

      return request(app.getHttpServer())
        .post('/bookings')
        .send(invalidBooking)
        .expect(404);
    });

    it('should reject booking for already taken seat', async () => {
      const createBookingDto = {
        showtimeId: testShowtimeId,
        seatNumber: 10,
        userId: testUserId,
      };

      await request(app.getHttpServer())
        .post('/bookings')
        .send(createBookingDto)
        .expect(200);

      return request(app.getHttpServer())
        .post('/bookings')
        .send(createBookingDto)
        .expect(409);
    });

    it('should validate booking data', () => {
      const invalidBooking = {
        showtimeId: testShowtimeId,
        seatNumber: -1,
        userId: 'not-a-uuid',
      };

      return request(app.getHttpServer())
        .post('/bookings')
        .send(invalidBooking)
        .expect(400);
    });

    it('should allow booking different seats for the same showtime', async () => {
      const booking1 = {
        showtimeId: testShowtimeId,
        seatNumber: 20,
        userId: testUserId,
      };

      const booking2 = {
        showtimeId: testShowtimeId,
        seatNumber: 21,
        userId: testUserId,
      };

      await request(app.getHttpServer())
        .post('/bookings')
        .send(booking1)
        .expect(200);

      return request(app.getHttpServer())
        .post('/bookings')
        .send(booking2)
        .expect(200);
    });

    it('should allow different users to book seats', async () => {
      const anotherUserId = uuidv4();

      const booking1 = {
        showtimeId: testShowtimeId,
        seatNumber: 30,
        userId: testUserId,
      };

      const booking2 = {
        showtimeId: testShowtimeId,
        seatNumber: 31,
        userId: anotherUserId,
      };

      await request(app.getHttpServer())
        .post('/bookings')
        .send(booking1)
        .expect(200);

      return request(app.getHttpServer())
        .post('/bookings')
        .send(booking2)
        .expect(200);
    });
  });
});
