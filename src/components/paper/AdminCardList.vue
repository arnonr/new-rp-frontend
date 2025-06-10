<template>
  <div class="paper-card-list">
    <!-- Cards Grid -->
    <div class="row g-4">
      <div
        v-for="item in items"
        :key="item.id"
        class="col-12 col-md-6 col-lg-4 mb-4"
      >
        <div
          class="paper-card h-100 shadow-sm m-5"
          :class="[`status-${getStatusInfo(item.status_id).bg_bs_color}`]"
        >
          <!-- Card Header -->
          <div class="card-header" @click="handleDetail(item)">
            <div class="d-flex justify-content-between align-items-start">
              <div class="flex-grow-1">
                <h5
                  class="card-title mb-1 text-truncate"
                  :title="item.title_th"
                >
                  {{ item.title_th }}
                </h5>
                <small class="text-muted">{{ item.rp_no }}</small>
              </div>
              <span
                class="status-badge mt-1"
                :style="{
                  backgroundColor: getStatusInfo(item.status_id).bg_color,
                }"
              >
                {{ getStatusInfo(item.status_id).name_th }}
              </span>
            </div>
          </div>

          <!-- Card Body -->
          <div class="card-body flex-grow-1" @click="handleDetail(item)">
            <div class="info-grid">
              <div class="info-item">
                <i class="bi bi-calendar3 text-primary"></i>
                <div>
                  <label>วันที่เสนอ</label>
                  <span>{{ convertDate(item.sended_at) }}</span>
                </div>
              </div>

              <div class="info-item">
                <i class="bi bi-building text-success"></i>
                <div>
                  <label>หน่วยงาน</label>
                  <span>{{ item.department?.name || "ไม่ระบุ" }}</span>
                </div>
              </div>

              <div class="info-item">
                <i class="bi bi-bookmark-fill text-warning"></i>
                <div>
                  <label>ประเภททุนวิจัย</label>
                  <span>{{ item.paper_type?.name || "ไม่ระบุ" }}</span>
                </div>
              </div>
            </div>
          </div>

          <!-- Card Footer -->
          <div class="card-footer mt-auto">
            <div class="dropdown w-100">
              <button
                class="btn btn-outline-primary btn-sm dropdown-toggle w-100"
                type="button"
                :id="`dropdown-${item.id}`"
                data-bs-toggle="dropdown"
                aria-expanded="false"
              >
                <i class="bi bi-gear-fill me-1"></i>
                จัดการข้อมูล
              </button>
              <ul
                class="dropdown-menu w-100"
                :aria-labelledby="`dropdown-${item.id}`"
              >
                <li>
                  <button
                    class="dropdown-item d-flex align-items-center"
                    @click="handleDetail(item)"
                  >
                    <i class="bi bi-eye me-2 text-info"></i>
                    รายละเอียด
                  </button>
                </li>
                <li v-if="showHistoryOption(item.status_id)">
                  <button
                    class="dropdown-item d-flex align-items-center"
                    @click="handleHistoryDetail(item)"
                  >
                    <i class="bi bi-clock-history me-2 text-warning"></i>
                    ประวัติการดำเนินการ
                  </button>
                </li>
                <li v-if="showEditOption(item.status_id)">
                  <button
                    class="dropdown-item d-flex align-items-center"
                    @click="handleEdit(item)"
                  >
                    <i class="bi bi-pencil-square me-2 text-primary"></i>
                    แก้ไขข้อมูล
                  </button>
                </li>
                <li v-if="showRejectOption(item.status_id)">
                  <button
                    class="dropdown-item d-flex align-items-center"
                    @click="handleReject(item)"
                  >
                    <i class="bi bi-send-exclamation me-2 text-primary"></i>
                    ส่งกลับให้แก้ไข
                  </button>
                </li>
                <li>
                  <button
                    class="dropdown-item d-flex align-items-center"
                    @click="handleManageReview(item)"
                  >
                    <i class="bi bi-pencil-square me-2 text-primary"></i>
                    รายการกรรมการ
                  </button>
                </li>
                <li v-if="showApproveOption(item.status_id)">
                  <button
                    class="dropdown-item d-flex align-items-center"
                    @click="handleApprove(item)"
                  >
                    <i class="bi bi-send-exclamation me-2 text-primary"></i>
                    ยกเลิก/ตอบรับข้อเสนอ
                  </button>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Empty State -->
    <EmptyState v-if="items.length === 0" />

    <!-- Pagination -->
    <div class="mt-5">
      <BlogPagination
        v-bind="paginationProps"
        @update:currentPage="updateCurrentPage"
        @update:perPage="updatePerPage"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import type { PropType } from "vue";

// Components
import BlogPagination from "@/components/common/pagination/BlogPagination.vue";
import EmptyState from "@/components/common/EmptyState.vue";

// Composables
import useStatusData from "@/composables/useStatusData";
import useDateData from "@/composables/useDateData";

