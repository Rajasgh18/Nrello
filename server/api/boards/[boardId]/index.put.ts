import { Validator } from '#nuxt-server-utils';
import BoardSchema from '~/schemas/Board.schema';

export default defineEventHandler(async (event) => {

  const body = await readBody(event);
  console.log(body)
  const data = Validator.validateSchema(BoardSchema, body);

  const boardId = getRouterParam(event, 'boardId');

  const board = Board.findOneAndUpdate({ _id: boardId, owner: "663e2490729cb600968b17cc" }, { $set: body });
  return board;
})
