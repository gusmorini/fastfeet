import jwt from 'jsonwebtoken';
import * as Yup from 'yup';

import User from '../models/User';

import authcfg from '../../config/auth';

class AuthenticationController {
  async store(req, res) {
    const schema = Yup.object().shape({
      email: Yup.string()
        .email()
        .required(),
      password: Yup.string().required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Invalid data' });
    }

    const { email, password } = req.body;

    const user = await User.findOne({ where: { email } });

    if (!user) res.status(401).json({ error: 'User not found' });

    if (!(await user.checkPass(password)))
      res.status(401).json({ error: 'Password does not match' });

    const { id, name } = user;

    return res.json({
      user: {
        id,
        name,
        email,
      },
      token: jwt.sign({ id }, authcfg.secret, {
        expiresIn: authcfg.expiresIn,
      }),
    });
  }
}

export default new AuthenticationController();
