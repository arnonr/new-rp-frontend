<template>
  <div>
    <!-- Top Contact Bar -->
    <div class="bg-dark text-light py-2">
      <div class="container">
        <div class="d-flex justify-content-between">
          <div>
            <small>{{ contactInfo }}</small>
          </div>
        </div>
      </div>
    </div>

    <!-- Navigation Bar -->
    <nav class="navbar navbar-expand-lg navbar-light bg-warning">
      <div class="container">
        <!-- Brand/Logo -->
        <router-link to="/" class="navbar-brand d-flex align-items-center">
          <img
            alt="Logo"
            :src="getAssetPath('media/logos/logo-sci.png')"
            class="h-70px h-lg-70px app-sidebar-logo-default"
          />
          <h6 class="ms-4 mt-4">
            {{ appTitle }}
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

        <!-- Navigation Menu -->
        <div class="collapse navbar-collapse" id="navbarNav">
          <ul class="navbar-nav ms-auto fw-bold">
            <li
              v-for="item in navigationItems"
              :key="item.name"
              class="nav-item"
              v-show="item.visible"
            >
              <router-link :to="item.path" class="nav-link text-hover-white">
                {{ item.name }}
              </router-link>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  </div>
</template>

<script lang="ts">
import { defineComponent, computed, ref, onMounted } from "vue";
import { getAssetPath } from "@/core/helpers/assets";

interface NavigationItem {
  name: string;
  path: string;
  visible: boolean;
}

interface UserData {
  id?: string | number;
  [key: string]: any;
}

export default defineComponent({
  name: "LayoutHeader",
  setup() {
    // Reactive states
    const userData = ref<UserData>({});

    // Constants
    const contactInfo = "โทร: 123-456-7890 | อีเมล: info@example.com";
    const appTitle = "ระบบเสนอโครงการวิจัย\nคณะวิทยาศาสตร์ประยุกต์";

    // Computed properties
    const isLoggedIn = computed(() => Boolean(userData.value.id));

    const navigationItems = computed<NavigationItem[]>(() => [
      {
        name: "หน้าแรก",
        path: "/",
        visible: true,
      },
      {
        name: "ระบบยื่นเสนอโครงการ",
        path: "/paper",
        visible: isLoggedIn.value,
      },
      {
        name: "เข้าสู่ระบบ",
        path: "/sign-in",
        visible: !isLoggedIn.value,
      },
      {
        name: "เข้าสู่ระบบ (สำหรับกรรมการ)",
        path: "/reviewer-sign-in",
        visible: true,
      },
      {
        name: "เอกสาร",
        path: "/document",
        visible: !isLoggedIn.value,
      },
      {
        name: "ติดต่อเรา",
        path: "/contact",
        visible: true,
      },
    ]);

    // Methods
    const loadUserData = () => {
      try {
        const storedData = localStorage.getItem("userData");
        userData.value = storedData ? JSON.parse(storedData) : {};
      } catch (error) {
        console.error("Error loading user data:", error);
        userData.value = {};
      }
    };

    // Lifecycle hooks
    onMounted(() => {
      loadUserData();
    });

    return {
      userData,
      contactInfo,
      appTitle,
      navigationItems,
      isLoggedIn,
      getAssetPath,
      loadUserData,
    };
  },
});
</script>

<style scoped>
.navbar-nav .nav-link {
  padding: 0.5em 1rem !important;
}

.navbar-brand h6 {
  line-height: 1.3;
  white-space: pre-line;
}

.app-sidebar-logo-default {
  object-fit: contain;
}
</style>
