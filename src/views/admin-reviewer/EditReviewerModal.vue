<template>
  <div
    class="modal fade"
    tabindex="-1"
    ref="mainModalRef"
    id="main-modal"
    aria-hidden="true"
  >
    <div class="modal-dialog modal-dialog-centered modal-xl">
      <div class="modal-content">
        <div class="modal-header">
          <h3 class="modal-title">แบบฟอร์มแก้ไขข้อมูลกรรมการ</h3>
          <button
            @click="onClose({ reload: false })"
            type="button"
            class="btn-close"
            data-bs-dismiss="modal"
            aria-label="Close"
          ></button>
        </div>

        <div class="modal-body">
          <div class="form row">
            <!-- <div class="mb-7 col-12 col-lg-12">
              <label class="form-label required">ตำแหน่งทางวิชาการ</label>
              <input
                type="text"
                class="form-control"
                placeholder="ตำแหน่งทางวิชาการ"
                aria-label="ตำแหน่งทางวิชาการ"
                v-model="item_edit.position"
              />
            </div> -->
            <div class="mb-7 col-12 col-lg-12">
              <label class="form-label required">ตำแหน่งทางวิชาการ</label>
              <input
                type="text"
                class="form-control"
                placeholder="ตำแหน่งทางวิชาการ"
                aria-label="ตำแหน่งทางวิชาการ"
                v-model="item_edit.prefix_name"
              />
            </div>
            <div class="mb-7 col-12 col-lg-12">
              <label for="firstname" class="required form-label">ชื่อ</label>
              <input
                type="text"
                class="form-control"
                placeholder="ชื่อ"
                aria-label="ชื่อ"
                v-model="item_edit.firstname"
              />
            </div>
            <div class="mb-7 col-12 col-lg-12">
              <label for="surname" class="required form-label">นามสกุล</label>
              <input
                type="text"
                class="form-control"
                placeholder="นามสกุล"
                aria-label="นามสกุล"
                v-model="item_edit.surname"
              />
            </div>
            <div class="mb-7 col-12 col-lg-12">
              <label for="email" class="required form-label">อีเมล</label>
              <input
                type="text"
                class="form-control"
                placeholder="อีเมล"
                aria-label="อีเมล"
                v-model="item_edit.email"
              />
            </div>
            <div class="mb-7 col-12 col-lg-12">
              <label for="department_id" class="form-label required"
                >หน่วยงาน</label
              >
              <input
                type="text"
                class="form-control"
                placeholder="นามสกุล"
                aria-label="นามสกุล"
                v-model="item_edit.organization_name"
              />
            </div>

            <div class="mb-7 col-12 col-lg-12">
              <label class="form-label required"
                >ที่อยู่ตามบัตรประชาชน (โปรดระบุข้อมูลให้ครบถ้วน บ้านเลขที่
                จังหวัด อำเภอ ตำบล รหัสไปรษณีย์)</label
              >
              <input
                type="text"
                class="form-control"
                placeholder="โปรดระบุข้อมูลให้ครบถ้วน บ้านเลขที่ จังหวัด อำเภอ ตำบล รหัสไปรษณีย์"
                aria-label="ที่อยู่ตามบัตรประชาชน"
                v-model="item_edit.address"
              />
            </div>

            <div class="mb-7 col-12 col-lg-12">
              <label class="form-label required">ชื่อธนาคาร</label>
              <input
                type="text"
                class="form-control"
                placeholder=""
                aria-label="ชื่อธนาคาร"
                v-model="item_edit.name_bank"
              />
            </div>

            <div class="mb-7 col-12 col-lg-12">
              <label class="form-label required">ชื่อบัญชีธนาคาร</label>
              <input
                type="text"
                class="form-control"
                placeholder=""
                aria-label="ชื่อบัญชีธนาคาร"
                v-model="item_edit.name_account_bank"
              />
            </div>

            <div class="mb-7 col-12 col-lg-12">
              <label class="form-label required">เลขที่บัญชีธนาคาร</label>
              <input
                type="text"
                class="form-control"
                placeholder=""
                aria-label="เลขที่บัญชีธนาคาร"
                v-model="item_edit.no_account_bank"
              />
            </div>
          </div>

          <div class="mx-auto text-center mt-5">
            <button
              @click="onClose({ reload: false })"
              type="button"
              class="btn btn-danger me-2"
            >
              ยกเลิก
            </button>
            <button @click="onSubmit" type="button" class="btn btn-success">
              ยืนยัน
            </button>
          </div>
        </div>
        <Preloader :isLoading="isLoading" :position="'absolute'" />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted, onUnmounted, toRefs } from "vue";
