import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ShowtimeEntity } from '../src/modules/showtimes/entities/showtime.entity';
import { MovieEntity } from '../src/modules/movies/entities/movie.entity';

describe('Showtimes API (e2e)', () => {
  let app: INestApplication;
  let showtimesRepository: Repository<ShowtimeEntity>;
  let moviesRepository: Repository<MovieEntity>;

  let testMovieId: number;
  const testMovie = {
    title: 'Showtime Test Movie',
    genre: 'Action',
    duration: 120,
    rating: 8.5,
    releaseYear: 2020,
  };

  const testShowtime = {
    price: 15.5,
    theater: 'Theater 1',
    startTime: new Date('2025-05-01T10:00:00Z').toISOString(),
    endTime: new Date('2025-05-01T12:00:00Z').toISOString(),
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

    // Clean test data and create a test movie for showtimes
    await showtimesRepository.delete({});
    await moviesRepository.delete({ title: testMovie.title });

    const movie = await moviesRepository.save(
      moviesRepository.create(testMovie),
    );
    testMovieId = movie.id;
  });

  afterEach(async () => {
    await showtimesRepository.delete({});
  });

  afterAll(async () => {
    await showtimesRepository.delete({});
    await moviesRepository.delete({ title: testMovie.title });
    await app.close();
  });

  describe('/showtimes (POST)', () => {
    it('should create a new showtime', async () => {
      const createShowtimeDto = {
        ...testShowtime,
        movieId: testMovieId,
      };

      const response = await request(app.getHttpServer())
        .post('/showtimes')
        .send(createShowtimeDto)
        .expect(200);
      expect(response.body).toHaveProperty('id');
      expect(response.body.price).toBe(testShowtime.price);
      expect(response.body.movieId).toBe(testMovieId);
      expect(response.body.theater).toBe(testShowtime.theater);
      expect(new Date(response.body.startTime).toISOString()).toBe(
        testShowtime.startTime,
      );
      expect(new Date(response.body.endTime).toISOString()).toBe(
        testShowtime.endTime,
      );
    });

    it('should reject a showtime with invalid date range', () => {
      const invalidShowtime = {
        price: 15.5,
        movieId: testMovieId,
        theater: 'Theater 1',
        // End time before start time
        startTime: new Date('2025-05-01T14:00:00Z').toISOString(),
        endTime: new Date('2025-05-01T12:00:00Z').toISOString(),
      };

      return request(app.getHttpServer())
        .post('/showtimes')
        .send(invalidShowtime)
        .expect(400);
    });

    it('should reject a showtime for non-existent movie', () => {
      const invalidShowtime = {
        price: 15.5,
        movieId: 99999, // Non-existent movie ID
        theater: 'Theater 1',
        startTime: new Date('2025-05-01T14:00:00Z').toISOString(),
        endTime: new Date('2025-05-01T16:00:00Z').toISOString(),
      };

      return request(app.getHttpServer())
        .post('/showtimes')
        .send(invalidShowtime)
        .expect(404);
    });

    it('should reject overlapping showtimes in the same theater', async () => {
      const firstShowtime = {
        price: 15.5,
        movieId: testMovieId,
        theater: 'Overlap Test Theater',
        startTime: new Date('2025-05-01T14:00:00Z').toISOString(),
        endTime: new Date('2025-05-01T16:00:00Z').toISOString(),
      };

      await request(app.getHttpServer())
        .post('/showtimes')
        .send(firstShowtime)
        .expect(200);

      const overlappingShowtime = {
        movieId: testMovieId,
        price: 15.5,
        theater: 'Overlap Test Theater',
        startTime: new Date('2025-05-01T15:00:00Z').toISOString(),
        endTime: new Date('2025-05-01T17:00:00Z').toISOString(),
      };

      return request(app.getHttpServer())
        .post('/showtimes')
        .send(overlappingShowtime)
        .expect(400);
    });
  });

  describe('/showtimes/update/:showtimeId (POST)', () => {
    it('should update a showtime', async () => {
      const createShowtimeDto = {
        price: 15.5,
        movieId: testMovieId,
        theater: 'Update Test Theater',
        startTime: new Date('2025-05-03T10:00:00Z').toISOString(),
        endTime: new Date('2025-05-03T12:00:00Z').toISOString(),
      };

      const createResponse = await request(app.getHttpServer())
        .post('/showtimes')
        .send(createShowtimeDto);

      const showtimeId = createResponse.body.id;

      const updateData = {
        price: 20.0,
        theater: 'Updated Theater',
      };

      await request(app.getHttpServer())
        .post(`/showtimes/update/${showtimeId}`)
        .send(updateData)
        .expect(200);

      const updatedShowtime = await showtimesRepository.findOne({
        where: { id: showtimeId },
      });

      expect(updatedShowtime).not.toBeNull();
      expect(updatedShowtime.price).toBe(updateData.price);
      expect(updatedShowtime.theater).toBe(updateData.theater);
      expect(updatedShowtime.movieId).toBe(testMovieId);
    });

    it('should reject update with invalid time range', async () => {
      const createShowtimeDto = {
        price: 15.5,
        movieId: testMovieId,
        theater: 'Invalid Update Test Theater',
        startTime: new Date('2025-05-04T10:00:00Z').toISOString(),
        endTime: new Date('2025-05-04T12:00:00Z').toISOString(),
      };

      const createResponse = await request(app.getHttpServer())
        .post('/showtimes')
        .send(createShowtimeDto);

      const showtimeId = createResponse.body.id;

      const invalidUpdate = {
        startTime: new Date('2025-05-04T14:00:00Z').toISOString(),
        endTime: new Date('2025-05-04T13:00:00Z').toISOString(), // End before start
      };

      return request(app.getHttpServer())
        .post(`/showtimes/update/${showtimeId}`)
        .send(invalidUpdate)
        .expect(400);
    });

    it('should return 404 when updating non-existent showtime', () => {
      return request(app.getHttpServer())
        .post('/showtimes/update/9999')
        .send({ price: 20.0 })
        .expect(404);
    });
  });

  describe('/showtimes/:showtimeId (DELETE)', () => {
    it('should delete a showtime', async () => {
      const createShowtimeDto = {
        price: 15.5,
        movieId: testMovieId,
        theater: 'Delete Test Theater',
        startTime: new Date('2025-05-05T10:00:00Z').toISOString(),
        endTime: new Date('2025-05-05T12:00:00Z').toISOString(),
      };

      const createResponse = await request(app.getHttpServer())
        .post('/showtimes')
        .send(createShowtimeDto);

      const showtimeId = createResponse.body.id;

      await request(app.getHttpServer())
        .delete(`/showtimes/${showtimeId}`)
        .expect(200);

      const deletedShowtime = await showtimesRepository.findOne({
        where: { id: showtimeId },
      });

      expect(deletedShowtime).toBeNull();
    });

    it('should return 404 when deleting non-existent showtime', () => {
      return request(app.getHttpServer()).delete('/showtimes/9999').expect(404);
    });
  });
});
