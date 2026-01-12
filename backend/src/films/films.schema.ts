import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

@Schema({ _id: false })
export class FilmSession {
  @Prop({ required: true })
  id: string;

  @Prop({ required: true })
  daytime: string;

  @Prop({ required: true })
  hall: number;

  @Prop({ required: true })
  rows: number;

  @Prop({ required: true })
  seats: number;

  @Prop({ required: true })
  price: number;

  @Prop({ type: [String], default: [] })
  taken: string[];
}

const FilmSessionSchema = SchemaFactory.createForClass(FilmSession);

@Schema({ collection: 'films' })
export class Film {
  @Prop({ required: true, unique: true })
  id: string;

  @Prop({ required: true })
  title: string;

  @Prop()
  description?: string;

  @Prop()
  about?: string;

  @Prop()
  director?: string;

  @Prop()
  rating?: number;

  @Prop()
  durationMinutes?: number;

  @Prop()
  posterUrl?: string;

  @Prop()
  image?: string;

  @Prop()
  cover?: string;

  @Prop({ type: [String], default: [] })
  genres: string[];

  @Prop({ type: [String], default: [] })
  tags: string[];

  @Prop({ type: [FilmSessionSchema], default: [] })
  schedule: FilmSession[];
}

export type FilmDocument = HydratedDocument<Film>;
export const FilmSchema = SchemaFactory.createForClass(Film);
