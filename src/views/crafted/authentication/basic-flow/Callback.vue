<template>
  <div class="callback-container d-flex flex-center flex-column">
    <div v-if="status === 'loading'" class="text-center">
      <h1 class="mb-4">{{ appName }}</h1>
      <div class="spinner-border text-primary mb-3" role="status">
        <span class="visually-hidden">Loading...</span>
      </div>
      <p class="text-muted">กำลังเข้าสู่ระบบ...</p>
    </div>

    <div v-else-if="status === 'error'" class="text-center">
      <h1 class="mb-4">{{ appName }}</h1>
      <p class="text-danger mb-3">{{ errorMessage }}</p>
      <button class="btn btn-primary" @click="goLogin">
        กลับไปหน้าเข้าสู่ระบบ
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/auth';

const route = useRoute();
const router = useRouter();
const auth = useAuthStore();

const appName = import.meta.env.VITE_APP_FULL_NAME;
const status = ref('loading');
const errorMessage = ref('');

const goLogin = () => router.push({ name: 'sign-in' });

onMounted(async () => {
  const { code, state, error } = route.query;

  // Handle user cancellation or SSO error
  if (error) {
    status.value = 'error';
    errorMessage.value = 'การเชื่อมต่อ SSO ถูกยกเลิกหรือเกิดข้อผิดพลาด';
    return;
  }

  // Missing authorization code
  if (!code) {
    status.value = 'error';
    errorMessage.value = 'ไม่ได้รับ authorization code จาก SSO';
    return;
  }

  // CSRF protection: validate state matches what we stored
  const expectedState = sessionStorage.getItem('sso_state');
  sessionStorage.removeItem('sso_state');
  if (!expectedState || expectedState !== state) {
    status.value = 'error';
    errorMessage.value = 'State ไม่ตรงกัน (CSRF protection)';
    return;
  }

  // All good — call backend to exchange code for token
  try {
    await auth.ssoLogin(
      String(code),
      import.meta.env.VITE_APP_SSO_REDIRECT_URI,
    );
    router.replace({ name: 'paper' });
  } catch (err: any) {
    console.error('[Callback] SSO login failed:', err);
    status.value = 'error';
    errorMessage.value =
      err?.response?.data?.msg || 'เข้าสู่ระบบไม่สำเร็จ';
  }
});
</script>
