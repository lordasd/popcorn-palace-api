import { Entity, Column, PrimaryGeneratedColumn  } from 'typeorm';

@Entity('movies')
export class MovieEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column()
  genre: string;

  @Column()
  duration: number;

  @Column()
  rating: number;

  @Column()
  releaseYear: Date;
}
