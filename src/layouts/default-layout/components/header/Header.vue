<template>
  <!--begin::Header-->
  <div
    v-if="headerDisplay"
    id="kt_app_header"
    class="app-header bg-white shadow-sm"
    data-kt-sticky="true"
    data-kt-sticky-activate="{default: true, lg: true}"
    data-kt-sticky-name="app-header-minimize"
    data-kt-sticky-offset="{default: '200px', lg: '0'}"
    data-kt-sticky-animation="false"
  >
    <!--begin::Header container-->
    <div
      class="app-container d-flex align-items-stretch justify-content-between"
      :class="containerClasses"
    >
      <div
        v-if="isHeaderLayoutMode"
        class="d-flex align-items-center flex-grow-1 flex-lg-grow-0 me-lg-15"
      >
        <router-link to="/">
          <img alt="Logo" :src="logoSrc" :class="logoClasses" />
        </router-link>
      </div>

      <template v-else>
        <div class="d-flex align-items-center d-lg-none ms-n3 me-1 me-md-2">
          <div
            class="btn btn-icon btn-active-color-primary w-35px h-35px"
            id="kt_app_sidebar_mobile_toggle"
          >
            <KTIcon icon-name="abstract-14" icon-class="fs-2 fs-md-1" />
          </div>
        </div>
        <div class="d-flex align-items-center flex-grow-1 flex-lg-grow-0">
          <router-link to="/" class="d-lg-none">
            <img
              alt="Logo"
              :src="getAssetPath('media/logos/logo-sci.png')"
              class="h-30px"
            />
          </router-link>
        </div>
      </template>

      <!--begin::Header wrapper-->
      <div
        class="d-flex align-items-stretch justify-content-end flex-lg-grow-1"
        id="kt_app_header_wrapper"
      >
        <KTHeaderNavbar />
      </div>
      <!--end::Header wrapper-->
    </div>
    <!--end::Header container-->
  </div>
  <!--end::Header-->
</template>

<script setup lang="ts">
import { computed } from "vue";
import { getAssetPath } from "@/core/helpers/assets";
import KTHeaderNavbar from "@/layouts/default-layout/components/header/Navbar.vue";
// import KTIcon from "@/core/components/KTIcon.vue";
import {
  headerDisplay,
  headerWidthFluid,
  layout,
  themeMode,
} from "@/layouts/default-layout/config/helper";

// Container classes computed property
const containerClasses = computed(() => ({
  "container-fluid": headerWidthFluid,
  "container-xxl": !headerWidthFluid,
}));

// Check if current layout is header-based (light or dark header)
const isHeaderLayoutMode = computed(
  () => layout.value === "light-header" || layout.value === "dark-header"
);

// Logo source computed property
const logoSrc = computed(() => getAssetPath("media/logos/logo-sci.png"));

// Logo classes computed property
const logoClasses = computed(() => {
  const baseClasses = "h-20px h-lg-30px app-sidebar-logo-default";

  if (themeMode.value === "light" && layout.value === "light-header") {
    return `${baseClasses} theme-light-show`;
  }

  return baseClasses;
});

defineOptions({
  name: "layout-header",
});
</script>
