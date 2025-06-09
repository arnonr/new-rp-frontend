<template>
  <div class="auth-wrapper">
    <div class="auth-container">
      <div class="auth-card">
        <VForm
          class="form w-100"
          id="kt_login_signin_form"
          @submit="handleSubmit"
          :validation-schema="validationSchema"
          :initial-values="initialValues"
        >
          <!-- Header with Logo -->
          <div class="text-center mb-8">
            <div class="auth-logo mb-4">
              <div class="logo-circle">
                <i class="fas fa-graduation-cap text-white fs-2"></i>
              </div>
            </div>
            <h3 class="auth-title mb-2">
              {{ pageTitle }}
            </h3>
            <p class="auth-subtitle">เข้าสู่ระบบเพื่อเริ่มต้นการทำงาน</p>
          </div>

          <!-- Info Banner with enhanced styling -->
          <div class="auth-banner mb-8">
            <div class="d-flex align-items-center">
              <i class="fas fa-info-circle text-primary me-3 fs-4"></i>
              <span class="fw-semibold">{{ bannerText }}</span>
            </div>
          </div>

          <!-- Username Input with Icon -->
          <div class="fv-row mb-6">
            <label class="form-label auth-label">
              {{ usernameLabel }}
            </label>
            <div class="input-group auth-input-group">
              <span class="input-group-text">
                <i class="fas fa-user text-muted"></i>
              </span>
              <Field
                tabindex="1"
                class="form-control auth-input"
                type="text"
                name="username"
                autocomplete="username"
                placeholder="กรอกชื่อผู้ใช้งาน"
              />
            </div>
            <div class="fv-plugins-message-container">
              <div class="fv-help-block">
                <ErrorMessage name="username" />
              </div>
            </div>
          </div>

          <!-- Password Input with Icon -->
          <div class="fv-row mb-6">
            <div class="d-flex flex-stack mb-2">
              <label class="form-label auth-label">
                {{ passwordLabel }}
              </label>
              <a
                :href="forgotPasswordUrl"
                target="_blank"
                class="auth-link"
                rel="noopener noreferrer"
              >
                {{ forgotPasswordText }}
              </a>
            </div>
            <div class="input-group auth-input-group">
              <span class="input-group-text">
                <i class="fas fa-lock text-muted"></i>
              </span>
              <Field
                tabindex="2"
                class="form-control auth-input"
                type="password"
                name="password"
                autocomplete="current-password"
                placeholder="กรอกรหัสผ่าน"
              />
            </div>
            <div class="fv-plugins-message-container">
              <div class="fv-help-block">
                <ErrorMessage name="password" />
              </div>
            </div>
          </div>

          <!-- Enhanced Submit Button -->
          <div class="text-center mb-6">
            <button
              ref="submitButtonRef"
              tabindex="3"
              type="submit"
              id="kt_sign_in_submit"
              class="btn auth-submit-btn w-100"
              :disabled="isLoading"
            >
              <span v-if="!isLoading" class="indicator-label">
                <i class="fas fa-sign-in-alt me-2"></i>
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

          <!-- Back to Home Link with styling -->
          <div class="text-center">
            <router-link to="/home" class="auth-back-link">
              <i class="fas fa-arrow-left me-2"></i>
              {{ backToHomeText }}
            </router-link>
          </div>
        </VForm>
      </div>
    </div>
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

<style scoped>
.auth-wrapper {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 2em;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 25px;
}

.auth-container {
  width: 100%;
  max-width: 450px;
}

.auth-card {
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  border-radius: 20px;
  padding: 40px 35px;
  box-shadow: 0 15px 35px rgba(0, 0, 0, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  animation: slideUp 0.6s ease-out;
}

@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.auth-logo {
  margin-bottom: 20px;
}

.logo-circle {
  width: 80px;
  height: 80px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto;
  box-shadow: 0 8px 25px rgba(102, 126, 234, 0.3);
  animation: pulse 2s infinite;
}

@keyframes pulse {
  0% {
    box-shadow: 0 8px 25px rgba(102, 126, 234, 0.3);
  }
  50% {
    box-shadow: 0 8px 35px rgba(102, 126, 234, 0.5);
  }
  100% {
    box-shadow: 0 8px 25px rgba(102, 126, 234, 0.3);
  }
}

.auth-title {
  color: #2d3748;
  font-weight: 700;
  line-height: 1.4;
  white-space: pre-line;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.auth-subtitle {
  color: #718096;
  font-size: 14px;
  margin: 0;
}

.auth-banner {
  background: linear-gradient(135deg, #e3f2fd 0%, #f3e5f5 100%);
  border: 1px solid #e1bee7;
  border-radius: 12px;
  padding: 16px 20px;
  animation: fadeIn 0.8s ease-out 0.2s both;
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

.auth-label {
  color: #2d3748;
  font-weight: 600;
  font-size: 14px;
  margin-bottom: 8px;
}

.auth-input-group {
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.08);
  border-radius: 10px;
  overflow: hidden;
  transition: all 0.3s ease;
}

.auth-input-group:focus-within {
  box-shadow: 0 4px 20px rgba(102, 126, 234, 0.15);
  transform: translateY(-1px);
}

.auth-input-group .input-group-text {
  background: #f7fafc;
  border: 1px solid #e2e8f0;
  border-right: none;
  padding: 12px 15px;
}

.auth-input {
  border: 1px solid #e2e8f0;
  border-left: none;
  padding: 12px 15px;
  font-size: 14px;
  transition: all 0.3s ease;
}

.auth-input:focus {
  border-color: #667eea;
  box-shadow: none;
}

.auth-input::placeholder {
  color: #a0aec0;
  font-size: 13px;
}

.auth-submit-btn {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border: none;
  border-radius: 12px;
  padding: 14px 24px;
  font-weight: 600;
  font-size: 16px;
  color: white;
  transition: all 0.3s ease;
  box-shadow: 0 6px 20px rgba(102, 126, 234, 0.3);
}

.auth-submit-btn:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(102, 126, 234, 0.4);
}

.auth-submit-btn:active {
  transform: translateY(0);
}

.auth-submit-btn:disabled {
  opacity: 0.8;
  cursor: not-allowed;
}

.auth-link {
  color: #667eea;
  text-decoration: none;
  font-weight: 500;
  font-size: 13px;
  transition: all 0.3s ease;
}

.auth-link:hover {
  color: #764ba2;
  text-decoration: underline;
}

.auth-back-link {
  color: #718096;
  text-decoration: none;
  font-weight: 500;
  font-size: 14px;
  display: inline-flex;
  align-items: center;
  transition: all 0.3s ease;
}

.auth-back-link:hover {
  color: #667eea;
  transform: translateX(-2px);
}

.fv-help-block {
  color: #e53e3e;
  font-size: 12px;
  margin-top: 6px;
  animation: shake 0.5s ease-in-out;
}

@keyframes shake {
  0%,
  100% {
    transform: translateX(0);
  }
  25% {
    transform: translateX(-5px);
  }
  75% {
    transform: translateX(5px);
  }
}

/* Responsive Design */
@media (max-width: 576px) {
  .auth-wrapper {
    padding: 15px;
  }

  .auth-card {
    padding: 30px 25px;
    border-radius: 15px;
  }

  .logo-circle {
    width: 70px;
    height: 70px;
  }

  .auth-title {
    font-size: 20px;
  }
}
</style>
