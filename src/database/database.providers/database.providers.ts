import { DataSource } from 'typeorm';

export const databaseProviders = [
  {
    provide: 'DATA_SOURCE',
    useFactory: async () => {
      const dataSource = new DataSource({
        type: 'postgres',
        host: 'localhost',
        port: 5432,
        username: 'postgres',
        password: 'postgres', // Change to your DB password
        database: 'popcorn_palace',
        entities: [
          __dirname + '/../**/*.entity{.ts,.js}',
        ],
        synchronize: true, // Set to false in production
      });

      return dataSource.initialize();
    },
  },
];