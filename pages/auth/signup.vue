<script setup lang="ts">
import type { FormSubmitEvent } from "@nuxt/ui/dist/runtime/types";
import { z } from "zod";
import SignupSchema from "~/schemas/Signup.schema";

const isLoading = ref(false);
const formState = reactive({
    name: undefined,
    email: undefined,
    password: undefined,
    confirmPassword: undefined
});

async function submitForm(event: FormSubmitEvent<z.output<typeof SignupSchema>>) {
    try {
        isLoading.value = true;
        await useFetch("/api/auth/signup", {
            method: "POST",
            body: event.data,
            watch: false
        });

        useToast().add({
            title: "Account created!",
            description: "Your accound has been created successfully, Redirecting you to the sign in page.",
            timeout: 2000
        });

        useRouter().push({ path: "/auth/signin" });
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
    <WrapperAuth title="Create a free account">
        <UCard>
            <UForm :state="formState" :schema="SignupSchema" @submit="submitForm">
                <UFormGroup class="mb-4" name="name" label="Name">
                    <UInput v-model="formState.name" type="text" />
                </UFormGroup>
                <UFormGroup class="mb-4" name="email" label="Email">
                    <UInput v-model="formState.email" type="email" />
                </UFormGroup>
                <UFormGroup class="mb-4" name="password" label="Password">
                    <UInput v-model="formState.password" type="password" />
                </UFormGroup>
                <UFormGroup class="mb-4" name="confirmPassword" label="Confirm Password">
                    <UInput v-model="formState.confirmPassword" type="password" />
                </UFormGroup>
                <UButton :loading="isLoading" type="submit" block>Create account</UButton>
            </UForm>
        </UCard>
    </WrapperAuth>
</template>

<style scoped></style>