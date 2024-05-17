import { Validator } from '#nuxt-server-utils';
import CardSchema from '~/schemas/Card.schema';

export default defineEventHandler(async (event) => {

  const body = await readBody(event);
  const user = event.context.user;
  const listId = getRouterParam(event, 'listId');
  console.log(body)
  Validator.validateSchema(CardSchema, body);

  const card = await Card.create({
    ...body,
    list: listId,
    owner: user._id
  });

  await List.findOneAndUpdate({
    _id: listId,
    owner: user._id
  }, {
    $push: {
      cards: card._id
    }
  });

  return card;

});