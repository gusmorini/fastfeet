import * as Yup from 'yup';
import { Op } from 'sequelize';
import DeliveryProblems from '../models/DeliveryProblems';
import Order from '../models/Order';
import Recipient from '../models/Recipient';
import Deliveryman from '../models/Deliveryman';

// enviar o email para fila
import CancelMail from '../jobs/CancelMail';
import Queue from '../../lib/Queue';

class DeliveryProblemsController {
  async index(req, res) {
    const problems = await Order.findAll({
      attributes: ['id', 'product'],
      where: { canceled_at: null },
      include: [
        {
          model: Deliveryman,
          as: 'deliveryman',
          attributes: ['id', 'name', 'email'],
        },
        {
          model: DeliveryProblems,
          as: 'problems',
          attributes: ['id', 'description'],
        },
      ],
    });

    const filtro = problems.filter(prob => prob.problems.length > 0);

    return res.json(filtro);
  }

  async list(req, res) {
    const { id } = req.params; // id da encomenda
    const problems = await Order.findByPk(id, {
      where: { canceled_at: null, end_date: null },
      attributes: ['id', 'product'],
      include: [
        {
          model: Recipient,
          as: 'recipient',
          attributes: ['id', 'name', 'city', 'state'],
        },
        {
          model: DeliveryProblems,
          as: 'problems',
          attributes: ['id', 'description'],
        },
      ],
    });

    return res.json(problems);
  }

  async store(req, res) {
    const schema = Yup.object().shape({
      description: Yup.string().required(),
      deliveryman_id: Yup.number().required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Invalid data' });
    }

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

    const order = await Order.findOne({
      where: {
        id,
        deliveryman_id,
        start_date: { [Op.not]: null },
        end_date: null,
        canceled_at: null,
      },
    });

    if (!order) {
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

    const problem = await DeliveryProblems.findByPk(id, {
      attributes: ['id', 'description'],
      include: {
        model: Order,
        as: 'order',
        attributes: ['id', 'product', 'start_date'],
        include: [
          {
            model: Deliveryman,
            as: 'deliveryman',
            attributes: ['id', 'name', 'email'],
          },
          {
            model: Recipient,
            as: 'recipient',
            attributes: ['id', 'name', 'city', 'state'],
          },
        ],
      },
    });

    if (!problem) {
      return res.status(401).json({ error: 'problem id not found' });
    }

    const order = await Order.findByPk(problem.order.id);

    if (!order) {
      return res.status(400).json({ error: 'order id not found' });
    }

    order.canceled_at = new Date();

    await order.save();

    await Queue.add(CancelMail.key, problem);

    /*
    Deleta todos os problemas relacionados a uma entrega
  */
    await DeliveryProblems.destroy({
      where: { delivery_id: problem.order.id },
    });

    return res.json();
  }
}

export default new DeliveryProblemsController();
