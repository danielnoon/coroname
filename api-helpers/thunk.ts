import { NowRequest as Request, NowResponse as Response } from '@now/node';
import { HttpError } from './http-error';
import { error } from 'src/models/api/error';

const t = (fn: (req: Request, res: Response) => Promise<any>) => (
  req: Request,
  res: Response
) =>
  fn(req, res).catch((err: Error) => {
    res.json(error(err.message));
  });

export default t;
