import Courier from '../models/Courier';

class CourierController {
  async store(req, res) {
    return res.json({ ok: 'courier' });
  }
}

export default new CourierController();
