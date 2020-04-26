import t from '../../api-helpers/thunk';
import Kitsu from 'kitsu';
import { response } from '../../api-helpers/models/response';
import { getUser } from '../../api-helpers/auth';
import { connect } from '../../api-helpers/mongo';
import { kitsuArrayToCoroname } from '../../api-helpers/models/anime';
import { HttpError } from '../../api-helpers/http-error';

const kitsu = new Kitsu();

export default t(async (req, res) => {
  connect();

  const token = req.headers['auth-token'] as string;

  await getUser(token);

  const query = req.query.q as string;

  const { data, errors } = await kitsu.get('anime', {
    filter: { text: query },
  });

  if (errors) {
    throw new HttpError(errors[0].code, errors[0].title);
  }

  const anime = await kitsuArrayToCoroname(data);

  res.send(response(0, anime));
});
