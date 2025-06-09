<template>
  <div>
    <div class="row ps-5 pe-5 ps-md-0 pe-md-0">
      <!-- Year Selection -->
      <div class="col-12 col-md-2 my-2">
        <v-select
          id="slt-search-year"
          name="slt-search-year"
          label="name"
          placeholder="ปีที่เสนอ"
          :options="selectOptions.years"
          v-model="search.year"
          :reduce="(year: any) => year.value"
          class="form-control"
          :clearable="true"
          aria-label="เลือกปีที่เสนอ"
        ></v-select>
      </div>

      <!-- Project Code Input -->
      <div class="col-12 col-md-2 my-2">
        <input
          type="text"
          id="txt-search-project-code"
          name="txt-search-project-code"
          class="form-control"
          v-model="search.rp_no"
          placeholder="รหัสโครงการ"
          aria-label="ป้อนรหัสโครงการ"
          maxlength="50"
        />
      </div>

      <!-- Project Title Input -->
      <div class="col-12 col-md-4 my-2">
        <input
          type="text"
          id="txt-search-projct-title"
          name="txt-search-project-title"
          class="form-control"
          v-model="search.title_th"
          placeholder="ชื่อโครงการ"
          aria-label="ป้อนชื่อโครงการ"
          maxlength="255"
        />
      </div>

      <!-- Action Buttons -->
      <div class="col-12 col-md-4 div-btn-search d-flex align-items-center">
        <button
          class="btn btn-success fw-bold"
          @click="handleSearch"
          :disabled="isSearching"
          aria-label="ค้นหาข้อมูล"
        >
          <span
            v-if="isSearching"
            class="spinner-border spinner-border-sm me-2"
            role="status"
            aria-hidden="true"
          ></span>
          ค้นหา
        </button>
        <button
          type="button"
          class="btn btn-danger ms-2 fw-bold"
          @click="handleClear"
          :disabled="isSearching"
          aria-label="ล้างข้อมูลการค้นหา"
        >
          ล้าง
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, toRefs } from "vue";
// Import Vue-select
import vSelect from "vue-select";
import "vue-select/dist/vue-select.css";
// Import Dayjs
import dayjs from "dayjs";
import "dayjs/locale/th";
import buddhistEra from "dayjs/plugin/buddhistEra";
dayjs.extend(buddhistEra);

// Constants
const YEAR_RANGE = 5;
const BUDDHIST_YEAR_OFFSET = 543;
const PER_PAGE_OPTIONS: any = [
  { title: "20", value: 20 },
  { title: "40", value: 40 },
  { title: "60", value: 60 },
];

// Props
const props = defineProps({
  search: { type: Object, required: true },
  isSearching: { type: Boolean, default: false },
});

// Emits
const emit = defineEmits<{
  search: [];
  clear: [];
}>();

// Reactive references
const { search, isSearching } = toRefs(props);

// Generate year options
const generateYearOptions = (): any => {
  const currentYear = new Date().getFullYear();
  const years: any = [];

  // Add years from current year backwards
  for (let i = 0; i <= YEAR_RANGE; i++) {
    const year = currentYear - i;
    years.push({
      name: year + BUDDHIST_YEAR_OFFSET,
      value: year,
    });
  }

  // Add "ทั้งหมด" option
  years.push({
    name: "ทั้งหมด",
    value: null,
  });

  return years;
};

// Reactive data
const selectOptions = ref<any>({
  years: generateYearOptions(),
  perPage: PER_PAGE_OPTIONS,
});

// Event handlers
const handleSearch = (): void => {
  emit("search");
};

const handleClear = (): void => {
  emit("clear");
};

defineOptions({
  name: "SearchPaper",
});
</script>

<style scoped>
.div-btn-search {
  gap: 0.5rem;
}

@media only screen and (max-width: 767px) {
  .div-btn-search {
    justify-content: center;
    margin-top: 1rem;
  }

  .div-btn-search .btn {
    flex: 1;
    max-width: 120px;
  }
}

/* Loading spinner animation */
.spinner-border-sm {
  width: 1rem;
  height: 1rem;
}
</style>