// Types
// Props
const props = defineProps({
  items: {
    type: Array as PropType<any>,
    required: true,
  },
  paginationData: {
    type: Object as PropType<any>,
    required: true,
  },
  sortKey: {
    type: String,
    required: true,
  },
  sortOrder: {
    type: Number,
    required: true,
  },
});

// Emits
const emit = defineEmits<{
  detail: [item: any];
  edit: [item: any];
  "history-detail": [item: any];
  reject: [item: any];
  approve: [item: any];
  "manage-review": [item: any];
  "update:currentPage": [page: number];
  "update:perPage": [perPage: number];
  sort: [key: string];
}>();

// Composables
const { statuses } = useStatusData();
const { convertDate } = useDateData();

// Computed
const paginationProps = computed(() => ({
  perPage: props.paginationData.perPage,
  totalItems: props.paginationData.totalItems,
  totalPage: props.paginationData.totalPage,
  currentPage: props.paginationData.currentPage,
}));

// Methods
const getStatusInfo = (statusId: number) => {
  const status = statuses.find((s: any) => s.id === statusId);
  return (
    status || {
      name_th: "ไม่ทราบสถานะ",
      bg_color: "#6c757d",
      bg_bs_color: "secondary",
    }
  );
};

const showHistoryOption = (statusId: number): boolean => statusId > 1;

const showEditOption = (statusId: number): boolean =>
  statusId === 1 || statusId === 3;

const showRejectOption = (statusId: number): boolean => statusId === 2;

const showApproveOption = (statusId: number): boolean => statusId === 2;

const handleDetail = (item: any) => {
  emit("detail", item);
};

const handleEdit = (item: any) => {
  emit("edit", item);
};

const handleHistoryDetail = (item: any) => {
  emit("history-detail", item);
};

const handleReject = (item: any) => {
  emit("reject", item);
};

const handleManageReview = (item: any) => {
  emit("manage-review", item);
};

const handleApprove = (item: any) => {
  emit("approve", item);
};

const updateCurrentPage = (page: number) => {
  emit("update:currentPage", page);
};

const updatePerPage = (perPage: number) => {
  emit("update:perPage", perPage);
};
</script>

<style scoped>
.paper-card-list {
  padding: 1rem 0;
}

.paper-card {
  border: none;
  border-radius: 12px;
  overflow: hidden;
  transition: all 0.3s ease;
  border-left: 4px solid transparent;
  display: flex;
  flex-direction: column;
}

.paper-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1) !important;
}

/* Status Border Colors */
.paper-card.status-primary {
  border-left-color: #0d6efd;
}
.paper-card.status-success {
  border-left-color: #198754;
}
.paper-card.status-warning {
  border-left-color: #ffc107;
}
.paper-card.status-error {
  border-left-color: #dc3545;
}
.paper-card.status-info {
  border-left-color: #0dcaf0;
}
.paper-card.status-secondary {
  border-left-color: #6c757d;
}

.card-header {
  background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
  border-bottom: 1px solid #dee2e6;
  padding: 1.25rem;
  flex-shrink: 0;
}

.card-title {
  font-size: 1.1rem;
  font-weight: 600;
  color: #2c3e50;
  line-height: 1.3;
}

.status-badge {
  color: white;
  padding: 0.4rem 0.8rem;
  border-radius: 20px;
  font-size: 0.75rem;
  font-weight: 500;
  white-space: nowrap;
}

.card-body {
  /* padding: 1.25rem; */
  flex-grow: 1;
  display: flex;
  flex-direction: column;
}

.info-grid {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.info-item {
  display: flex;
  align-items: flex-start;
  gap: 0.75rem;
}

.info-item i {
  font-size: 1.1rem;
  margin-top: 0.1rem;
  flex-shrink: 0;
}

.info-item div {
  flex: 1;
  min-width: 0;
}

.info-item label {
  display: block;
  font-size: 0.8rem;
  font-weight: 500;
  color: #6c757d;
  margin-bottom: 0.2rem;
}

.info-item span {
  display: block;
  font-size: 0.9rem;
  color: #2c3e50;
  word-wrap: break-word;
}

.card-footer {
  background-color: #f8f9fa;
  border-top: 1px solid #dee2e6;
  padding: 1rem 1.25rem;
  flex-shrink: 0;
  margin-top: auto;
}

.dropdown-menu {
  border: none;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
  border-radius: 8px;
}

.dropdown-item {
  padding: 0.75rem 1rem;
  border: none;
  background: none;
  width: 100%;
  text-align: left;
  transition: all 0.2s ease;
}

.dropdown-item:hover {
  background-color: #f8f9fa;
  color: #495057;
}

.dropdown-item i {
  width: 16px;
}

/* Responsive adjustments */
@media (max-width: 768px) {
  .info-grid {
    gap: 0.75rem;
  }

  .info-item {
    gap: 0.5rem;
  }

  .card-title {
    font-size: 1rem;
  }
}
</style>
