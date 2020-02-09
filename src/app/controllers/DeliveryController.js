import { Op } from 'sequelize';
import Deliveryman from '../models/Deliveryman';
import Order from '../models/Order';

class DeliveryController {
  async index(req, res) {
    if (!(await Deliveryman.findByPk(req.params.id))) {
      return res.status(400).json({ error: 'Delivery man does not exist' });
    }

    const orders = await Order.findAll({
      where: { deliveryman_id: req.params.id, canceled_at: null },
    });

    return res.json(orders);
  }

  async deliveries(req, res) {
    return res.json({ ok: 'entregas já realizadas' });
  }

  async canceled(req, res) {
    if (!(await Deliveryman.findByPk(req.params.id))) {
      return res.status(400).json({ error: 'Delivery man does not exist' });
    }

    const orders = await Order.findAll({
      where: { deliveryman_id: req.params.id, canceled_at: { [Op.not]: null } },
    });

    return res.json(orders);
  }
}

export default new DeliveryController();
