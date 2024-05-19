<script setup lang="ts">
import type { FormSubmitEvent } from '@nuxt/ui/dist/runtime/types';
import { z } from 'zod';
import ListSchema from '~/schemas/List.schema';
import type { ListDocument } from '~/server/models/List.model';

interface Props {
    type?: 'Create' | 'Update';
    initialData?: ListDocument;
    boardId: string;
    onCreate?: () => void;
    onUpdate?: () => void;
};

const props = withDefaults(defineProps<Props>(), {
    type: 'Create'
});

const isLoading = ref(false);
const formState = reactive<Partial<ListDocument>>({
    name: undefined,
    board: props.boardId
});


watchEffect(() => {
    if (props.type === 'Update' && props.initialData) {
        formState.name = props.initialData.name;
        formState.board = props.initialData.board;
    }
});

async function handleSubmit(event: FormSubmitEvent<z.output<typeof ListSchema>>) {
    try {
        isLoading.value = true;

        if (props.type === 'Update' && props.initialData?._id) {
            useFetch(`/api/lists/${props.initialData._id}`, {
                method: "PUT",
                body: event.data,
                watch: false
            });
            props.onUpdate?.();


            useToast().add({
                title: `List updated successfully`,
                description: "Your List has been updated!",
                timeout: 3000
            })
            return;
        }
        useFetch("/api/lists", {
            method: "POST",
            body: event.data,
            watch: false
        });
        
        props.onCreate?.();

        useToast().add({
            title: `List created successfully`,
            description: "Your List has been created!",
            timeout: 3000
        })
    } catch (error: any) {
        useToast().add({
            title: "Error",
            description: error.message || "Something went wrong"
        })
    } finally {
        isLoading.value = false;
    }
}

</script>

<template>
    <UForm :state="formState" :schema="ListSchema" @submit="handleSubmit">
        <UFormGroup name="name" class="mb-4" label="Name">
            <UInput v-model="formState.name" />
        </UFormGroup>
        <UButton :loading="isLoading" type="submit" block>
            {{ type === 'Create' ? "Create List" : "Update List" }}
        </UButton>
    </UForm>
</template>

<style scoped></style>