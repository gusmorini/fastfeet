import { format, parseISO } from 'date-fns';
import br from 'date-fns/locale/pt-BR';

import Mail from '../../lib/Mail';

class CancelMail {
  get key() {
    return 'CancelMail';
  }

  async handle({ data }) {
    const { description: problem_description } = data;
    const { id: order_id, product: order_product, start_date } = data.order;
    const { name: del_name, email: del_email } = data.order.deliveryman;
    const {
      name: rec_name,
      city: rec_city,
      state: rec_state,
    } = data.order.recipient;

    const date = parseISO(start_date);

    const formattedDate = format(date, "dd 'de' MMMM', às' H:mm'h'", {
      locale: br,
    });

    await Mail.sendMail({
      to: `${del_name} <${del_email}>`,
      subject: 'Encomenda Cancelada',
      template: 'cancel',
      context: {
        problem_description,
        order_id,
        order_product,
        del_name,
        rec_name,
        rec_city,
        rec_state,
        formattedDate,
      },
    });
  }
}

export default new CancelMail();
