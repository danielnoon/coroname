import t from 'api-helpers/thunk';
import validate from 'api-helpers/validate';
import { HttpError } from 'api-helpers/http-error';
import { response } from 'api-helpers/models/response';
import { IUser, User } from 'api-helpers/models/user';
import { generateToken } from 'api-helpers/auth';
import { hash, compare } from 'api-helpers/hash';

export default t(async (req, res) => {
    validate(req.body, ["username:string!", "password:string!"]);
  
    const u = req.body as IUser;
    
    const user = await User.findOne({ username: u.username });
  
    if (user === null) {
      throw new HttpError(422, "Incorrect username.");
    }
  
    if (!user.password) {
      user.password = await hash(u.password);
  
      await user.save();
  
      res.send(response(0, { token: generateToken(user) }));
      return;
    }
  
    if (await compare(u.password, user.password)) {
      res.send(response(0, { token: generateToken(user) }));
    } else {
      throw new HttpError(400, "Incorrect password.");
    }
  });