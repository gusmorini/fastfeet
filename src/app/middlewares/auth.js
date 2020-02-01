import jwt from 'jsonwebtoken';
import { promisify } from 'util';
import authcfg from '../../config/auth';

export default async (req, res, next) => {
  const auth = req.headers.authorization;

  if (!auth) res.status(401).json({ error: 'Token was not provided' });

  const [, token] = auth.split(' ');

  try {
    const decoded = await promisify(jwt.verify)(token, authcfg.secret);
    req.userId = decoded.id;
    return next();
  } catch (err) {
    return res.status(401).json({ error: 'Token invalid' });
  }
};
