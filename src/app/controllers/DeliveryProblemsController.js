import { Op } from 'sequelize';
import DeliveryProblems from '../models/DeliveryProblems';
import Order from '../models/Order';
import Recipient from '../models/Recipient';
import Deliveryman from '../models/Deliveryman';

class DeliveryProblemsController {
  async index(req, res) {
    const problems = await DeliveryProblems.findAll({
      attributes: ['id', 'description'],
      include: {
        model: Order,
        as: 'order',
        attributes: ['id', 'product'],
        include: [
          {
            model: Deliveryman,
            as: 'deliveryman',
            attributes: ['id', 'name', 'email'],
          },
          {
            model: Recipient,
            as: 'recipient',
            attributes: ['id', 'name'],
          },
        ],
      },
    });
    return res.json(problems);
  }

  async list(req, res) {
    const { id } = req.params;

    const problems = await DeliveryProblems.findByPk(id, {
      attributes: ['id', 'description'],
      include: {
        model: Order,
        as: 'order',
        attributes: ['id', 'product'],
        include: {
          model: Recipient,
          as: 'recipient',
          attributes: ['id', 'name'],
        },
      },
    });

    return res.json(problems);
  }

  async store(req, res) {
    const { id } = req.params;
    const { description, deliveryman_id } = req.body;

    /*
      verifica:
      se existe a encomenda
      se a ecomenda pertence ao entregador
      se a encomenda já foi retirada pelo entregador
      se a encomenda não foi cancelada
      se a encomenda não foi entrege
    */

    if (
      !(await Order.findOne({
        where: {
          id,
          deliveryman_id,
          start_date: { [Op.not]: null },
          end_date: null,
          canceled_at: null,
        },
      }))
    ) {
      return res.status(400).json({ error: 'problem cannot be registered' });
    }

    const problem = await DeliveryProblems.create({
      delivery_id: id,
      description,
    });

    return res.json(problem);
  }

  async delete(req, res) {
    const { id } = req.params;

    const problem = await DeliveryProblems.findByPk(id);

    if (!problem) {
      return res.status(401).json({ error: 'problem id not found' });
    }

    const order = await Order.findByPk(problem.delivery_id);

    if (!order) {
      return res.status(400).json({ error: 'order id not found' });
    }

    order.canceled_at = new Date();

    await order.save();

    await problem.destroy();

    return res.json(problem);
  }
}

export default new DeliveryProblemsController();
