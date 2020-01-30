import jwt from 'jsonwebtoken';
import * as Yup from 'yup';

import User from '../models/User';

class AuthenticationController {
  async store(req, res) {
    const { email, pass } = req.body;

    return res.json({ email, pass });
  }
}

export default new AuthenticationController();
