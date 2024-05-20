<script setup lang="ts">
import type { ListDocument } from '~/server/models/List.model';
import draggableComponent from 'vuedraggable';
import { useList } from '~/composables/useList';

interface Props {
    lists: ListDocument[];
    boardId: string;
};
const props = defineProps<Props>();

const { handleSort } = useList();

</script>

<template>
    <draggableComponent :list="lists" handle=".list-handle" class="flex gap-4 overflow-x-auto h-[84vh] pb-5"
        :scroll-sensitivity="500" :force-fallback="true" drag-class="dragging-board" ghost-class="ghost-board"
        item-key="_id" @sort="handleSort(boardId, lists)">
        <template #item="{ element }">
            <div class="flex">
                <ListItem :list="element" :board-id="boardId" />
            </div>
        </template>
    </draggableComponent>
</template>

<style scoped>
.ghost-board>div {
    @apply opacity-50;
}

.ghost-board>div>div {
    @apply invisible;
}

.dragging-board {
    @apply shadow-2xl transform rotate-2 cursor-grabbing;
}

.sortable-chosen {
    opacity: 1 !important;
}
</style>