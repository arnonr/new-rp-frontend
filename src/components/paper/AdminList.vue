<template>
  <div class="paper-list-container">
    <!-- Table -->
    <div class="table-wrapper table-responsive">
      <table class="table custom-table" style="min-height: 200px">
        <thead class="table-header">
          <tr>
            <th
              v-for="(column, idx) in headerColumns"
              :key="idx"
              :class="[
                'text-center text-white fw-bold',
                { 'cursor-pointer': column.sortable },
              ]"
              @click="column.sortable ? handleSort(column.key) : undefined"
            >
              <div class="d-flex align-items-center justify-content-center">
                <span>{{ column.title }}</span>
                <i
                  v-if="column.sortable"
                  :class="getSortIcon(column.key)"
                  class="sort-icon ms-2"
                ></i>
              </div>
            </th>
          </tr>
        </thead>

        <tbody v-if="items.length > 0" class="table-body">
          <tr v-for="(item, idx) in items" :key="idx" class="table-row">
            <td class="text-center">
              <div class="date-cell">
                {{ formatDate(item.sended_at) }}
              </div>
            </td>

            <td class="text-center">
              <span class="code-badge">{{ item.rp_no }}</span>
            </td>

            <td class="title-cell">
              <div class="title-content">
                {{ item.title_th }}
              </div>
            </td>

            <td class="text-center">
              {{ item.user.prefix_name }} {{ item.user.firstname }}
              {{ item.user.surname }}
            </td>

            <td class="text-center">
              <span class="department-name">{{ item.department?.name }}</span>
            </td>

            <td class="text-center">
              <span class="type-badge">{{ item.paper_type?.name }}</span>
            </td>

            <td class="text-center">
              {{ item.review.length }}
            </td>

            <td class="text-center">
              {{ showReviewSuccess(item.review) }}
            </td>

            <td class="text-center">
              <StatusBadge :status="getStatus(item.status_id)" />
            </td>

            <!-- Actions -->
            <td class="text-center">
              <div class="action-dropdown">
                <button
                  class="btn btn-action dropdown-toggle"
                  type="button"
                  :id="`dropdown-${item.id}`"
                  data-bs-toggle="dropdown"
                  aria-expanded="false"
                >
                  <i class="bi bi-gear-fill me-2"></i>
                  <span class="d-none d-lg-inline">จัดการ</span>
                </button>
                <ul
                  class="dropdown-menu shadow-lg position-absolute"
                  :aria-labelledby="`dropdown-${item.id}`"
                >
                  <li>
                    <a
                      class="dropdown-item dropdown-item-custom"
                      @click="handleDetail(item)"
                    >
                      <i class="bi bi-eye me-2 text-primary"></i>
                      รายละเอียด
                    </a>
                  </li>

                  <li v-if="item.status_id > 1">
                    <a
                      class="dropdown-item dropdown-item-custom"
                      @click="handleHistoryDetail(item)"
                    >
                      <i class="bi bi-clock-history me-2 text-warning"></i>
                      ประวัติการดำเนินการ
                    </a>
                  </li>

                  <li>
                    <hr class="dropdown-divider" />
                    <a
                      class="dropdown-item dropdown-item-custom"
                      @click="handleEdit(item)"
                    >
                      <i class="bi bi-pencil-square me-2 text-success"></i>
                      แก้ไขข้อมูล
                    </a>
                  </li>

                  <li>
                    <hr class="dropdown-divider" />
                    <a
                      class="dropdown-item dropdown-item-custom"
                      @click="handleReject(item)"
                    >
                      <i class="bi bi-send-exclamation me-2 text-success"></i>
                      ส่งกลับให้แก้ไข
                    </a>
                  </li>

                  <li>
                    <hr class="dropdown-divider" />
                    <a
                      class="dropdown-item dropdown-item-custom"
                      @click="handleManageReview(item)"
                    >
                      <i class="bi bi-person-lines-fill me-2 text-success"></i>
                      รายการกรรมการ
                    </a>
                  </li>

                  <li>
                    <hr class="dropdown-divider" />
                    <a
                      class="dropdown-item dropdown-item-custom"
                      @click="handleApprove(item)"
                    >
                      <i class="bi bi-check2-square me-2 text-success"></i>
                      ยกเลิก/ตอบรับข้อเสนอ
                    </a>
                  </li>
                </ul>
              </div>
            </td>
          </tr>
        </tbody>

        <tbody v-else>
          <tr>
            <td :colspan="headerColumns.length" class="no-data-cell">
              <div class="no-data-content">
                <i class="bi bi-inbox fs-1 text-muted mb-3"></i>
                <p class="text-muted mb-0">ไม่พบข้อมูล</p>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Pagination -->
    <div class="pagination-wrapper">
      <BlogPagination
        :perPage="paginationData.perPage"
        :totalItems="paginationData.totalItems"
        :totalPage="paginationData.totalPage"
        :currentPage="paginationData.currentPage"
        @update:currentPage="updateCurrentPage"
        @update:perPage="updatePerPage"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import dayjs from "dayjs";
import "dayjs/locale/th";
import buddhistEra from "dayjs/plugin/buddhistEra";

// Components
import BlogPagination from "@/components/common/pagination/BlogPagination.vue";
import StatusBadge from "@/components/badge/Status.vue";

// Composables
import useStatusData from "@/composables/useStatusData";
import useDateData from "@/composables/useDateData";

dayjs.extend(buddhistEra);

