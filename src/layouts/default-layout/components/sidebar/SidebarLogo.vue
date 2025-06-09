<template>
  <!--begin::Logo-->
  <div class="app-sidebar-logo px-6" id="kt_app_sidebar_logo">
    <!--begin::Logo image-->
    <router-link to="/">
      <img alt="Logo" :src="logoPath" :class="logoClasses" />

      <span class="fs-5 text-link text-light fw-bold title-sidebar">
        ระบบเสนอโครงการวิจัย
      </span>
    </router-link>
    <!--end::Logo image-->

    <!--begin::Sidebar toggle-->
    <div
      v-if="sidebarToggleDisplay"
      ref="toggleRef"
      id="kt_app_sidebar_toggle"
      class="app-sidebar-toggle btn btn-icon btn-shadow btn-sm btn-color-muted btn-active-color-primary h-30px w-30px position-absolute top-50 start-100 translate-middle rotate"
      data-kt-toggle="true"
      data-kt-toggle-state="active"
      data-kt-toggle-target="body"
      data-kt-toggle-name="app-sidebar-minimize"
    >
      <KTIcon icon-name="black-left-line" icon-class="fs-3 rotate-180 ms-1" />
    </div>
    <!--end::Sidebar toggle-->
  </div>
  <!--end::Logo-->
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from "vue";
import { ToggleComponent } from "@/assets/ts/components";
import { getAssetPath } from "@/core/helpers/assets";
import { sidebarToggleDisplay } from "@/layouts/default-layout/config/helper";

interface IProps {
  sidebarRef: HTMLElement | null;
}

const props = defineProps<IProps>();
const toggleRef = ref<HTMLFormElement | null>(null);

// Computed properties สำหรับลด redundancy
const logoPath = computed(() => getAssetPath("media/logos/logo-sci.png"));

const logoClasses = computed(() => {
  const baseClasses = "h-50px";
  const logoClass = shouldShowMinimizedLogo.value
    ? "app-sidebar-logo-minimize"
    : "app-sidebar-logo-default";

  return `${baseClasses} ${logoClass}`;
});

const shouldShowMinimizedLogo = computed(() => {
  // Logic สำหรับกำหนดว่าจะแสดง logo แบบ minimize หรือไม่
  // (ปรับตาม business logic ที่ต้องการ)
  return false;
});

// ฟังก์ชันสำหรับจัดการ sidebar animation
const handleSidebarAnimation = () => {
  if (!props.sidebarRef) return;

  props.sidebarRef.classList.add("animating");

  setTimeout(() => {
    props.sidebarRef?.classList.remove("animating");
  }, 300);
};

// ฟังก์ชันสำหรับ setup toggle component
const setupToggleComponent = () => {
  if (!toggleRef.value) return;

  const toggleObj = ToggleComponent.getInstance(
    toggleRef.value
  ) as ToggleComponent | null;

  if (toggleObj) {
    toggleObj.on("kt.toggle.change", handleSidebarAnimation);
  }
};

onMounted(() => {
  // ใช้ nextTick หรือ setTimeout เพื่อให้แน่ใจว่า DOM พร้อม
  setTimeout(setupToggleComponent, 1);
});
</script>
