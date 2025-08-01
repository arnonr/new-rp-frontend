<template>
  <div class="container p-0 mt-2 pb-0">
    <section>
      <!-- Loading state -->
      <div v-if="loading" class="text-center">
        <p>กำลังโหลด...</p>
      </div>

      <!-- Error state -->
      <div v-else-if="error" class="alert alert-danger text-center">
        <p>เกิดข้อผิดพลาด: {{ error }}</p>
        <button @click="fetchItem" class="btn btn-primary btn-sm">
          ลองใหม่
        </button>
      </div>

      <!-- Content -->
      <div v-else-if="item.detail" v-html="item.detail"></div>

      <!-- No content -->
      <div v-else class="text-center">
        <p>ไม่พบข้อมูล</p>
      </div>
    </section>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted } from "vue";
import ApiService from "@/core/services/ApiService";

interface AboutItem {
  detail: string;
  id?: number;
  created_at?: string;
  updated_at?: string;
}

export default defineComponent({
  name: "HomePage",
  setup() {
    const item = ref<AboutItem>({ detail: "" });
    const loading = ref(false);
    const error = ref("");

    const fetchItem = async () => {
      loading.value = true;
      error.value = "";
      try {
        const params = { orderBy: "created_at", order: "desc" };
        const res = await ApiService.query("about/1", { params });
        item.value = res.data.data;
      } catch (err) {
        console.error("Error fetching about data:", err);
        error.value = "ไม่สามารถโหลดข้อมูลได้ กรุณาลองใหม่อีกครั้ง";
      } finally {
        loading.value = false;
      }
    };

    onMounted(fetchItem);

    return { item, loading, error, fetchItem };
  },
});
</script>

<style scoped>
.container {
  min-height: 200px;
}

.alert {
  padding: 1rem;
  margin: 1rem 0;
  border-radius: 0.5rem;
}

.alert-danger {
  background-color: #f8d7da;
  border-color: #f5c6cb;
  color: #721c24;
}

.btn {
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 0.25rem;
  cursor: pointer;
}

.btn-primary {
  background-color: #007bff;
  color: white;
}

.btn-sm {
  padding: 0.25rem 0.5rem;
  font-size: 0.875rem;
}
</style>
