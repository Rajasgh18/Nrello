<script setup lang="ts">
import type { BoardDocument } from "~/server/models/Board.model";

interface Props {
    board: BoardDocument;
    onEdit?: (board: BoardDocument) => void;
}

const props = defineProps<Props>();
const refreshBoards = inject("refresh-boards") as () => void;

function destroy() {
    try {
        useFetch(`/api/boards/${props.board._id}`, {
            method: 'DELETE',
        });
        useToast().add({
            title: "Board deleted successfully"
        });
        
        refreshBoards();

    } catch (error: any) {
        useToast().add({
            title: "Error",
            description: error.message || "Something went wrong"
        });
    }
}

const actions = ref([
    [
        {
            label: "Edit",
            icon: "i-heroicons-pencil",
            click: () => {
                props.onEdit?.(props.board);
            },
        },
    ],
    [
        {
            label: "Delete",
            icon: "i-heroicons-trash",
            click: destroy,
        },
    ],
]);
</script>

<template>
    <div class="shadow dark:bg-gray-800 rounded-lg overflow-hidden relative">
        <div v-if="board.coverImage" class="h-36 w-full relative z-[1]">
            <NuxtImg :src="board.coverImage" :alt="board.name" class="h-full w-full absolute object-cover z-[1]" />
            <div class="absolute w-full h-10 z-[2] backdrop-blur-lg">
            </div>
        </div>
        <div class="flex justify-between w-full absolute top-0 z-[3] h-10 items-center p-2 px-3">
            <NuxtLink class="link" :to="{ name: 'boardId', params: { boardId: board._id } }">{{ board.name }}</NuxtLink>
            <UDropdown :items="actions">
                <UIcon name="i-heroicons-cog-6-tooth" class="link w-6 h-6"></UIcon>
            </UDropdown>
        </div>
    </div>
</template>

<style scoped>
.link {
    @apply dark:text-white text-slate-700 font-bold truncate;
}
</style>
