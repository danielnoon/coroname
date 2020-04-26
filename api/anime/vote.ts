import t from '../../api-helpers/thunk';
import Kitsu from 'kitsu';
import validate from '../../api-helpers/validate';
import { response } from '../../api-helpers/models/response';
import { getUser } from '../../api-helpers/auth';
import { connect } from '../../api-helpers/mongo';
import { AnimeModel, kitsuToCoroname } from '../../api-helpers/models/anime';
import { HttpError } from '../../api-helpers/http-error';
import { NowResponse } from '@now/node';
import { IUser } from '../../api-helpers/models/user';

const kitsu = new Kitsu();

export default t(async (req, res) => {
  connect();

  validate(req.body, ['id:number!']);

  const token = req.headers['auth-token'] as string;

  const user = await getUser(token);

  const kitsuId = req.body.id as number;

  if (user.votedFor.includes(kitsuId)) {
    rescind(res, user, kitsuId);
  } else {
    vote(res, user, kitsuId);
  }
});

async function vote(res: NowResponse, user: IUser, kitsuId: number) {
  if (user.votesAvailable < 1) {
    throw new HttpError(403, 'No votes remaining.');
  }

  let anime = await AnimeModel.findOne({ kitsuId });

  if (!anime) {
    const { data, errors } = await kitsu.get('anime/' + kitsuId);

    if (errors) {
      throw new HttpError(errors[0].code, errors[0].title);
    }

    const nAnime = await kitsuToCoroname(data);

    anime = new AnimeModel(nAnime);
  }

  anime.votes++;

  await anime.save();

  user.votesAvailable--;
  user.votedFor.push(kitsuId);

  await user.save();

  res.send(response(0, 'success'));
}

async function rescind(res: NowResponse, user: IUser, kitsuId: number) {
  if (!user.votedFor.includes(kitsuId)) {
    throw new HttpError(403, 'You have not voted for this anime!');
  }

  const anime = await AnimeModel.findOne({ kitsuId });

  if (!anime) {
    throw new HttpError(418, 'What the fuck??');
  }

  anime.votes--;

  await anime.save();

  user.votesAvailable++;
  user.votedFor.splice(user.votedFor.indexOf(kitsuId), 1);

  await user.save();

  res.send(response(0, 'success'));
}
