<template>
  <div
    class="modal fade"
    tabindex="-1"
    ref="mainModalRef"
    id="main-modal"
    aria-hidden="true"
  >
    <div class="modal-dialog modal-dialog-centered modal-lg">
      <div class="modal-content">
        <div class="modal-header" v-if="!isLoading">
          <h3 class="modal-title">ประวัติการดำเนินการ</h3>
          <button
            @click="onClose({ reload: false })"
            type="button"
            class="btn-close"
            data-bs-dismiss="modal"
            aria-label="Close"
          ></button>
        </div>

        <div class="modal-body" v-if="!isLoading">
          <!-- Timeline Section -->
          <div class="bg-light p-4 border-bottom">
            <h5 class="text-primary mb-3">
              <i class="bi bi-timeline me-2"></i>
              เส้นทางการดำเนินงาน
            </h5>

            <div v-if="item" class="timeline">
              <div class="timeline-item completed">
                <div class="timeline-marker bg-success">
                  <i class="bi bi-send text-white"></i>
                </div>
                <div class="timeline-content">
                  <div class="timeline-date">
                    {{ convertDate(item.sended_at) }}
                  </div>
                  <div class="timeline-title">ส่งข้อเสนอโครงการ</div>
                </div>
              </div>

              <div v-if="item.approved_at" class="timeline-item completed">
                <div class="timeline-marker bg-info">
                  <i class="bi bi-check-circle text-white"></i>
                </div>
                <div class="timeline-content">
                  <div class="timeline-date">
                    {{ convertDate(item.approved_at) }}
                  </div>
                  <div class="timeline-title">พิจารณาข้อเสนอ</div>
                </div>
              </div>
            </div>
          </div>
          <!-- <div class="row">
            <table
              v-if="item"
              class="table table-bordered table-striped bg-sky"
            >
              <thead class="bg-warning">
                <tr>
                  <th class="text-center">วันที่</th>
                  <th class="text-center">การดำเนินการ</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td class="text-center">{{ convertDate(item.sended_at) }}</td>
                  <td class="text-center">ส่งข้อเสนอโครงการ</td>
                </tr>
                <tr v-if="item.approved_at">
                  <td class="text-center">
                    {{ convertDate(item.approved_at) }}
                  </td>
                  <td class="text-center">พิจารณาข้อเสนอ</td>
                </tr>
              </tbody>
            </table>
          </div> -->

          <h3 class="mt-6 mb-6">รายละเอียดที่ต้องดำเนินการแก้ไข</h3>
          <div class="row">
            <table class="table table-bordered table-striped bg-sky">
              <thead class="bg-warning">
                <tr>
                  <th class="text-center">วันที่</th>
                  <th class="text-center">สถานะ</th>
                  <th class="text-center">รายละเอียด</th>
                </tr>
              </thead>
              <tbody v-if="history_items.length != 0">
                <tr v-for="(it, idx) in history_items" :key="idx">
                  <td class="text-center">{{ convertDate(it.date_at) }}</td>
                  <td class="text-center">{{ it.status_name }}</td>
                  <td>{{ it.detail }}</td>
                </tr>
              </tbody>
              <tbody v-else>
                <tr>
                  <td colspan="3" class="text-center">
                    <div class="no-data-content">
                      <i class="bi bi-inbox fs-1 text-muted mb-3"></i>
                      <p class="text-muted mb-0">ไม่มีประวัติการส่งกลับแก้ไข</p>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <div class="text-center mt-6">
            <button
              @click="onClose({ reload: false })"
              type="button"
              class="btn btn-danger me-2 mt-6"
            >
              ปิด
            </button>
          </div>
        </div>
        <Preloader :isLoading="isLoading" :position="'absolute'" />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import {
  defineComponent,
  ref,
  reactive,
  onMounted,
  onUnmounted,
  toRefs,
} from "vue";
import ApiService from "@/core/services/ApiService";
// Import Modal Bootstrap
import { Modal } from "bootstrap";

// Use Composables
import Preloader from "@/components/preloader/Preloader.vue";
import useDateData from "@/composables/useDateData";

