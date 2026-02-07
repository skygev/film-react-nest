import { Column, Entity, JoinColumn, ManyToOne, PrimaryColumn } from 'typeorm';

import { FilmEntity } from './film.entity';

@Entity('schedules')
export class ScheduleEntity {
  @PrimaryColumn('uuid')
  id: string;

  @Column({ type: 'varchar' })
  daytime: string;

  @Column({ type: 'integer' })
  hall: number;

  @Column({ type: 'integer' })
  rows: number;

  @Column({ type: 'integer' })
  seats: number;

  @Column({ type: 'double precision' })
  price: number;

  @Column({ type: 'text', default: '' })
  taken: string;

  @Column({ type: 'uuid', name: 'filmId', nullable: true })
  filmId: string | null;

  @ManyToOne(() => FilmEntity, (film) => film.schedule, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'filmId' })
  film?: FilmEntity;
}
