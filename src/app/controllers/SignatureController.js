import Signature from '../models/Signature';

class SignatureController {
  async store(req, res) {
    const { originalname: name, filename: path } = req.file;

    const signature = await Signature.create({
      name,
      path,
    });

    return res.json(signature);
  }

  async index(req, res) {
    const signatures = await Signature.findAll();
    return res.json(signatures);
  }
}

export default new SignatureController();
