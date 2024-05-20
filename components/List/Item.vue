<script setup lang="ts">
import type { CardDocument } from "~/server/models/Card.model";
import type { ListDocument } from "~/server/models/List.model";
import vuedraggable from "vuedraggable";

interface Props {
  list: ListDocument;
  boardId: string;
}

const props = defineProps<Props>();
const boardRefresh = inject("board-refresh") as () => void;

const { destroy } = useList();

const listActions = ref([
  [
    {
      label: "Add Card",
      icon: "i-heroicons-plus-circle",
      click: () => (showCardCreate.value = true),
    },
  ],
  [
    {
      label: "Delete",
      icon: "i-heroicons-trash",
      click: () => {
        destroy(props.list._id);
        boardRefresh();
      },
    },
  ],
]);

const { data, refresh } = useFetch<CardDocument[]>(
  `/api/lists/${props.list._id}/cards`
);

const showCardCreate = ref<boolean>(false);
const selectedCard = ref<CardDocument | undefined>();
</script>
<template>
  <div
    class="w-72 shadow flex-none bg-white dark:bg-gray-800 rounded-lg flex flex-col"
  >
    <!-- List Header -->
    <div
      class="list-handle p-2 border-b dark:border-gray-600 flex items-center justify-between"
    >
      <h3 class="font-bold">{{ list.name }}</h3>
      <UDropdown :items="listActions">
        <UIcon name="i-heroicons-cog-6-tooth" class="w-5 h-5" />
      </UDropdown>
    </div>
    <!-- ./ List Header -->

    <!-- List Body -->
    <div class="list-body p-2 flex-1 overflow-y-hidden">
      <vuedraggable
        v-if="data"
        :list="data"
        item-key="_id"
        group="list"
        ghost-class="card-ghost"
        :scroll-sensitivity="500"
        :force-draggable="true"
        class="p-1 space-y-2 flex-1 overflow-y-hidden"
      >
        <template #item="{ element }">
          <ListCard
            :card="element"
            @click="
              () => {
                selectedCard = element;
                showCardCreate = true;
              }
            "
          />
        </template>
      </vuedraggable>
    </div>
    <!-- ./ List Body -->

    <!-- List Footer -->
    <div class="p-1.5 border-t dark:border-gray-600 flex items-center">
      <UButton @click="showCardCreate = true" block>Add Card</UButton>
    </div>
    <!-- ./ List Footer -->

    <Teleport to="body">
      <UModal v-model="showCardCreate">
        <div class="p-2">
          <OverlayHeader
            :title="selectedCard ? 'Update Card' : 'Create Card'"
            :on-click="
              () => {
                showCardCreate = false;
              }
            "
          />
          <div class="p-2">
            <FormCard
              :type="selectedCard ? 'Update' : 'Create'"
              :list-id="props.list._id"
              :initial-data="selectedCard"
              :on-create="
                () => {
                  showCardCreate = false;
                  refresh();
                }
              "
              :on-update="
                () => {
                  showCardCreate = false;
                  selectedCard = undefined;
                  refresh();
                }
              "
            />
          </div>
        </div>
      </UModal>
    </Teleport>
  </div>
</template>

<style scoped>
.card-ghost {
  @apply bg-gray-100 dark:bg-gray-700 rounded-lg;
}

.card-ghost > div {
  @apply invisible;
}
</style>
