import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('bookings')
export class BookingEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  showtimeId: number;

  @Column()
  seatNumber: number;

  @Column('uuid')
  userId: string;
}
