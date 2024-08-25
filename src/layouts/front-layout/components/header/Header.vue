<template>
  <div>
    <div class="bg-dark text-light py-2">
      <div class="container">
        <div class="d-flex justify-content-between">
          <div class="">
            <small>โทร: 123-456-7890 | อีเมล: info@example.com</small>
          </div>
        </div>
      </div>
    </div>

    <!-- Menu Bar -->
    <nav class="navbar navbar-expand-lg navbar-light bg-warning">
      <div class="container">
        <router-link to="/" class="navbar-brand d-flex">
          <img
            alt="Logo"
            :src="getAssetPath('media/logos/logo-sci.png')"
            class="h-70px h-lg-70px app-sidebar-logo-default"
          />
          <h6 class="ms-4 mt-4">
            ระบบเสนอโครงการวิจัย<br />คณะวิทยาศาสตร์ประยุกต์
          </h6>
        </router-link>

        <button
          class="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span class="navbar-toggler-icon"></span>
        </button>
        <div class="collapse navbar-collapse" id="navbarNav">
          <ul class="navbar-nav ms-auto fw-bold">
            <li class="nav-item">
              <router-link to="/" class="nav-link text-hover-white"
                >หน้าแรก</router-link
              >
            </li>
            <li class="nav-item" v-if="userData.id">
              <router-link to="/paper" class="nav-link text-hover-white"
                >ระบบยื่นเสนอโครงการ</router-link
              >
            </li>
            <li class="nav-item" v-else>
              <router-link to="/sign-in" class="nav-link text-hover-white"
                >เข้าสู่ระบบ</router-link
              >
            </li>
            <li class="nav-item">
              <router-link to="/reviewer-sign-in" class="nav-link text-hover-white"
                >เข้าสู่ระบบ (สำหรับกรรมการ)</router-link
              >
            </li>
            <li class="nav-item" v-if="!userData.id">
              <router-link to="/document" class="nav-link text-hover-white"
                >เอกสาร</router-link
              >
            </li>
            <li class="nav-item">
              <router-link to="/contact" class="nav-link text-hover-white"
                >ติดต่อเรา</router-link
              >
            </li>
          </ul>
        </div>
      </div>
    </nav>
  </div>
</template>

<script lang="ts">
import { getAssetPath } from "@/core/helpers/assets";
import { defineComponent } from "vue";

export default defineComponent({
  name: "layout-header",
  components: {},
  setup() {
    const userData = JSON.parse(localStorage.getItem("userData") || "{}");

    return {
      getAssetPath,
      userData,
    };
  },
});
</script>

<style scoped>
.navbar-nav .nav-link {
  padding: 0.5em 1rem !important;
}
</style>
