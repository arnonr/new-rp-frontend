<template>
  <!--begin::Wrapper-->
  <div class="mt-5">
    <!-- Profile -->

    <Preloader :isLoading="isLoading" :position="'absolute'" />
    <ProjectsCard
      :search="search"
      :items="items"
      :paginationData="paginationData"
      :sortKey="sortKey"
      :sortOrder="sortOrder"
      :is-loading="isLoading"
      @search="handleSearch"
      @clear="handleClear"
      @edit-project="handleEdit"
      @reject="handleRejectModal"
      @approve="handleApproveModal"
      @cancel="handleCancelModal"
      @manage-review="handleManageReviewModal"
      @detail="handleDetailModal"
      @history-detail="handleHistoryDetailModal"
      @sort="handleSort"
      @update:current-page="paginationData.currentPage = $event"
      @update:per-page="paginationData.perPage = $event"
    />

    <!-- Modals -->
    <ModalsContainer
      :selected-item="selectedItem"
      :modals="modals"
      @close-detail="modals.detail = false"
      @close-history-detail="modals.historyDetail = false"
      @close-reject="modals.reject = false"
      @close-approve="modals.approve = false"
      @close-cancel="modals.cancel = false"
      @close-manage-review="modals.manageReview = false"
      @reload="fetchItems"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, watch } from "vue";
import ApiService from "@/core/services/ApiService";
import { useRouter } from "vue-router";

// Component
import ModalsContainer from "@/components/paper/AdminModalsContainer.vue";
import ProjectsCard from "@/components/paper/AdminCard.vue";
import useToast from "@/composables/useToast";
import Preloader from "@/components/preloader/Preloader.vue";

// Reactive state
const router = useRouter();
const isLoading = ref<any>(false);
const sortKey = ref("");
const sortOrder = ref(-1);

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
  detail: false,
  historyDetail: false,
  reject: false,
  approve: false,
  cancel: false,
  manageReview: false,
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
      in_status_id: search.status_id?.id
        ? search.status_id?.id
        : [2, 3, 4, 5].join(","),
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

// Event Handlers
const handleSearch = (): void => {
  paginationData.currentPage = 1;
  fetchItems();
};

const handleClear = (): void => {
  Object.keys(search).forEach((key) => {
    const value = search[key];
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

const handleEdit = (item: any): void => {
  router.push({ name: "admin-paper-edit", params: { id: item.id } });
};

const handleHistoryDetailModal = (item: any): void => {
  Object.assign(selectedItem, item);
  modals.historyDetail = true;
};

const handleRejectModal = (item: any): void => {
  Object.assign(selectedItem, item);
  modals.reject = true;
};

const handleApproveModal = (item: any): void => {
  console.log(item);
  Object.assign(selectedItem, item);
  modals.approve = true;
};

const handleCancelModal = (item: any): void => {
  Object.assign(selectedItem, item);
  modals.cancel = true;
};

const handleManageReviewModal = (item: any): void => {
  Object.assign(selectedItem, item);
  modals.manageReview = true;
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
  await Promise.all([fetchItems()]);
});

defineOptions({
  name: "AdminPaperIndex",
});
// export default defineComponent({
//   name: "admin-paper",
//   components: {
//     SearchComponent,
//     ListComponent,
//     CardListComponent,
//     Preloader,
//     DetailPage,
//     RejectPaperPage,
//     ApprovePaperPage,
//     ManageReviewPaperPage,
//     HistoryDetailPage,
//   },
//   setup() {
//     // UI Variable
//     const isLoading = ref<any>(false);
//     const router = useRouter();
//     const sortKey = ref<any>("");
//     const sortOrder = ref<any>(-1);

//     // Variable
//     const search = reactive<any>({});

//     const items = reactive<any[]>([]);
//     const item = reactive<any>({});

//     const paginationData = reactive<any>({
//       perPage: 20,
//       currentPage: 1,
//       totalPage: 1,
//       totalItems: 0,
//     });

//     const openDetailModal = ref(false);
//     const openEditModal = ref(false);
//     const openReceive1Modal = ref(false);
//     const openRejectModal = ref(false);
//     const openApproveModal = ref(false);
//     const openCancelModal = ref(false);
//     const openManageReviewModal = ref(false);
//     const openHistoryDetailModal = ref(false);

//     // Fetch Data
//     const fetchItems = async () => {
//       isLoading.value = true;
//       const params = {
//         ...search,
//         create_year: search.year ?? undefined,
//         title_th: search.title_th ?? undefined,
//         rp_no: search.rp_no ?? undefined,
//         fullname: search.fullname ?? undefined,
//         in_status_id: search.status_id?.id
//           ? search.status_id?.id
//           : [2, 3, 4, 5].join(","),
//         orderBy: sortKey.value != "" ? sortKey.value : "created_at",
//         order: sortOrder.value == 1 ? "asc" : "desc",
//         perPage: paginationData.perPage,
//         currentPage: paginationData.currentPage,
//       };

//       const { data } = await ApiService.query("paper", {
//         params: params,
//       });

//       items.length = 0;
//       Object.assign(items, data.data);
//       paginationData.totalPage = data.totalPage;
//       paginationData.totalItems = data.totalData;
//       paginationData.currentPage = data.currentPage;
//       isLoading.value = false;
//     };

//     // Event
//     const onClear = () => {
//       Object.keys(search).forEach((key) => {
//         if (typeof search[key] === "object" && search[key] !== null) {
//           Object.keys(search[key]).forEach((subKey) => {
//             search[key][subKey] = null;
//           });
//         } else {
//           search[key] = null;
//         }
//       });
//     };

//     const onExport = async () => {};

//     // Modal action

//     const onDetailModal = (it: any) => {
//       Object.assign(item, it);
//     };

//     // Mounted
//     onMounted(() => {
//       fetchItems();
//     });

//     // Watch
//     watch(
//       () => paginationData.currentPage,
//       () => {
//         fetchItems();
//       }
//     );

//     watch(
//       () => paginationData.perPage,
//       () => {
//         fetchItems();
//       }
//     );

//     const goToAddPage = () => {
//       router.push({ name: "paper-add" });
//     };

//     const goToEditPage = (id: number) => {
//       router.push({ name: "admin-paper-edit", params: { id: id } });
//     };

//     const sortedItems = (key: any) => {
//       if (sortKey.value === key) {
//         sortOrder.value = sortOrder.value * -1;
//       } else {
//         sortKey.value = key;
//       }

//       if (!sortKey.value) return items;

//       fetchItems();
//     };

//     return {
//       search,
//       items,
//       item,
//       paginationData,
//       isLoading,
//       onClear,
//       onExport,
//       onDetailModal,
//       fetchItems,
//       openDetailModal,
//       openEditModal,
//       openReceive1Modal,
//       goToAddPage,
//       goToEditPage,
//       sortKey,
//       sortOrder,
//       sortedItems,
//       openRejectModal,
//       openApproveModal,
//       openCancelModal,
//       openManageReviewModal,
//       openHistoryDetailModal,
//     };
//   },
// });
</script>
