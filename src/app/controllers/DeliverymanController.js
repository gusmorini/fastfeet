import * as Yup from 'yup';
import Deliveryman from '../models/Deliveryman';
import File from '../models/File';

class DeliverymanController {
  async index(req, res) {
    const deliveryman = await Deliveryman.findAll({
      attributes: ['id', 'name', 'email'],
      include: [
        {
          model: File,
          as: 'avatar',
          attributes: ['name', 'path', 'url'],
        },
      ],
    });

    return res.json(deliveryman);
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

    const exists = await Deliveryman.findOne({
      where: { email: req.body.email },
    });

    if (exists) {
      return res.status(400).json({ error: 'Courier already exists.' });
    }

    const { id, name, email } = await Deliveryman.create(req.body);

    return res.json({ id, name, email });
  }

  async update(req, res) {
    const schema = Yup.object().shape({
      name: Yup.string(),
      email: Yup.string().email(),
      avatar_id: Yup.number(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Invalid data' });
    }

    const deliveryman = await Deliveryman.findByPk(req.params.id);

    if (req.body.email && req.body.email !== deliveryman.email) {
      const { email } = req.body;
      const exists = await Deliveryman.findOne({ where: { email } });
      if (exists) {
        return res.status(400).json({ error: 'Courier already registered' });
      }
    }

    const { id, name, email } = await deliveryman.update(req.body);

    return res.json({ id, name, email });
  }

  async delete(req, res) {
    const exists = await Deliveryman.destroy({ where: { id: req.params.id } });
    if (!exists) {
      return res.status(400).json({ error: 'Deliveryman id does not exist' });
    }
    return res.json();
  }
}

export default new DeliverymanController();
