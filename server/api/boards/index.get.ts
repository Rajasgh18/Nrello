export default defineEventHandler(async (event) => {
  const user = event.context.user;

  const board = await Board.find({ owner: user._id });
  return board;
})
