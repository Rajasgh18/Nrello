<script setup lang="ts">
import type { BoardDocument } from '~/server/models/Board.model';
import type { ListDocument } from '~/server/models/List.model';

const { boardId } = useRoute().params;

const { data, refresh } = useFetch<BoardDocument>(`/api/boards/${boardId}`);

const selectedList = ref<ListDocument | undefined>();
const showListCreate = ref(false);

provide('board-refresh', refresh);

</script>

<template>
    <WrapperDefault v-if="data" class="h-screen" :style="{
        backgroundImage: `url(${data.coverImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center'
    }">
        <template #actions>
            <UButton @click="showListCreate = true" size="xs">Create List</UButton>
        </template>

        <h1 class="font-bold text-2xl m-4 inline-block">{{ data.name }}</h1>

        <ListContainer :lists="data.lists" :board-id="boardId.toString()" />

        <USlideover v-model="showListCreate">
            <OverlayHeader :title="selectedList ? 'Update list' : 'Create a list'"
                :on-click="() => showListCreate = false" />
            <div class="p-4">
                <FormList :type="selectedList ? 'Update' : 'Create'" :board-id="(boardId.toString())"
                    :initial-data="selectedList" :on-create="() => {
                        refresh();
                        showListCreate = false;
                    }" :on-update="() => {
                        refresh();
                        showListCreate = false;
                        selectedList = undefined;
                    }" />
            </div>
        </USlideover>
    </WrapperDefault>
</template>

<style scoped></style>