<template>
  <div class="card shadow-sm my-5">
    <div class="card-header bg-warning">
      <h4 class="card-title">ข้อมูลส่วนตัว</h4>
    </div>
    <div class="card-body row">
      <div class="col-md-12 px-5 py-3">
        <span class="fw-bold">ชื่อ-นามสกุล : </span>
        <span class="fst-italic">{{ fullName }}</span>
        <div class="separator separator-dotted my-2"></div>
      </div>

      <div class="col-md-12 px-5 py-3">
        <span class="fw-bold">หน่วยงาน : </span>
        <span class="fst-italic">{{ departmentName }}</span>
      </div>

      <div class="separator separator-dotted my-2"></div>

      <div class="col-md-12 mt-3 text-end">
        <button
          type="button"
          class="btn btn-primary me-2 pe-sm-3 ps-sm-5"
          @click="$emit('editUser')"
          aria-label="แก้ไขข้อมูลส่วนตัว"
        >
          <i class="fa fa-edit"></i>
          <span class="d-none d-lg-inline-block">แก้ไข</span>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";

interface User {
  prefix_name?: string;
  firstname?: string;
  surname?: string;
  department?: {
    name?: string;
  };
}

const props = defineProps<{
  user: User;
}>();

const fullName = computed(() => {
  const prefix = props.user.prefix_name || "";
  const first = props.user.firstname || "";
  const last = props.user.surname || "";
  return `${prefix}${first} ${last}`.trim();
});

const departmentName = computed(() => {
  return props.user.department?.name || "";
});

defineOptions({
  name: "ProfileCard",
});
</script>
