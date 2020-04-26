import t from '../../api-helpers/thunk';
import { response } from '../../api-helpers/models/response';
import { trimUser } from '../../api-helpers/models/user';
import { getUser } from '../../api-helpers/auth';
import { connect } from '../../api-helpers/mongo';

export default t(async (req, res) => {
  connect();

  const token = req.headers['auth-token'] as string;

  const user = await getUser(token);

  res.send(response(0, trimUser(user)));
});
