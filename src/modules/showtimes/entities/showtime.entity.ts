import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('showtime')
export class ShowtimeEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('float')
  price: number;

  @Column()
  movieId: number;

  @Column()
  theater: string;

  @Column()
  startTime: Date;

  @Column()
  endTime: Date;
}
