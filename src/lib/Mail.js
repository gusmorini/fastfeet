import nodemailer from 'nodemailer';

import { resolve } from 'path';

import mailcfg from '../config/mail';

class Mail {
  constructor() {
    const { host, port, secure, auth } = mailcfg;

    this.transporter = nodemailer.createTransport({
      host,
      port,
      secure,
      auth: auth.user ? auth : null,
    });

    // this.configureTemplates();
  }

  sendMail(message) {
    return this.transporter.sendMail({
      ...mailcfg.default,
      ...message,
    });
  }
}

export default new Mail();
