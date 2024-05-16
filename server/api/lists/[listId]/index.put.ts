import { Validator } from "#nuxt-server-utils";
import ListSchema from "~/schemas/List.schema";
import { List } from "~/server/models/List.model";

export default defineEventHandler(async (event) => {

  const user = event.context.user;
  const body = readBody(event);
  const listId = getRouterParam(event, 'listId');

  Validator.validateSchema(ListSchema.partial(), body);

  const updatedList = await List.findOneAndUpdate({
    _id: listId,
    owner: user._id
  }, {
    $set: body
  }, { new: true });

  if (!updatedList) throw createError({
    statusCode: 404,
    message: "List not found"
  });

  return updatedList;
});
