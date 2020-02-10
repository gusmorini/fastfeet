import Bee from 'bee-queue';
import OrderMail from '../app/jobs/OrderMail';

const jobs = [OrderMail];

class Queue {
  constructor() {
    this.queues = {};
    this.init();
  }

  init() {
    jobs.forEach(({ key, handle }) => {
      this.queues[key] = new Bee(key, {
        redis: {},
      });
    });
  }
}

export default new Queue();
