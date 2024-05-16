export default defineEventHandler(async event => {

    const user = event.context.user;
    const listId = getRouterParam(event, 'listId');

    const list = await List.findOneAndDelete({
        _id: listId,
        owner: user._id
    });

    if (!list) throw createError({
        statusCode: 404,
        message: 'List not found'
    });

    await Board.findOneAndUpdate({
        _id: list.board,
        owner: user._id
    }, {
        $pull: {
            lists: list._id
        }
    });

    await Card.deleteMany({
        list: listId,
        owner: user._id
    });

    event.node.res.statusCode = 204;
    return true;
});