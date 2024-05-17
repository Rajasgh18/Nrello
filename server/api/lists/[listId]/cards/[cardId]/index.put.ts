import { Validator } from '#nuxt-server-utils';
import CardSchema from '~/schemas/Card.schema';

export default defineEventHandler(async (event) => {

  const user = event.context.user;
  const body = readBody(event);
  const cardId = getRouterParam(event, "cardId");
  const listId = getRouterParam(event, "listId");

  Validator.validateSchema(CardSchema.partial(), body);

  const card = await Card.findOneAndUpdate({
    _id: cardId,
    list: listId,
    owner: user._id
  }, {
    $set: body
  });

  if (!card) throw createError({
    statusCode: 404,
    message: 'Card not found'
  });

  return card;

});