// Import Modal Bootstrap
import { Modal } from "bootstrap";
import ApiService from "@/core/services/ApiService";
// Use Toast Composables
import useToast from "@/composables/useToast";
import _ from "lodash";

// Use Composables
import useUserStatusData from "@/composables/useUserStatusData";
import Preloader from "@/components/preloader/Preloader.vue";

export default defineComponent({
  name: "edit-reviwer-modal",
  props: {
    item: {
      type: Object,
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
    const { item } = toRefs(props);
    const item_edit = ref<any>({});
    const selectOptions = ref<any>({
      statuses: useUserStatusData().statuses,
    });

    // Fetch Data
    const fetchItems = async () => {
      isLoading.value = true;
      const { data } = await ApiService.query(`reviewer/${item.value.id}`, {});
      item_edit.value = {
        ...data.data,
      };

      item_edit.value.is_active = useUserStatusData().statuses.find(
        (x: any) => {
          return x.id == data.data.is_active;
        }
      );

      isLoading.value = false;
    };
    // Event
    const onClose = ({ reload = false }: { reload?: boolean }) => {
      mainModalObj.value.hide();
      if (reload === true) {
        emit("reload");
      }
      emit("close-modal");
    };

    const onSubmit = async () => {
      isLoading.value = true;
      console.log(item_edit.value);

      if (
        item_edit.value.prefix_name == null ||
        item_edit.value.prefix_name == "" ||
        item_edit.value.firstname == null ||
        item_edit.value.firstname == "" ||
        item_edit.value.surname == null ||
        item_edit.value.surname == "" ||
        item_edit.value.organization_name == null ||
        item_edit.value.organization_name == "" ||
        item_edit.value.email == null ||
        item_edit.value.email == "" ||
        item_edit.value.address == null ||
        item_edit.value.address == "" ||
        item_edit.value.name_bank == null ||
        item_edit.value.name_bank == "" ||
        item_edit.value.name_account_bank == null ||
        item_edit.value.name_account_bank == "" ||
        item_edit.value.no_account_bank == null ||
        item_edit.value.no_account_bank == ""
      ) {
        useToast("กรุณากรอกข้อมูลส่วนตัวให้ครบถ้วน", "error");
        isLoading.value = false;
        return;
      }

      let data_item = {
        ...item_edit.value,
        is_active: item_edit.value.is_active?.id,
      };

      await ApiService.put("reviewer/" + item_edit.value.id, data_item)
        .then(({ data }) => {
          if (data.msg != "success") {
            throw new Error("ERROR");
          }
          isLoading.value = false;
          useToast("แก้ไขข้อมูลเสร็จสิ้น", "success");
          emit("reload");
          emit("close-modal");
        })
        .catch(({ response }) => {
          isLoading.value = false;
          console.log(response);
        });
    };

    onMounted(async () => {
      await fetchItems();
      mainModalObj.value = new Modal(mainModalRef.value, {});
      mainModalObj.value.show();
      mainModalRef.value.addEventListener("hidden.bs.modal", () =>
        onClose({ reload: false })
      );
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
      onClose,
      onSubmit,
      selectOptions,
      item_edit,
    };
  },
});
</script>

<style scoped>
.separator.separator-dotted {
  border-bottom-color: #ccc;
}

.w-10 {
  max-width: 10%;
}

.w-60 {
  min-width: 60%;
}
</style>
