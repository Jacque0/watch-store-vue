/*
 * Mirage JS guide on Factories: https://miragejs.com/docs/data-layer/factories
 */
import { Factory } from 'miragejs';

/*
 * Faker Github repository: https://github.com/Marak/Faker.js#readme
 */
import { faker } from '@faker-js/faker';
import { randomNumber } from './utils';

export default {
  user: Factory.extend({
    name() {
      return faker.helpers.fake('{{name.findName}}');
    },
    mobile() {
      return faker.helpers.fake('{{phone.phoneNumber}}');
    },
    afterCreate(user, server) {
      const messages = server.createList('message', randomNumber(10), { user });

      user.update({ messages });
    },
  }),
};
