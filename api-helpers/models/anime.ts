import * as mongoose from 'mongoose';

export class Anime {
  constructor(
    public kitsuId: number,
    public title: string,
    public poster: string,
    public synopsis: string,
    public nsfw: boolean,
    public continuingSeries: boolean,
    public votes: number
  ) {}
}

export async function kitsuArrayToCoroname(kitsu: any[]) {
  const results: Anime[] = [];

  for (const anime of kitsu) {
    results.push(await kitsuToCoroname(anime));
  }

  return results;
}

export async function kitsuToCoroname(anime: any) {
  const id = parseInt(anime.id as string, 10);
  const title = anime.canonicalTitle as string;
  const poster =
    anime.posterImage && anime.posterImage.large
      ? (anime.posterImage.large as string)
      : 'https://www.coroname.net/assets/placeholder-poster.png';
  const synopsis = anime.synopsis as string;
  const nsfw = anime.nsfw as boolean;

  const existing = await AnimeModel.findOne({ kitsuId: id });

  if (existing) {
    return animeModelAsAnime(existing);
  } else {
    return new Anime(id, title, poster, synopsis, nsfw, false, 0);
  }
}

export interface IAnime extends mongoose.Document {
  kitsuId: number;
  title: string;
  poster: string;
  synopsis: string;
  nsfw: boolean;
  continuingSeries: boolean;
  votes: number;
}

const animeSchema = new mongoose.Schema<IAnime>({
  kitsuId: { type: Number, unique: true, required: true },
  title: { type: String, required: true },
  poster: String,
  synopsis: String,
  nsfw: Boolean,
  continuingSeries: Boolean,
  votes: Number,
});

export const AnimeModel = mongoose.model<IAnime>('Anime', animeSchema);

export function animeModelAsAnime(anime: IAnime) {
  return new Anime(
    anime.kitsuId,
    anime.title,
    anime.poster,
    anime.synopsis,
    anime.nsfw,
    anime.continuingSeries,
    anime.votes
  );
}
