<script setup lang="ts">
import type { FormSubmitEvent } from "@nuxt/ui/dist/runtime/types";
import { z } from "zod";
import CardSchema from "~/schemas/Card.schema";
import type { CardDocument } from "~/server/models/Card.model";

interface Props {
  type?: "Create" | "Update";
  initialData?: CardDocument;
  listId: string;
  onCreate?: () => void;
  onUpdate?: () => void;
}

const props = withDefaults(defineProps<Props>(), {
  type: "Create",
});

const formState = reactive<Partial<CardDocument>>({
  title: undefined,
  description: undefined,
  list: props.listId,
});

watchEffect(() => {
  if (props.type === "Update" && props.initialData) {
    formState.title = props.initialData.title;
    formState.description = props.initialData.description;
  }
});

const QuillEditor = ref<any>(null);
onMounted(async () => {
  if (process.client) {
    const { QuillEditor: Editor } = await import("@vueup/vue-quill");
    await import("@vueup/vue-quill/dist/vue-quill.snow.css");
    QuillEditor.value = Editor;
  }
});

function handleSubmit(e: FormSubmitEvent<z.output<typeof CardSchema>>) {
  try {
    console.log(e.data);
    if (props.type === "Update" && props.initialData) {
      useFetch(`/api/lists/${props.listId}/cards/${props.initialData._id}`, {
        method: "PUT",
        body: JSON.stringify(e.data),
        watch: false,
      });

      useToast().add({
        title: "Card Created Successfully",
      });

      props.onUpdate?.();
      return;
    }

    useFetch(`/api/lists/${props.listId}/cards`, {
      method: "POST",
      body: JSON.stringify(e.data),
      watch: false,
    });

    useToast().add({
      title: "Card Created Successfully",
    });
    props.onCreate?.();
  } catch (error: any) {
    useToast().add({
      title: "Card Created Successfully",
      description: error.message || "Something went wrong",
    });
  }
}
</script>

<template>
  <UForm :state="formState" :schema="CardSchema" @submit="handleSubmit">
    <UFormGroup name="title" class="mb-4" label="Title">
      <UInput v-model="formState.title" />
    </UFormGroup>
    <UFormGroup name="description" class="mb-4" label="Description">
      <ClientOnly>
        <component
          :is="QuillEditor"
          v-model:content="formState.description"
          content-type="html"
          toolbar="minimal"
        />
      </ClientOnly>
    </UFormGroup>
    <UButton type="submit" class="w-full" block
      >{{ props.type === "Create" ? "Create Card" : "Update Card" }}
    </UButton>
  </UForm>
</template>

<style scoped></style>
