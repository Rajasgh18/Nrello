export default defineEventHandler(async event => {

    const user = event.context.user;
    const boardId = getRouterParam(event, 'boardId');

    const board = await Board.findOneAndDelete({
        _id: boardId,
        owner: user._id
    });

    if (!board) throw createError({
        statusCode: 404,
        message: 'Board not found'
    });

    await List.deleteMany({
        board: boardId,
        owner: user._id
    });

    event.node.res.statusCode = 204;
    return true;

});