<template>
  <!-- Footer -->
  <footer
    v-if="footerDisplay"
    id="kt_app_footer"
    class="app-footer bg-warning mt-10"
  >
    <div
      class="app-container d-flex flex-column flex-md-row flex-center flex-md-stack py-3"
      :class="containerClasses"
    >
      <!-- Copyright -->
      <div class="text-gray-800 order-2 order-md-1">
        <span class="text-gray-800 me-1">© {{ currentYear }} </span>
        <a
          :href="facultyUrl"
          target="_blank"
          class="text-gray-800 text-hover-white"
          rel="noopener noreferrer"
        >
          {{ facultyName }}
        </a>
      </div>
    </div>
  </footer>
</template>

<script setup lang="ts">
import { computed } from "vue";
import {
  footerDisplay,
  footerWidthFluid,
} from "@/layouts/default-layout/config/helper";

// Component name
defineOptions({
  name: "theme-footer",
});

// Constants
const currentYear = new Date().getFullYear() + 543; // Buddhist Era
const facultyUrl = "http://sci.kmutnb.ac.th/";
const facultyName = "คณะวิทยาศาสตร์ประยุกต์ มจพ.";

// Computed properties
const containerClasses = computed(() => ({
  "container-fluid": footerWidthFluid.value,
  "container-xxl": !footerWidthFluid.value,
}));
</script>
