<script setup lang="ts">
import type { BoardDocument } from '~/server/models/Board.model';

definePageMeta({
    middleware: 'auth'
})

const { data, refresh } = useFetch<BoardDocument[]>("/api/boards");

const showCreateBoard = ref(false);
const selectedBoard = ref<BoardDocument | undefined>();

watchEffect(() => {
    if (!showCreateBoard.value)
        selectedBoard.value = undefined;
})

provide('refresh-boards', refresh);

</script>

<template>
    <WrapperDefault>
        <template #actions>
            <UButton size="xs" @click="showCreateBoard = true; selectedBoard = undefined">Create Board</UButton>
        </template>
        <div class="mt-4 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            <BoardCard v-for="board in data" :key="board._id" :board="board" :on-edit="() => {
                selectedBoard = board;
                showCreateBoard = true;
            }" />
        </div>
        <USlideover v-model="showCreateBoard">
            <OverlayHeader :title="selectedBoard ? 'Update a Board' : 'Create a Board'"
                :on-click="() => showCreateBoard = false" />
            <div class="p-4">
                <FormBoard :initial-data="selectedBoard" :type="selectedBoard ? 'Update' : 'Create'" :on-create="() => {
                    showCreateBoard = false;
                    refresh();
                }" :on-update="() => {
                    showCreateBoard = false;
                    selectedBoard = undefined;
                    refresh();
                }" />
            </div>
        </USlideover>
    </WrapperDefault>
</template>

<style scoped></style>