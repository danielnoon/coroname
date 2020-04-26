import t from '../../api-helpers/thunk';
import { response } from '../../api-helpers/models/response';
import { getUser } from '../../api-helpers/auth';
import { connect } from '../../api-helpers/mongo';
import {
  animeModelAsAnime,
  AnimeModel,
  Anime,
} from '../../api-helpers/models/anime';

export default t(async (req, res) => {
  connect();

  const token = req.headers['auth-token'] as string;

  await getUser(token);

  const all: Anime[] = [];

  const continuingSeries = await AnimeModel.findOne({ continuingSeries: true });

  if (continuingSeries) {
    all.push(animeModelAsAnime(continuingSeries));
  }

  const rest = await AnimeModel.find({ continuingSeries: false }).sort({
    votes: -1,
  });

  rest.forEach((anime) => all.push(animeModelAsAnime(anime)));

  res.send(response(0, all));
});
