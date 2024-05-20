<script setup lang="ts">
import type { CardDocument } from "~/server/models/Card.model";

interface Props {
    card: CardDocument;
};

defineProps<Props>();

</script>

<template>
    <div class="p-2 border shadow rounded-lg dark:border-gray-600 bg-white dark:bg-gray-700 focus:cursor-grab">
        {{ card.title }}
    </div>
</template>

<style scoped></style>