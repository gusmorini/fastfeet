import * as Yup from 'yup';
import Courier from '../models/Courier';
import File from '../models/File';

class CourierController {
  async index(req, res) {
    const couriers = await Courier.findAll({
      attributes: ['id', 'name', 'email'],
      include: [
        {
          model: File,
          as: 'avatar',
          attributes: ['name', 'path', 'url'],
        },
      ],
    });

    return res.json(couriers);
  }

  async store(req, res) {
    const schema = Yup.object().shape({
      name: Yup.string().required(),
      email: Yup.string()
        .email()
        .required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Invalid data' });
    }

    const exists = await Courier.findOne({
      where: { email: req.body.email },
    });

    if (exists) {
      return res.status(400).json({ error: 'Courier already exists.' });
    }

    const { id, name, email } = await Courier.create(req.body);

    return res.json({ id, name, email });
  }

  async update(req, res) {
    res.json({ ok: 'update' });
  }
}

export default new CourierController();
