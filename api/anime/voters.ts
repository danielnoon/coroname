import t from '../../api-helpers/thunk';
import validate from '../../api-helpers/validate';
import { response } from '../../api-helpers/models/response';
import { getUser } from '../../api-helpers/auth';
import { connect } from '../../api-helpers/mongo';
import { AnimeModel } from '../../api-helpers/models/anime';
import { HttpError } from '../../api-helpers/http-error';
import { User, trimUsers } from '../../api-helpers/models/user';

export default t(async (req, res) => {
  connect();

  const token = req.headers['auth-token'] as string;

  await getUser(token);

  validate(req.query, ['id:number']);

  const id = parseInt(req.query.id as string, 10);

  const show = AnimeModel.findOne({ kitsuId: id });

  if (!show) {
    throw new HttpError(404, 'Show does not exist or has not been voted on.');
  }

  const voters = await User.find({ votedFor: id });

  res.send(response(0, trimUsers(voters)));
});
