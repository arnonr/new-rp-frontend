<template>
  <!--begin::Wrapper-->
  <div class="mt-5">
    <!-- Profile Section -->
    <ProfileCard :user="user_item" @edit-user="handleEditUserModal" />

    <!-- Research Projects Section -->
    <ProjectsCard
      :search="search"
      :items="items"
      :pagination-data="paginationData"
      :sort-key="sortKey"
      :sort-order="sortOrder"
      :is-loading="isLoading"
      @search="handleSearch"
      @clear="handleClear"
      @add-project="handleAddProject"
      @edit-project="handleEditProject"
      @detail="handleDetailModal"
      @history-detail="handleHistoryDetailModal"
      @sort="handleSort"
      @update:current-page="paginationData.currentPage = $event"
      @update:per-page="paginationData.perPage = $event"
    />

    <!-- Modals -->
    <ModalsContainer
      :user-item="user_item"
      :selected-item="selectedItem"
      :modals="modals"
      @close-edit-user="modals.editUser = false"
      @close-detail="modals.detail = false"
      @close-history-detail="modals.historyDetail = false"
      @reload-user="fetchUser"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, watch } from "vue";
import ApiService from "@/core/services/ApiService";
import { useRouter } from "vue-router";

// Component
import ProfileCard from "@/components/profile/card.vue";
import ProjectsCard from "@/components/paper/Card.vue";
import ModalsContainer from "@/components/paper/ModalsContainer.vue";
import useToast from "@/composables/useToast";

// Composables
const router = useRouter();

// User data from localStorage
const userData = JSON.parse(localStorage.getItem("userData") || "{}");

// Reactive state
const isLoading = ref<any>(false);
const sortKey = ref("");
const sortOrder = ref(-1);

const user_item = reactive<any>({});
const search = reactive<any>({});
const items = reactive<any[]>([]);
const selectedItem = reactive<any>({});

const paginationData = reactive<any>({
  perPage: 20,
  currentPage: 1,
  totalPage: 1,
  totalItems: 0,
});

const modals = reactive<any>({
  editUser: false,
  detail: false,
  historyDetail: false,
});

// API Functions
const fetchItems = async (): Promise<void> => {
  try {
    isLoading.value = true;

    const params = {
      ...search,
      create_year: search.year ?? undefined,
      title_th: search.title_th ?? undefined,
      rp_no: search.rp_no ?? undefined,
      fullname: search.fullname ?? undefined,
      status_id: search.status_id?.id ?? undefined,
      orderBy: sortKey.value || "created_at",
      order: sortOrder.value === 1 ? "asc" : "desc",
      perPage: paginationData.perPage,
      currentPage: paginationData.currentPage,
      user_id: userData.id,
    };

    const { data } = await ApiService.query("paper", { params });

    items.length = 0;
    Object.assign(items, data.data);

    paginationData.totalPage = data.totalPage;
    paginationData.totalItems = data.totalData;
    paginationData.currentPage = data.currentPage;
  } catch (error) {
    console.error("Error fetching items:", error);
    useToast("เกิดข้อผิดพลาดในการโหลดข้อมูล", "error");
  } finally {
    isLoading.value = false;
  }
};

const fetchUser = async (): Promise<void> => {
  try {
    const { data } = await ApiService.query(`user/${userData.id}`, {});

    Object.assign(user_item, {
      ...data.data,
      department_id: data.data.department_id
        ? {
            name: data.data.department.name,
            id: data.data.department_id,
          }
        : null,
    });
  } catch (error) {
    console.error("Error fetching user:", error);
    useToast("เกิดข้อผิดพลาดในการโหลดข้อมูลผู้ใช้", "error");
  }
};

// Validation Functions
const validateUserProfile = (): boolean => {
  const requiredFields = [
    user_item.prefix_name,
    user_item.firstname,
    user_item.surname,
    user_item.email,
    user_item.department_id,
  ];

  const isValid = requiredFields.every(
    (field) => field !== "" && field !== null && field !== undefined
  );

  if (!isValid) {
    useToast("โปรดระบุข้อมูลส่วนตัวให้ครบถ้วน", "error");
  }

  return isValid;
};

// Event Handlers
const handleSearch = (): void => {
  paginationData.currentPage = 1;
  fetchItems();
};

const handleClear = (): void => {
  Object.keys(search).forEach((key) => {
    const value = search[key as keyof SearchParams];
    if (typeof value === "object" && value !== null) {
      Object.keys(value).forEach((subKey) => {
        (value as any)[subKey] = null;
      });
    } else {
      (search as any)[key] = null;
    }
  });

  paginationData.currentPage = 1;
  fetchItems();
};

const handleSort = (key: string): void => {
  if (sortKey.value === key) {
    sortOrder.value *= -1;
  } else {
    sortKey.value = key;
    sortOrder.value = 1;
  }
  fetchItems();
};

// Modal Handlers
const handleDetailModal = (item: any): void => {
  Object.assign(selectedItem, item);
  modals.detail = true;
};

const handleEditUserModal = (): void => {
  modals.editUser = true;
};

const handleHistoryDetailModal = (item: any): void => {
  Object.assign(selectedItem, item);
  modals.historyDetail = true;
};

// Navigation Handlers
const handleAddProject = (): void => {
  if (!validateUserProfile()) return;
  router.push({ name: "paper-add" });
};

const handleEditProject = (id: number): void => {
  if (!validateUserProfile()) return;
  router.push({ name: "paper-edit", params: { id } });
};

// Watchers
watch(
  () => paginationData.currentPage,
  () => fetchItems()
);

watch(
  () => paginationData.perPage,
  () => {
    paginationData.currentPage = 1;
    fetchItems();
  }
);

// Lifecycle
onMounted(async () => {
  await Promise.all([fetchUser(), fetchItems()]);
});

defineOptions({
  name: "PaperIndex",
});
</script>
