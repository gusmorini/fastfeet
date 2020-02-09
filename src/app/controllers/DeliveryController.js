import { Op } from 'sequelize';
import Deliveryman from '../models/Deliveryman';
import Order from '../models/Order';

class DeliveryController {
  async index(req, res) {
    if (!(await Deliveryman.findByPk(req.params.id))) {
      return res.status(400).json({ error: 'Delivery does not exist' });
    }

    const orders = await Order.findAll({
      where: {
        deliveryman_id: req.params.id,
        canceled_at: null,
        end_date: null,
      },
    });

    return res.json(orders);
  }

  async deliveries(req, res) {
    return res.json({ ok: 'entregas já realizadas' });
  }

  async canceled(req, res) {
    if (!(await Deliveryman.findByPk(req.params.id))) {
      return res.status(400).json({ error: 'Delivery does not exist' });
    }

    const orders = await Order.findAll({
      where: { deliveryman_id: req.params.id, canceled_at: { [Op.not]: null } },
    });

    return res.json(orders);
  }

  async withdraw(req, res) {
    const { id, withId } = req.params;

    if (!(await Deliveryman.findByPk(id))) {
      return res.status(400).json({ error: 'Delivery does not exist' });
    }

    const order = await Order.findByPk(withId);

    if (!order) {
      return res.status(400).json({ error: 'Order does not exist' });
    }

    if (
      order.canceled_at !== null ||
      order.start_date !== null ||
      order.end_date !== null
    ) {
      return res.status(400).json({ error: 'Order cannot be withdrawn' });
    }

    order.start_date = new Date();
    order.save();

    return res.json(order);
  }

  async receive(req, res) {
    return res.json('receive');
  }
}

export default new DeliveryController();
