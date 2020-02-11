import { Op } from 'sequelize';
import {
  setHours,
  setMinutes,
  setSeconds,
  isAfter,
  isBefore,
  min,
  max,
  startOfDay,
  endOfDay,
  format,
  isEqual,
} from 'date-fns';

import Deliveryman from '../models/Deliveryman';
import Order from '../models/Order';
import Signature from '../models/Signature';
import Recipient from '../models/Recipient';

import Schedule from '../models/Schedule';

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
      attributes: ['id', 'product', 'start_date'],
      include: [
        {
          model: Recipient,
          as: 'recipient',
          attributes: [
            'id',
            'name',
            'street',
            'number',
            'complement',
            'state',
            'city',
            'zip_code',
          ],
        },
      ],
    });

    return res.json(orders);
  }

  async deliveries(req, res) {
    const { id } = req.params;

    if (!(await Deliveryman.findByPk(id))) {
      return res.status(400).json({ error: 'Delivery man does not exist' });
    }

    const orders = await Order.findAll({
      where: {
        deliveryman_id: id,
        canceled_at: null,
        end_date: { [Op.not]: null },
      },
      attributes: ['id', 'product', 'end_date'],
      include: [
        {
          model: Recipient,
          as: 'recipient',
          attributes: ['id', 'name'],
        },
        {
          model: Signature,
          as: 'signature',
          attributes: ['id', 'path', 'url'],
        },
      ],
    });

    return res.json(orders);
  }

  async active(req, res) {
    const { id } = req.params;

    if (!(await Deliveryman.findByPk(id))) {
      return res.status(400).json({ error: 'Delivery man does not exist' });
    }

    const orders = await Order.findAll({
      where: {
        deliveryman_id: id,
        canceled_at: null,
        start_date: { [Op.not]: null },
        end_date: null,
      },
      attributes: ['id', 'product', 'start_date'],
      include: [
        {
          model: Recipient,
          as: 'recipient',
          attributes: [
            'id',
            'name',
            'street',
            'number',
            'complement',
            'state',
            'city',
            'zip_code',
          ],
        },
      ],
    });

    return res.json(orders);
  }

  async canceled(req, res) {
    if (!(await Deliveryman.findByPk(req.params.id))) {
      return res.status(400).json({ error: 'Delivery does not exist' });
    }

    const orders = await Order.findAll({
      where: {
        deliveryman_id: req.params.id,
        canceled_at: { [Op.not]: null },
      },
      attributes: ['id', 'product', 'canceled_at'],
      include: [
        {
          model: Recipient,
          as: 'recipient',
          attributes: ['id', 'name'],
        },
      ],
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

    // verifica se o horário de retirada está válido
    const searchDate = new Date();
    const result = [];

    const schedules = await Schedule.findAll();

    schedules.map(({ schedule }) => {
      const [hour, minute] = schedule.split(':');
      const value = setSeconds(
        setMinutes(setHours(searchDate, hour), minute),
        0
      );
      result.push(value);
    });

    const minDate = min(result);
    const maxDate = max(result);

    if (isBefore(searchDate, minDate) || isAfter(searchDate, maxDate)) {
      return res
        .status(400)
        .json({ error: 'it is not possible to make withdrawals after hours' });
    }

    // o entregador só pode fazer 5 retiradas por dia
    const { count } = await Order.findAndCountAll({
      where: {
        deliveryman_id: id,
        start_date: {
          [Op.between]: [startOfDay(searchDate), endOfDay(searchDate)],
        },
      },
    });

    console.log(count);

    if (count && count >= 5) {
      return res
        .status(400)
        .json({ error: 'exceeded the daily withdrawal limit' });
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
    const { id, receiveId } = req.params;

    if (!(await Deliveryman.findByPk(id))) {
      return res.status(400).json({ error: 'Delivery does not exist' });
    }

    const order = await Order.findByPk(receiveId);

    if (!order) {
      return res.status(400).json({ error: 'Order does not exist' });
    }

    if (
      order.canceled_at !== null ||
      order.start_date === null ||
      order.end_date !== null
    ) {
      return res.status(400).json({ error: 'Order cannot be receive' });
    }

    const { originalname: name, filename: path } = req.file;

    const signature = await Signature.create({
      name,
      path,
    });

    order.end_date = new Date();
    order.signature_id = signature.id;
    await order.save();

    return res.json(order);
  }
}

export default new DeliveryController();