export default defineComponent({
  name: "history-paper-detail-modal",
  props: {
    paper_id: {
      type: Number,
      required: true,
    },
  },
  components: {
    Preloader,
  },
  setup(props, { emit }) {
    // UI
    const isLoading = ref<any>(true);
    const mainModalRef = ref<any>(null);
    const mainModalObj = ref<any>(null);

    // Variable
    const { paper_id } = toRefs(props);

    const history_items = ref<any>([]);

    const items = reactive<any>([]);
    const item = reactive<any>([]);

    const fetchItems = async () => {
      try {
        const { data } = await ApiService.query("return-paper/", {
          params: { paper_id: paper_id.value, perPage: 100 },
        });

        Object.assign(items, data.data);
        items.forEach((el: any) => {
          history_items.value.push({
            date_at: el.created_at,
            status_name: "ส่งกลับให้แก้ไข",
            detail: el.detail,
          });
        });

        if (item.status_id == 4 || item.status_id == 5) {
          history_items.value.push({
            date_at: item.approved_at,
            status_name: item.status_id == 5 ? "ตอบรับข้อเสนอ" : "ยกเลิก",
            detail: item.approved_detail,
          });
        }
      } catch (error) {
        console.log(error);
      }
    };

    const fetchItem = async () => {
      try {
        const { data } = await ApiService.query("paper/" + paper_id.value, {});
        Object.assign(item, {
          ...data.data,
          department_id:
            data.data.department_id != null
              ? {
                  name: data.data.department.name,
                  id: data.data.department_id,
                }
              : null,
          paper_type_id:
            data.data.paper_type_id != null
              ? {
                  name: data.data.paper_type.name,
                  id: data.data.paper_type_id,
                }
              : null,
        });
      } catch (error) {
        console.log(error);
      }
    };

    // Event
    const onClose = ({ reload = false }: { reload?: boolean }) => {
      mainModalObj.value.hide();
      if (reload === true) {
        emit("reload");
      }
      emit("close-modal");
    };

    // Mounted
    onMounted(async () => {
      mainModalObj.value = new Modal(mainModalRef.value, {});
      mainModalObj.value.show();
      mainModalRef.value.addEventListener("hidden.bs.modal", () =>
        onClose({ reload: false })
      );
      await fetchItem();
      await fetchItems();

      // ทำ Log ไว้ดีกว่า
      //   if (item.value.status > 1) {
      //     history_items.value[0] = {
      //       date_at: item.value.sended_at,
      //       status_name: 'ส่งข้อเสนอโครงการ'
      //     };

      //     // history_items.value[0] = {
      //     //   date_at: item.value.sended_at,
      //     // };
      //   } else {
      //     history_items.value = [];
      //   }

      isLoading.value = false;
    });

    onUnmounted(() => {
      if (mainModalRef.value) {
        mainModalRef.value.addEventListener("hidden.bs.modal", () =>
          onClose({ reload: false })
        );
      }
      mainModalObj.value.hide();
      emit("close-modal");
    });
    // Return
    return {
      isLoading,
      mainModalRef,
      convertDate: useDateData().convertDate,
      onClose,
      history_items,
      item,
    };
  },
});
</script>

<style scoped>
.separator.separator-dotted {
  border-bottom-color: #ccc;
}
th {
  vertical-align: middle;
}

/* Timeline Styles */
.timeline {
  position: relative;
  padding-left: 30px;
}

.timeline::before {
  content: "";
  position: absolute;
  left: 15px;
  top: 0;
  bottom: 0;
  width: 2px;
  background: #dee2e6;
}

.timeline-item {
  position: relative;
  margin-bottom: 20px;
}

.timeline-marker {
  position: absolute;
  left: -22px;
  top: 5px;
  width: 30px;
  height: 30px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 2px solid #fff;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.timeline-content {
  background: #fff;
  padding: 15px;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
  border: 1px solid #e9ecef;
}

.timeline-date {
  font-size: 0.875rem;
  color: #6c757d;
  margin-bottom: 5px;
}

.timeline-title {
  font-weight: 600;
  color: #495057;
}

/* Table Styles */
.table-hover tbody tr:hover {
  background-color: rgba(0, 123, 255, 0.05);
}

.detail-text {
  line-height: 1.5;
  word-wrap: break-word;
}

/* Empty State */
.empty-state {
  padding: 2rem;
}

/* Responsive */
@media (max-width: 768px) {
  .modal-dialog {
    margin: 10px;
  }

  .timeline {
    padding-left: 20px;
  }

  .timeline-marker {
    left: -15px;
    width: 25px;
    height: 25px;
  }

  .timeline::before {
    left: 10px;
  }
}

/* Badge adjustments */
.badge {
  font-size: 0.75rem;
  padding: 0.375rem 0.75rem;
}
</style>
