<script setup lang="ts">

interface Props {
    title: string;
    onClick: () => void;
}

defineProps<Props>();

</script>

<template>
    <div class="py-2 px-4 flex justify-between items-center border-b dark:border-gray-800">
        <h3 class="font-semibold">{{ title }}</h3>
        <UButton color="gray" variant="ghost" icon="i-heroicons-x-mark-20-solid" @click="onClick" />
    </div>
</template>

<style scoped></style>