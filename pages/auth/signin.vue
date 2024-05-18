<script setup lang="ts">
import SigninSchema from "~/schemas/Signin.schema";
import type { FormSubmitEvent } from "@nuxt/ui/dist/runtime/types";
import type { z } from "zod";

const formState = reactive({
    email: undefined,
    password: undefined,
});
const isLoading = ref(false);

const { signIn } = useAuth();

async function submitForm(
    event: FormSubmitEvent<z.output<typeof SigninSchema>>
) {
    try {
        isLoading.value = true;
        const res = await signIn("credentials", {
            email: event.data.email,
            password: event.data.password,
            redirect: false,
        });

        // @ts-expect-error
        if (!res.error) {
            useRouter().push("/");
        }
    } catch (error) {
    } finally {
        isLoading.value = false;
    }
}
</script>

<template>
    <WrapperAuth title="Log in to your account">
        <UCard class="mt-8">
            <UForm :state="formState" :schema="SigninSchema" @submit="submitForm">
                <UFormGroup class="mb-4" name="email" label="Email">
                    <UInput v-model="formState.email" type="email" />
                </UFormGroup>
                <UFormGroup class="mb-4" name="password" label="Password">
                    <UInput v-model="formState.password" type="password" />
                </UFormGroup>
                <UButton :loading="isLoading" type="submit" block>Sign in</UButton>
            </UForm>
        </UCard>
    </WrapperAuth>
</template>

<style scoped></style>