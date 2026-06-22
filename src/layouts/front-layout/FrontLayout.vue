<template>
  <!--begin::App-->
  <div class="d-flex flex-column flex-root app-root" id="kt_app_root">
    <!--begin::Page-->
    <div class="app-page flex-column flex-column-fluid" id="kt_app_page">
      <KTHeader />
      <!--begin::Wrapper-->
      <div
        class="app-wrapper flex-column flex-row-fluid front-layout"
        id="kt_app_wrapper"
      >
        <!--begin::Main-->
        <div class="app-main flex-column flex-row-fluid" id="kt_app_main">
          <!--begin::Content wrapper-->
          <div class="d-flex flex-column flex-column-fluid">
            <div id="kt_app_content" class="app-content flex-column-fluid">
              <KTContent />
            </div>
          </div>
          <!--end::Content wrapper-->
          <KTFooter />
        </div>
        <!--end:::Main-->
      </div>
      <!--end::Wrapper-->
    </div>
    <!--end::Page-->
  </div>
  <!--end::App-->

  <KTScrollTop />
</template>

<script setup lang="ts">
import { nextTick, onBeforeMount, onMounted, watch } from "vue";
import { useRoute } from "vue-router";

// Components
import KTHeader from "@/layouts/front-layout/components/header/Header.vue";
import KTContent from "@/layouts/front-layout/components/content/Content.vue";
import KTFooter from "@/layouts/front-layout/components/footer/Footer.vue";
import KTScrollTop from "@/layouts/front-layout/components/extras/ScrollTop.vue";

// Services
import { reinitializeComponents } from "@/core/plugins/keenthemes";
import LayoutService from "@/core/services/LayoutService";

// Composables
const route = useRoute();

// Lifecycle hooks
onBeforeMount(() => {
  LayoutService.init();
});

onMounted(() => {
  handleComponentReinit();
});

// Watchers
watch(() => route.path, handleComponentReinit);

// Methods
function handleComponentReinit(): void {
  nextTick(() => {
    reinitializeComponents();
  });
}
</script>