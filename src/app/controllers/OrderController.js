import * as Yup from 'yup';
import Order from '../models/Order';
import Recipient from '../models/Recipient';
import Deliveryman from '../models/Deliveryman';
import File from '../models/File';
import Signature from '../models/Signature';

class OrderController {
  async index(req, res) {
    const orders = await Order.findAll({
      attributes: ['id', 'product', 'canceled_at', 'start_date', 'end_date'],
      include: [
        {
          model: Recipient,
          as: 'recipient',
          attributes: ['id', 'name'],
        },
        {
          model: Deliveryman,
          as: 'deliveryman',
          attributes: ['id', 'name', 'email'],
          include: [
            {
              model: File,
              as: 'avatar',
              attributes: ['id', 'path', 'url'],
            },
          ],
        },
        {
          model: Signature,
          as: 'signature',
        },
      ],
    });
    return res.json(orders);
  }

  async store(req, res) {
    const schema = Yup.object().shape({
      product: Yup.string().required(),
      recipient_id: Yup.number().required(),
      deliveryman_id: Yup.number().required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Invalid data' });
    }

    const recipientExist = await Recipient.findByPk(req.body.recipient_id);
    if (!recipientExist)
      return res.status(400).json({ error: 'Recipient does not exist' });

    const deliverymanExists = await Deliveryman.findByPk(
      req.body.deliveryman_id
    );
    if (!deliverymanExists)
      return res.status(400).json({ error: 'Delivery man does not exist' });

    const order = await Order.create(req.body);

    return res.json(order);
  }

  async update(req, res) {
    const schema = Yup.object().shape({
      product: Yup.string(),
      recipient_id: Yup.number(),
      deliveryman_id: Yup.number(),
      canceled_at: Yup.date(),
      start_date: Yup.date(),
      end_date: Yup.date(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Invalid data' });
    }

    const { id } = req.params;
    const order = await Order.findByPk(id);

    const { recipient_id, deliveryman_id } = req.body;

    if (recipient_id && recipient_id !== order.recipient_id) {
      const recipientExist = await Recipient.findByPk(recipient_id);
      if (!recipientExist)
        return res.status(400).json({ error: 'Recipient does not exist' });
    }

    if (deliveryman_id && deliveryman_id !== order.deliveryman_id) {
      const deliverymanExists = await Deliveryman.findByPk(deliveryman_id);
      if (!deliverymanExists)
        return res.status(400).json({ error: 'Delivery man does not exist' });
    }

    const update = await order.update(req.body);

    return res.json(update);
  }
}

export default new OrderController();
