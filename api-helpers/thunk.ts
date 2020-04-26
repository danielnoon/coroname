import { NowRequest as Request, NowResponse as Response } from '@now/node';
import { HttpError } from './http-error';
import { error } from './models/error';

const t = (fn: (req: Request, res: Response) => Promise<any>) => (
  req: Request,
  res: Response
) =>
  fn(req, res).catch((err: Error) => {
    if (!(err instanceof HttpError)) {
      console.error(err.message);
      console.error(err.stack);
    }
    res.json(error(err.message));
  });

export default t;
