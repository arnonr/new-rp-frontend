<template>
  <div class="card shadow-sm my-5">
    <div class="card-header bg-warning">
      <h4 class="card-title">โครงการวิจัย</h4>
      <div class="card-toolbar">
        <div>
          <button
            type="button"
            class="btn btn-primary me-2 pe-sm-3 ps-sm-5 disabled"
            @click="$emit('addProject')"
          >
            <i class="bi bi-file-earmark-plus-fill fs-4"></i>
            <span class="d-none d-lg-inline-block ms-2">
              เสนอโครงการวิจัย (ปิดรับ)
            </span>
          </button>
        </div>
      </div>
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
      <ListComponent
        :items="items"
        :paginationData="paginationData"
        :sortKey="sortKey"
        :sortOrder="sortOrder"
        @update:currentPage="$emit('update:currentPage', $event)"
        @update:perPage="$emit('update:perPage', $event)"
        @sort="$emit('sort', $event)"
        @edit="$emit('editProject', $event)"
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
        @detail="$emit('detail', $event)"
        @history-detail="$emit('historyDetail', $event)"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import SearchComponent from "@/components/paper/Search2.vue";
import ListComponent from "@/components/paper/List.vue";
import CardListComponent from "@/components/paper/CardList.vue";
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
]);

defineOptions({
  name: "PaperAll",
});
</script>
