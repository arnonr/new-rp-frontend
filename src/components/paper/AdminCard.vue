<template>
  <div class="card shadow-sm my-5">
    <div class="card-header bg-warning">
      <h4 class="card-title">รายการยื่นเสนอโครงการวิจัย</h4>
      <div class="card-toolbar"></div>
    </div>

    <!-- Desktop View -->
    <div class="card-body table-responsive d-none d-lg-block">
      <div class="mb-5">
        <SearchComponent
          :search="search"
          :is-searching="isLoading"
          @search="$emit('search')"
          @clear="$emit('clear')"
        />
      </div>
      <Preloader :isLoading="isLoading" :position="'absolute'" />
      <AdminListComponent
        :items="items"
        :paginationData="paginationData"
        :sortKey="sortKey"
        :sortOrder="sortOrder"
        @update:currentPage="$emit('update:currentPage', $event)"
        @update:perPage="$emit('update:perPage', $event)"
        @sort="$emit('sort', $event)"
        @edit="$emit('editProject', $event)"
        @reject="$emit('reject', $event)"
        @approve="$emit('approve', $event)"
        @cancel="$emit('cancel', $event)"
        @manage-review="$emit('manageReview', $event)"
        @detail="$emit('detail', $event)"
        @history-detail="$emit('historyDetail', $event)"
      />
    </div>

    <!-- Mobile View -->
    <div class="card-body d-lg-none">
      <CardListComponent
        :items="items"
        :paginationData="paginationData"
        :sortKey="sortKey"
        :sortOrder="sortOrder"
        @update:currentPage="$emit('update:currentPage', $event)"
        @update:perPage="$emit('update:perPage', $event)"
        @sort="$emit('sort', $event)"
        @edit="$emit('editProject', $event)"
        @reject="$emit('reject', $event)"
        @approve="$emit('approve', $event)"
        @cancel="$emit('cancel', $event)"
        @manage-review="$emit('manageReview', $event)"
        @detail="$emit('detail', $event)"
        @history-detail="$emit('historyDetail', $event)"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import SearchComponent from "@/components/paper/Search2.vue";
import AdminListComponent from "@/components/paper/AdminList.vue";
import CardListComponent from "@/components/paper/AdminCardList.vue";
import Preloader from "@/components/preloader/Preloader.vue";

defineProps({
  search: { type: Object, required: true },
  items: { type: Array, required: true },
  paginationData: { type: Object, required: true },
  sortKey: { type: String, required: true },
  sortOrder: { type: Number, required: true },
  isLoading: { type: Boolean, default: false },
});

defineEmits([
  "search",
  "clear",
  "addProject",
  "editProject",
  "detail",
  "historyDetail",
  "sort",
  "update:currentPage",
  "update:perPage",
  "reject",
  "approve",
  "cancel",
  "manageReview",
]);

defineOptions({
  name: "AdminPaperAll",
});
</script>
