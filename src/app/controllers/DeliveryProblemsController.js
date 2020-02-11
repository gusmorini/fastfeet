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
}

export default new DeliveryProblemsController();
