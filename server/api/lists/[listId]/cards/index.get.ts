import { ListDocument } from "~/server/models/List.model";

export default defineEventHandler(async (event) => {

  const user = event.context.user;
  const listId = getRouterParam(event, 'listId');

  const list = await List.findOne({
    _id: listId,
    owner: user._id
  }).populate({
    path: 'cards',
    model: Card
  });

  if (!list) throw createError({
    statusCode: 404,
    message: "List not found"
  });

  return list.cards;

});
