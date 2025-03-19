import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('showtime')
export class ShowtimeEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  showtimeId: number;

  @Column()
  theater: string;

  @Column()
  startTime: Date;

  @Column()
  endTime: Date;

  @Column('float')
  price: number;
}
