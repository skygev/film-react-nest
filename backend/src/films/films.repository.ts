import { FilmsQueryDto } from './dto/films.dto';
import { FilmDocument, FilmSession } from './films.document';

export abstract class FilmsRepository {
  abstract findAll(query?: FilmsQueryDto): Promise<FilmDocument[]>;

  abstract findById(id: string): Promise<FilmDocument | null>;

  abstract saveTakenSeats(sessions: FilmSession[]): Promise<void>;
}
