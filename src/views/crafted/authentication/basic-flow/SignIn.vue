<template>
  <div class="w-lg-500px p-10">
    <VForm
      class="form w-100"
      id="kt_login_signin_form"
      @submit="handleSubmit"
      :validation-schema="validationSchema"
      :initial-values="initialValues"
    >
      <!-- Header-->
      <div class="text-center mb-10">
        <h4 class="text-gray-900 mb-3">
          {{ pageTitle }}
        </h4>
      </div>

      <!-- Info Banner -->
      <div class="mb-10 bg-light-warning p-4 rounded">
        <div class="text-dark">{{ bannerText }}</div>
      </div>

      <!-- Username Input -->
      <div class="fv-row mb-10">
        <label class="form-label fs-6 fw-bold text-gray-900">
          {{ usernameLabel }}
        </label>
        <Field
          tabindex="1"
          class="form-control form-control-lg form-control-solid"
          type="text"
          name="username"
          autocomplete="username"
        />
        <div class="fv-plugins-message-container">
          <div class="fv-help-block">
            <ErrorMessage name="username" />
          </div>
        </div>
      </div>

      <!-- Password Input -->
      <div class="fv-row mb-10">
        <div class="d-flex flex-stack mb-2">
          <label class="form-label fw-bold text-gray-900 fs-6 mb-0">
            {{ passwordLabel }}
          </label>
          <a
            :href="forgotPasswordUrl"
            target="_blank"
            class="link-primary fs-6 fw-bold"
            rel="noopener noreferrer"
          >
            {{ forgotPasswordText }}
          </a>
        </div>
        <Field
          tabindex="2"
          class="form-control form-control-lg form-control-solid"
          type="password"
          name="password"
          autocomplete="current-password"
        />
        <div class="fv-plugins-message-container">
          <div class="fv-help-block">
            <ErrorMessage name="password" />
          </div>
        </div>
      </div>

      <!-- Submit Button -->
      <div class="text-center">
        <button
          ref="submitButtonRef"
          tabindex="3"
          type="submit"
          id="kt_sign_in_submit"
          class="btn btn-lg btn-primary w-100 mb-5"
          :disabled="isLoading"
        >
          <span v-if="!isLoading" class="indicator-label">
            {{ submitButtonText }}
          </span>
          <span v-else class="indicator-progress">
            {{ loadingText }}
            <span
              class="spinner-border spinner-border-sm align-middle ms-2"
            ></span>
          </span>
        </button>
      </div>

      <!-- Back to Home Link -->
      <div class="text-start d-flex justify-content-between">
        <router-link to="/home" class="link-primary fs-6 fw-bold">
          {{ backToHomeText }}
        </router-link>
      </div>
    </VForm>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { ErrorMessage, Field, Form as VForm } from "vee-validate";
import { useAuthStore } from "@/stores/auth";
import { useRouter } from "vue-router";
import Swal from "sweetalert2/dist/sweetalert2.js";
import * as Yup from "yup";
// import { getAssetPath } from "@/core/helpers/assets";

// Component name
defineOptions({
  name: "user-sign-in",
});

// Composables
const authStore = useAuthStore();
const router = useRouter();

// Reactive state
const submitButtonRef = ref<HTMLButtonElement | null>(null);
const isLoading = ref(false);

// Constants
const pageTitle = "ระบบยื่นเสนอโครงการวิจัย\nคณะวิทยาศาสตร์ประยุกต์";
const bannerText = "เข้าใช้งานด้วย ICIT Account";
const usernameLabel = "ICIT Account";
const passwordLabel = "Password";
const forgotPasswordText = "ลืมรหัสผ่าน ?";
const forgotPasswordUrl = "https://account.kmutnb.ac.th/web/recovery/password";
const submitButtonText = "Continue";
const loadingText = "Please wait...";
const backToHomeText = "กลับหน้าหลัก";

// Initial form values
const initialValues = {
  username: "arnonr",
  password: "demo",
};

// Validation schema
const validationSchema = Yup.object().shape({
  username: Yup.string().required().label(usernameLabel),
  password: Yup.string().min(4).required().label(passwordLabel),
});

// Alert configurations
const successAlert = {
  text: "You have successfully logged in!",
  icon: "success" as const,
  buttonsStyling: false,
  confirmButtonText: "Ok, got it!",
  heightAuto: false,
  customClass: {
    confirmButton: "btn fw-semibold btn-light-primary",
  },
};

const errorAlert = (message: string) => ({
  text: message,
  icon: "error" as const,
  buttonsStyling: false,
  confirmButtonText: "Try again!",
  heightAuto: false,
  customClass: {
    confirmButton: "btn fw-semibold btn-light-danger",
  },
});

// Loading state management
const setLoadingState = (loading: boolean) => {
  isLoading.value = loading;
  if (submitButtonRef.value) {
    submitButtonRef.value.disabled = loading;
    if (loading) {
      submitButtonRef.value.setAttribute("data-kt-indicator", "on");
    } else {
      submitButtonRef.value.removeAttribute("data-kt-indicator");
    }
  }
};
// Form submission handler
const handleSubmit = async (values: any) => {
  try {
    // Clear existing errors and set loading state
    authStore.logout();
    setLoadingState(true);

    // Attempt login
    await authStore.login(values);
    const errors = Object.values(authStore.errors);

    if (errors.length === 0) {
      // Success - show success message and redirect
      await Swal.fire(successAlert);
      await router.push({ name: "paper" });
    } else {
      // Error - show error message
      await Swal.fire(errorAlert(errors[0] as string));
      authStore.errors = {};
    }
  } catch (error) {
    // Handle unexpected errors
    console.error("Login error:", error);
    await Swal.fire(errorAlert("เกิดข้อผิดพลาดในการเข้าสู่ระบบ"));
  } finally {
    setLoadingState(false);
  }
};
</script>