// Props
const props = defineProps({
  items: { type: Array as () => any[], required: true },
  paginationData: { type: Object, required: true },
  sortKey: { type: String, required: true },
  sortOrder: { type: Number, required: true },
});

// Emits
const emit = defineEmits([
  "detail",
  "edit",
  "history-detail",
  "sort",
  "reject",
  "approve",
  "cancel",
  "manage-review",
  "update:currentPage",
  "update:perPage",
]);

// Data
const { statuses } = useStatusData();

// Table columns configuration
const headerColumns = [
  { key: "sended_at", title: "วันที่เสนอ", sortable: true },
  { key: "rp_no", title: "รหัสโครงการ", sortable: true },
  { key: "title_th", title: "ชื่อโครงการ (TH)", sortable: true },
  { key: "fullname", title: "ผู้ส่ง", sortable: true },
  { key: "department_id", title: "หน่วยงาน", sortable: true },
  { key: "paper_type_id", title: "ประเภททุนวิจัย", sortable: true },
  { column_name: "review", title: "กรรมการ", sort: true },
  { column_name: "review_status", title: "การประเมิน", sort: true },
  { column_name: "status_id", title: "สถานะ", sort: true },
  { key: "actions", title: "จัดการข้อมูล", sortable: false },
];

// Computed
const getSortIcon = computed(() => (key: string) => {
  if (props.sortKey !== key) return "";
  return props.sortOrder === 1 ? "fa fa-sort-up" : "fa fa-sort-down";
});

// Methods
const formatDate = (date: string) => {
  return useDateData().convertDate(date);
};

const getStatus = (statusId: number) => {
  return (
    statuses.find((status: any) => status.id === statusId) || {
      name_th: "ไม่ทราบสถานะ",
      bg_color: "#6c757d",
    }
  );
};

const handleDetail = (item: any) => {
  emit("detail", { id: item.id, complainant_id: item.complainant_id });
};

const handleEdit = (item: any) => {
  emit("edit", { id: item.id });
};

const handleReject = (item: any) => {
  emit("reject", item);
};

const handleApprove = (item: any) => {
  emit("approve", item);
};

const handleManageReview = (item: any) => {
  emit("manage-review", item);
};

const handleHistoryDetail = (item: any) => {
  emit("history-detail", { id: item.id });
};

const handleSort = (key: string) => {
  emit("sort", key);
};

const showReviewSuccess = (rv: any) => {
  let rv_success = rv.filter((x: any) => {
    return x.review_status != 1;
  });

  return rv_success.length;
};

const updateCurrentPage = (page: number) => {
  emit("update:currentPage", page);
};

const updatePerPage = (perPage: number) => {
  emit("update:perPage", perPage);
};

defineOptions({
  name: "AdminPaperList",
});
</script>

<style scoped>
.paper-list-container {
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
}

.custom-table {
  border-collapse: collapse;
  width: 100%;
}
.custom-table,
.custom-table th,
.custom-table td {
  border: 1px solid black;
}

/* Table Header */
.custom-table .table-header {
  background: linear-gradient(135deg, #1e3c72 0%, #2a5298 100%);
  position: sticky;
  top: 0;
  z-index: 10;
}

.custom-table .table-header th {
  padding: 16px 12px;
  vertical-align: middle;
  font-weight: 600;
  letter-spacing: 0.5px;
  text-transform: uppercase;
  font-size: 0.9rem;
  position: relative;
  transition: all 0.3s ease;
}

.custom-table .table-header th:hover {
  background: rgba(255, 255, 255, 0.1);
}
/* End Table Header */

/* Table Body */
.custom-table .table-body td {
  padding: 12px;
  vertical-align: middle;
  transition: all 0.2s ease;
}

.table-row {
  transition: all 0.2s ease;
}
.table-row:hover {
  background-color: #eee;
}

/* Cell */
.date-cell {
  font-weight: 500;
  color: #495057;
  background: #e3f2fd;
  padding: 6px 12px;
  border-radius: 20px;
  display: inline-block;
  min-width: 100px;
}

.code-badge {
  background: linear-gradient(135deg, #ff6b6b, #ee5a24);
  color: white;
  padding: 6px 12px;
  border-radius: 20px;
  font-weight: 600;
  font-size: 0.8rem;
  display: inline-block;
  min-width: 80px;
}

.title-cell {
  max-width: 300px;
}

.title-content {
  font-weight: 500;
  color: #2c3e50;
  line-height: 1.4;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.department-name {
  color: #6c757d;
  font-weight: 500;
  background: #f1f3f4;
  padding: 4px 8px;
  border-radius: 12px;
  font-size: 0.85rem;
}

.type-badge {
  background: linear-gradient(135deg, #74b9ff, #0984e3);
  color: white;
  padding: 6px 12px;
  border-radius: 20px;
  font-weight: 500;
  font-size: 0.8rem;
  display: inline-block;
}

.sort-icon {
  font-size: 0.9rem;
  opacity: 0.8;
  transition: all 0.2s ease;
}

.cursor-pointer:hover .sort-icon {
  opacity: 1;
  transform: scale(1.1);
}

.no-data-cell {
  border: 2px solid #333;
  padding: 60px 20px;
  text-align: center;
}

.no-data-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.pagination-wrapper {
  padding: 20px;
  background: #f8f9fa;
}

.dropdown-menu li {
  cursor: pointer;
}

/* Animation for table loading */
</style>
