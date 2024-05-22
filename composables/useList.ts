import type { ListDocument } from "~/server/models/List.model";

export const useList = () => {
  async function handleSort(boardId: string, lists: ListDocument[]) {
    await useFetch(`/api/boards/${boardId}`, {
      method: 'PUT',
      body: {
        lists: lists.flatMap(item => item._id)
      }
    })
  };

  async function destroy(listId: string) {
    try {
      await useFetch(`/api/lists/${listId}`, {
        method: 'DELETE'
      });

      useToast().add({
        title: "List Deleted",
      });

    } catch (error: any) {
      useToast().add({
        title: "Error",
        description: "Something went wrong"
      });
    }
  }

  return {
    handleSort,
    destroy
  };
}
