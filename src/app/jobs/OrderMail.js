import { format } from 'date-fns';
import br from 'date-fns/locale/pt-BR';

import Mail from '../../lib/Mail';

class OrderMail {
  get key() {
    return 'OrderMail';
  }

  async handle({ data }) {
    const { name, email, product } = data;

    await Mail.sendMail({
      to: `${name} <${email}>`,
      subject: 'Nova Encomenda',
      template: 'order',
      context: {
        deliveryman: name,
        product,
      },
    });
  }
}

export default new OrderMail();
