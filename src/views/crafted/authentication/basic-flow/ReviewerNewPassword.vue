<template>
  <!--begin::Wrapper-->
  <div class="w-lg-500px p-10">
    <!--begin::Form-->
    <VForm
      class="form w-100"
      id="kt_login_signin_form"
      @submit="onSubmit"
      :validation-schema="newPassword"
      :initial-values="{ email: 'arnonr', password: 'demo' }"
    >
      <!--begin::Heading-->
      <div class="text-center mb-10">
        <!--begin::Title-->
        <h4 class="text-gray-900 mb-3">
          ระบบยื่นเสนอโครงการวิจัย <br />คณะวิทยาศาสตร์ประยุกต์
        </h4>
        <!--end::Title-->
      </div>
      <!--begin::Heading-->

      <div class="mb-10 bg-light-warning p-4 rounded">
        <div class="text-dark">ตั้งรหัสผ่านใหม่/เข้าใช้งานครั้งแรก</div>
      </div>

      <!--begin::Input group-->
      <div class="fv-row mb-10">
        <!--begin::Label-->
        <label class="form-label fs-6 fw-bold text-gray-900"
          >ระบุรหัสผ่าน</label
        >
        <!--end::Label-->

        <!--begin::Input-->
        <Field
          tabindex="1"
          class="form-control form-control-lg form-control-solid"
          type="password"
          name="password"
          autocomplete="off"
        />
        <!--end::Input-->
        <div class="fv-plugins-message-container">
          <div class="fv-help-block">
            <ErrorMessage name="password" />
          </div>
        </div>
      </div>
      <!--end::Input group-->

      <!--begin::Input group-->
      <div class="fv-row mb-10">
        <!--begin::Wrapper-->
        <div class="d-flex flex-stack mb-2">
          <!--begin::Label-->
          <label class="form-label fw-bold text-gray-900 fs-6 mb-0"
            >ระบุรหัสผ่านอีกครั้ง</label
          >
          <!--end::Label-->
        </div>
        <!--end::Wrapper-->

        <!--begin::Input-->
        <Field
          tabindex="2"
          class="form-control form-control-lg form-control-solid"
          type="password"
          name="password_verify"
          autocomplete="off"
        />
        <!--end::Input-->
        <div class="fv-plugins-message-container">
          <div class="fv-help-block">
            <ErrorMessage name="password_verify" />
          </div>
        </div>
      </div>
      <!--end::Input group-->

      <!--begin::Actions-->
      <div class="text-center">
        <!--begin::Submit button-->
        <button
          tabindex="3"
          type="submit"
          ref="submitButton"
          id="kt_sign_in_submit"
          class="btn btn-lg btn-primary w-100 mb-5"
        >
          <span class="indicator-label"> Continue </span>

          <span class="indicator-progress">
            Please wait...
            <span
              class="spinner-border spinner-border-sm align-middle ms-2"
            ></span>
          </span>
        </button>
        <!--end::Submit button-->
      </div>
      <!--end::Actions-->
    </VForm>
    <!--end::Form-->
  </div>
  <!--end::Wrapper-->
</template>

<script lang="ts">
import { getAssetPath } from "@/core/helpers/assets";
import { defineComponent, ref } from "vue";
import { ErrorMessage, Field, Form as VForm } from "vee-validate";
// import { useAuthStore, type User } from "@/stores/auth";
import { useAuthReviewerStore, type User } from "@/stores/auth-reviewer";
import { useRouter, useRoute } from "vue-router";
import useToast from "@/composables/useToast";
import ApiService from "@/core/services/ApiService";
import Swal from "sweetalert2/dist/sweetalert2.js";
import * as Yup from "yup";

export default defineComponent({
  name: "new-password",
  components: {
    Field,
    VForm,
    ErrorMessage,
  },
  setup() {
    const store = useAuthReviewerStore();

    const router = useRouter();
    const route = useRoute();

    const submitButton = ref<HTMLButtonElement | null>(null);

    //Create form validation object
    const newPassword = Yup.object().shape({
      password: Yup.string().min(4).required().label("Password"),
      password_verify: Yup.string()
        .oneOf([Yup.ref("password"), undefined], "รหัสผ่านไม่ตรงกัน")
        .required("กรุณายืนยันรหัสผ่าน"),
    });

    //Form submit function
    const onSubmit = async (values: any) => {
      // checkToken รหัสผ่าน
      await ApiService.post("reviewer/verify-new-password/", {
        id: route.query.id,
        password_token: route.query.token,
        new_password: values.password,
      })
        .then(async ({ data }) => {
          if (data.msg != "success") {
            throw new Error("ERROR");
          }
          if (data.data.verify == false) {
            useToast("URL ไม่ถูกต้อง",'error');
            throw new Error("ERROR");
          }

          let reviewer_user: any = {
            email: data.data.email,
            password: values.password,
          };

          store.logout();

          if (submitButton.value) {
            // eslint-disable-next-line
            submitButton.value!.disabled = true;
            // Activate indicator
            submitButton.value.setAttribute("data-kt-indicator", "on");
          }

          await store.login(reviewer_user);
          const error = Object.values(store.errors);

          if (error.length === 0) {
            Swal.fire({
              text: "You have successfully logged in!",
              icon: "success",
              buttonsStyling: false,
              confirmButtonText: "Ok, got it!",
              heightAuto: false,
              customClass: {
                confirmButton: "btn fw-semibold btn-light-primary",
              },
            }).then(() => {
              // Go to page after successfully login
              router.push({ name: "reviewer-paper" });
            });
          } else {
            Swal.fire({
              text: error[0] as string,
              icon: "error",
              buttonsStyling: false,
              confirmButtonText: "Try again!",
              heightAuto: false,
              customClass: {
                confirmButton: "btn fw-semibold btn-light-danger",
              },
            }).then(() => {
              store.errors = {};
            });
          }
        })
        .catch(({ response }) => {
          console.log(response);
        });

      //Deactivate indicator
      submitButton.value?.removeAttribute("data-kt-indicator");
      // eslint-disable-next-line
      submitButton.value!.disabled = false;
    };

    return {
      onSubmit,
      newPassword,
      submitButton,
      getAssetPath,
    };
  },
});
</script>
