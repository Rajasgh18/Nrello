export default defineEventHandler(async (event) => {

  const user = event.context.user;
  const listId = getRouterParam(event, 'listId');
  const cardId = getRouterParam(event, 'cardId');

  const card = await Card.findOneAndDelete({
    _id: cardId,
    list: listId,
    owner: user._id
  });

  if (!card) throw createError({
    status: 404,
    message: 'Card not found'
  });

  await List.findOneAndUpdate({
    _id: listId,
    owner: user._id
  }, {
    $pull: {
      cards: cardId
    }
  });

  event.node.res.statusCode = 204;
  return true;

});
