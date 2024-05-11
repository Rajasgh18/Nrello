import { Validator } from '#nuxt-server-utils';
import BoardSchema from '~/schemas/Board.schema';

export default defineEventHandler(async (event) => {
  const user = event.context.user;
  const body = await readBody(event);

  Validator.validateSchema(BoardSchema, body);

  const board = await Board.create({ ...body, owner: user._id });
  return board;
})
