<script setup lang="ts">
import SigninSchema from '~/schemas/Signin.schema';
import type { FormSubmitEvent } from '@nuxt/ui/dist/runtime/types';
import type { z } from 'zod';

interface Props {
    title: string;
}

defineProps<Props>();

const formState = reactive({
    email: undefined,
    password: undefined
})
const isLoading = ref(false);

const { signIn } = useAuth();

async function submitForm(event: FormSubmitEvent<z.output<typeof SigninSchema>>) {
    try {
        isLoading.value = true;
        const res = await signIn('credentials', {
            email: event.data.email,
            password: event.data.password,
            redirect: false
        })

        // @ts-expect-error
        if (!res.error) {

            useRouter().push('/');
        }
    } catch (error) {

    } finally {
        isLoading.value = false;
    }
}

</script>

<template>
    <div class="grid lg:grid-cols-2 h-screen">
        <div class="left place-self-center w-full px-8 md:px-16 lg:px-24 xl:px-36 2xl:px-52">
            <div class="header text-center mb-6">
                <div class="flex justify-center">
                    <Logo logo-class="w-12 h-12 text-primary-400" logo-text-class="text-3xl font-bold" />
                </div>
                <h1 class="text-xl font-bold mt-4">{{ title }}</h1>
            </div>
            <!-- Form -->
            <slot />
            <!-- ./ Form -->
        </div>
        <div class="right hidden lg:block" />
    </div>
</template>

<style scoped>
.right {
    background: linear-gradient(-45deg, #22c55e, #10b981, #84cc16, #23d5ab);
    background-size: 400% 400%;
    animation: gradient 15s ease infinite;
}

@keyframes gradient {
    0% {
        background-position: 0 50%;
    }

    50% {
        background-position: 100% 50%;
    }

    100% {
        background-position: 0 50%;
    }
}
</style>