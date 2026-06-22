<template>
  <!--begin::Menu-->
  <div
    class="menu menu-sub menu-sub-dropdown menu-column menu-rounded menu-gray-600 menu-state-bg-light-primary fw-semibold py-4 fs-6 w-275px"
    data-kt-menu="true"
  >
    <!--begin::Menu item-->
    <div class="menu-item px-3">
      <div class="menu-content d-flex align-items-center px-3">
        <!--begin::Avatar-->
        <div class="symbol symbol-50px me-5">
          <img alt="User Avatar" :src="userAvatar" />
        </div>
        <!--end::Avatar-->

        <!--begin::Username-->
        <div class="">
          <div class="fw-bold align-items-center fs-7">
            {{ fullName }}
          </div>
          <a href="#" class="fw-semibold text-muted fs-7">{{
            departmentName
          }}</a>
          <!-- <a href="#" class="fw-semibold text-muted fs-7">{{
            userData.email
          }}</a> -->
        </div>

        <!--end::Username-->
      </div>
    </div>
    <!--end::Menu item-->

    <!--begin::Menu separator-->
    <div class="separator my-2"></div>
    <!--end::Menu separator-->

    <!--begin::Menu item-->
    <div class="menu-item px-5">
      <a @click="handleSignOut()" class="menu-link px-5"> ออกจากระบบ </a>
    </div>
    <!--end::Menu item-->
  </div>
  <!--end::Menu-->
</template>

<script setup lang="ts">
import { getAssetPath } from "@/core/helpers/assets";
import { useAuthStore } from "@/stores/auth";
import { useRouter } from "vue-router";
import { computed } from "vue";

defineOptions({
  name: "kt-user-menu",
});

const authStore = useAuthStore();
const router = useRouter();
const userData = JSON.parse(localStorage.getItem("userData") || "{}");
const userAvatar = computed(() => {
  return getAssetPath("media/avatars/blank.png");
});

const fullName = computed(() => {
  const { prefix_name = "", firstname = "", surname = "" } = userData;
  if (prefix_name != null) {
    return `${prefix_name}${firstname} ${surname}`.trim();
  } else {
    return `${firstname} ${surname}`.trim();
  }
});

const departmentName = computed(() => {
  return userData.department?.name || "";
});

const handleSignOut = async () => {
  try {
    authStore.logout();

    const redirectRouteName = userData.level != 3 ? "home" : "home";

    await router.push({ name: redirectRouteName });
  } catch (error) {
    console.error("Error during sign out:", error);
  }
};
</script>
