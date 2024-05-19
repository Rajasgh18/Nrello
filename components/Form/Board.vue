<script setup lang="ts">
import type { FormSubmitEvent } from '@nuxt/ui/dist/runtime/types';
import { z } from 'zod';
import BoardSchema from '~/schemas/Board.schema';
import type { BoardDocument } from '~/server/models/Board.model';

interface Props {
    type?: 'Create' | 'Update';
    initialData?: BoardDocument;
    onCreate?: () => void;
    onUpdate?: () => void;
};

const isLoading = ref(false);
const formState = reactive<Partial<BoardDocument>>({
    name: undefined,
    coverImage: undefined
});

const props = withDefaults(defineProps<Props>(), {
    type: 'Create'
});

watchEffect(() => {
    if (props.type === 'Update' && props.initialData) {
        formState.name = props.initialData.name;
        formState.coverImage = props.initialData.coverImage;
    }
});

async function handleSubmit(event: FormSubmitEvent<z.output<typeof BoardSchema>>) {
    try {
        isLoading.value = true;

        if (props.type === 'Update' && props.initialData?._id) {
            useFetch(`/api/boards/${props.initialData._id}`, {
                method: "PUT",
                body: event.data,
                watch: false
            });
            props.onUpdate?.();


            useToast().add({
                title: `Board updated successfully`,
                description: "Your Board has been updated!",
                timeout: 3000
            })
            return;
        }
        useFetch("/api/boards", {
            method: "POST",
            body: event.data,
            watch: false
        });
        props.onCreate?.();

        useToast().add({
            title: `Board created successfully`,
            description: "Your Board has been created!",
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
    <UForm :state="formState" :schema="BoardSchema" @submit="handleSubmit">
        <UFormGroup name="name" class="mb-4" label="Name">
            <UInput v-model="formState.name" />
        </UFormGroup>
        <UFormGroup name="imagePicker" class="mb-4" label="Image Picker">
            <ImagePicker v-model="formState.coverImage"/>
        </UFormGroup>
        <UButton :loading="isLoading" type="submit" block>
            {{ type === 'Create' ? "Create Board" : "Update Board" }}
        </UButton>
    </UForm>
</template>

<style scoped></style>