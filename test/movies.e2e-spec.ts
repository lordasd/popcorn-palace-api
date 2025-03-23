import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { MovieEntity } from '../src/modules/movies/entities/movie.entity';

describe('Movies API (e2e)', () => {
  let app: INestApplication;
  let moviesRepository: Repository<MovieEntity>;

  const testMovie = {
    title: 'Test Movie E2E',
    genre: 'Action',
    duration: 120,
    rating: 8.5,
    releaseYear: 2025,
  };

  const testMovieTitles = [
    testMovie.title,
    'Duplicate Movie Title',
    'Get Movie Test',
    'Update Movie Test',
    'Delete Movie Test',
    'List Movies Test 1',
    'List Movies Test 2',
  ];

  const cleanupMoviesByTitles = async (titles: string[]) => {
    for (const title of titles) {
      await moviesRepository.delete({ title });
    }
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

    await cleanupMoviesByTitles(testMovieTitles);
  });

  afterAll(async () => {
    await cleanupMoviesByTitles(testMovieTitles);
    await app.close();
  });

  describe('/movies/all (GET)', () => {
    it('should return an array of movies', async () => {
      // Create a few movies first
      await moviesRepository.save(
        moviesRepository.create({
          ...testMovie,
          title: 'List Movies Test 1',
        }),
      );

      await moviesRepository.save(
        moviesRepository.create({
          ...testMovie,
          title: 'List Movies Test 2',
        }),
      );

      return request(app.getHttpServer())
        .get('/movies/all')
        .expect(200)
        .then((response) => {
          expect(Array.isArray(response.body)).toBe(true);
          expect(response.body.length).toBeGreaterThan(0);

          const testMovies = response.body.filter(
            (movie: any) =>
              movie.title === 'List Movies Test 1' ||
              movie.title === 'List Movies Test 2',
          );
          expect(testMovies.length).toBeGreaterThanOrEqual(1);
        });
    });
  });

  describe('/movies (POST)', () => {
    it('should create a new movie', async () => {
      const response = await request(app.getHttpServer())
        .post('/movies')
        .send(testMovie)
        .expect(200);
      expect(response.body).toHaveProperty('id');
      expect(response.body.title).toBe(testMovie.title);
      expect(response.body.genre).toBe(testMovie.genre);
      expect(response.body.duration).toBe(testMovie.duration);
      expect(response.body.rating).toBe(testMovie.rating);
      expect(response.body.releaseYear).toBe(testMovie.releaseYear);
    });

    it('should reject an invalid movie', () => {
      const invalidMovie = {
        title: 'Invalid Movie',
        duration: 'not a number',
      };

      return request(app.getHttpServer())
        .post('/movies')
        .send(invalidMovie)
        .expect(400);
    });

    it('should reject a duplicate movie title', async () => {
      const duplicateMovie = {
        ...testMovie,
        title: 'Duplicate Movie Title',
      };

      // Try to create, but ignore if it already exists
      try {
        await request(app.getHttpServer()).post('/movies').send(duplicateMovie);
      } catch (e) {
        // Ignore errors
      }

      // Now try to create it again, expecting conflict
      return request(app.getHttpServer())
        .post('/movies')
        .send(duplicateMovie)
        .expect(409);
    });
  });

  describe('/movies/update/:title (POST)', () => {
    it('should update a movie', async () => {
      const updateTestMovie = {
        ...testMovie,
        title: 'Update Movie Test',
      };

      await moviesRepository.save(moviesRepository.create(updateTestMovie));

      const updateData = {
        genre: 'Updated Genre',
        rating: 9.0,
      };

      await request(app.getHttpServer())
        .post('/movies/update/Update Movie Test')
        .send(updateData)
        .expect(200);

      const updatedMovie = await moviesRepository.findOne({
        where: { title: 'Update Movie Test' },
      });

      expect(updatedMovie.genre).toBe(updateData.genre);
      expect(updatedMovie.rating).toBe(updateData.rating);
      expect(updatedMovie.duration).toBe(testMovie.duration);
    });

    it('should return 404 when updating non-existent movie', () => {
      return request(app.getHttpServer())
        .post('/movies/update/NonExistentMovie')
        .send({ genre: 'Updated Genre' })
        .expect(404);
    });
  });

  describe('/movies/:title (DELETE)', () => {
    it('should delete a movie', async () => {
      const deleteTestMovie = {
        ...testMovie,
        title: 'Delete Movie Test',
      };

      await moviesRepository.save(moviesRepository.create(deleteTestMovie));

      await request(app.getHttpServer())
        .delete('/movies/Delete Movie Test')
        .expect(200);

      const deletedMovie = await moviesRepository.findOne({
        where: { title: 'Delete Movie Test' },
      });
      expect(deletedMovie).toBeNull();
    });

    it('should return 404 when deleting non-existent movie', () => {
      return request(app.getHttpServer())
        .delete('/movies/NonExistentMovie')
        .expect(404);
    });
  });
});
