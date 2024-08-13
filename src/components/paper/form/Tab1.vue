<template>
  <tab-content :title="`ลำดับที่ 1`" :before-change="onTab1Validate">
    <div class="row">
      <div class="mb-7 col-12 col-lg-12">
        <label for="paper_type_id" class="required form-label"
          >ประเภทงานวิจัย</label
        >
        <v-select
          name="paper_type_id"
          label="name"
          placeholder="ประเภทงานวิจัย"
          :options="selectOptions.paper_types"
          class="form-control"
          :clearable="false"
          v-model="item.paper_type_id"
        >
        </v-select>
      </div>

      <div class="mb-7 col-12 col-lg-12">
        <label for="paper_type_id" class="required form-label"
          >ลักษณะงานวิจัย</label
        >
        <v-select
          name="paper_kind_id"
          label="name"
          placeholder="ลักษณะงานวิจัย"
          :options="selectOptions.paper_kinds"
          class="form-control"
          :clearable="false"
          v-model="item.paper_kind_id"
        >
        </v-select>
      </div>

      <div class="mb-7 col-12 col-lg-12">
        <label for="title_th" class="required form-label"
          >ชื่อโครงการ ภาษาไทย</label
        >
        <input
          type="text"
          class="form-control"
          :placeholder="`ชื่อโครงการ ภาษาไทย`"
          :aria-label="`ชื่อโครงการ ภาษาไทย`"
          v-model="item.title_th"
        />
      </div>

      <div class="mb-7 col-12 col-lg-12">
        <label for="title_en" class="required form-label"
          >ชื่อโครงการ ภาษาอังกฤษ</label
        >
        <input
          type="text"
          class="form-control"
          :placeholder="`ชื่อโครงการ ภาษาอังกฤษ`"
          :aria-label="`ชื่อโครงการ ภาษาอังกฤษ`"
          v-model="item.title_en"
        />
      </div>

      <div class="mb-7 col-12 col-lg-12">
        <label for="abstract" class="required form-label"
          >บทคัดย่อ (Abstract)</label
        >
        <textarea
          ref="froalaTextareaAbstract"
          v-model="item.abstract"
        ></textarea>
      </div>

      <div class="mb-7 col-12 col-lg-12">
        <label for="keyword" class="form-label">Keyword</label>
        <vue3-tags-input
          :tags="tags"
          placeholder=""
          @on-tags-changed="handleChangeTag"
        />
      </div>

      <div class="mb-7 col-12 col-lg-12">
        <label for="department_id" class="required form-label">ภาควิชา</label>
        <v-select
          name="department_id"
          label="name"
          placeholder="ภาควิชา"
          :options="selectOptions.departments"
          class="form-control"
          :clearable="false"
          v-model="item.department_id"
        >
        </v-select>
      </div>

      <div class="mb-7 col-12 col-lg-12">
        <label for="history" class="required form-label"
          >ความเป็นมาและความสำคัญของปัญหาการวิจัยที่ทำ</label
        >
        <textarea ref="froalaTextareaHistory" v-model="item.history"></textarea>
      </div>

      <div class="mb-7 col-12 col-lg-12">
        <label for="objective" class="required form-label"
          >วัตถุประสงค์ของโครงการวิจัย</label
        >
        <textarea
          ref="froalaTextareaObjective"
          v-model="item.objective"
        ></textarea>
      </div>

      <div class="mb-7 col-12 col-lg-12">
        <label for="scope" class="required form-label">ขอบเขตของการวิจัย</label>
        <textarea ref="froalaTextareaScope" v-model="item.scope"></textarea>
      </div>

      <div class="mb-7 col-12 col-lg-12">
        <label for="review_literature" class="required form-label"
          >ผลงานวิจัยที่เกี่ยวข้อง (Review Literature)
          ระบุความเกี่ยวเนื่องสัมพันธ์หรือความแตกต่างของโครงการวิจัยเรื่องนี้กับโครงการวิจัยอื่นทั้งในประเทศและต่างประเทศที่ได้มีการวิจัยไว้แล้ว
          รวมถึงรายละเอียดผลการวิจัยที่เกี่ยวข้อง
          ต้องเขียนแสดงรายละเอียดจากผลการวิจัยเรื่องนั้นๆ
          ไม่ใช่การเขียนเอกสารอ้างอิงหรือบรรณานุกรม</label
        >
        <textarea
          ref="froalaTextareaReviewLiterature"
          v-model="item.review_literature"
        ></textarea>
      </div>

      <div class="mb-7 col-12 col-lg-12">
        <label for="method" class="required form-label"
          >ระเบียบวิธีวิจัย ให้อธิบายขั้นตอนในการดำเนินการทดลอง หรือทดสอบ
          โดยอธิบาย วิธีวิเคราะห์ข้อมูล อย่างละเอียด</label
        >
        <textarea ref="froalaTextareaMethod" v-model="item.method"></textarea>
      </div>

      <div class="mb-7 col-12 col-lg-12">
        <label for="benefit" class="required form-label"
          >ประโยชน์ที่คาดว่าจะได้รับ</label
        >
        <textarea ref="froalaTextareaBenefit" v-model="item.benefit"></textarea>
      </div>

      <div class="mb-7 col-12 col-lg-12">
        <label for="location" class="required form-label"
          >สถานที่ทำการทดลอง และ/หรือเก็บข้อมูล</label
        >
        <textarea
          ref="froalaTextareaLocation"
          v-model="item.location"
        ></textarea>
      </div>
    </div>
  </tab-content>
</template>

<script lang="ts">
import {
  defineComponent,
  ref,
  onMounted,
  toRefs,
  onBeforeUnmount,
  getCurrentInstance,
} from "vue";
import ApiService from "@/core/services/ApiService";
// Import Vue-select
import vSelect from "vue-select";
import "vue-select/dist/vue-select.css";
// Import Datepicker
import VueDatePicker from "@vuepic/vue-datepicker";
import "@vuepic/vue-datepicker/dist/main.css";
// Import Dayjs
import dayjs from "dayjs";
import "dayjs/locale/th";
import buddhistEra from "dayjs/plugin/buddhistEra";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
dayjs.extend(buddhistEra);
dayjs.extend(utc);
dayjs.extend(timezone);
// Import FormWizard
import { TabContent } from "vue3-form-wizard";
// Vue3 Tags
import Vue3TagsInput from "vue3-tags-input";
// import "@wiris/mathtype-froala3/wiris.js"

// Use Composables
import useMasterData from "@/composables/useMasterData";
import useFroalaConfigData from "@/composables/useFroalaConfigData";

export default defineComponent({
  name: "paper-form-tab1",
  props: {
    item: {
      type: Object,
      required: true,
    },
  },
  components: {
    vSelect,
    VueDatePicker,
    dayjs,
    TabContent,
    Vue3TagsInput,
  },
  setup(props, { emit }) {
    // Variable
    const { item } = toRefs(props);
    const tags = ref<string[]>([]);

    const instance: any = getCurrentInstance();
    const FroalaEditor =
      instance.appContext.config.globalProperties.$FroalaEditor;

    const froalaTextareaAbstract = ref<any>(null);
    const froalaTextareaHistory = ref<any>(null);
    const froalaTextareaObjective = ref<any>(null);
    const froalaTextareaReviewLiterature = ref<any>(null);
    const froalaTextareaMethod = ref<any>(null);
    const froalaTextareaBenefit = ref<any>(null);
    const froalaTextareaLocation = ref<any>(null);
    const froalaTextareaScope = ref<any>(null);

    let froalaInstanceAbstract: any = null;
    let froalaInstanceHistory: any = null;
    let froalaInstanceObjective: any = null;
    let froalaInstanceReviewLiterature: any = null;
    let froalaInstanceMethod: any = null;
    let froalaInstanceBenefit: any = null;
    let froalaInstanceLocation: any = null;
    let froalaInstanceScope: any = null;

    let froalaConfig: any = {
      abstract: { ...useFroalaConfigData().froala_config, height: 600 },
      history: { ...useFroalaConfigData().froala_config, height: 600 },
      objective: { ...useFroalaConfigData().froala_config, height: 600 },
      review_literature: {
        ...useFroalaConfigData().froala_config,
        height: 600,
      },
      method: { ...useFroalaConfigData().froala_config, height: 600 },
      benefit: { ...useFroalaConfigData().froala_config, height: 600 },
      location: { ...useFroalaConfigData().froala_config, height: 600 },
      scope: { ...useFroalaConfigData().froala_config, height: 600 },
    };

    let textEditor = [
      "abstract",
      "history",
      "objective",
      "review_literature",
      "method",
      "benefit",
      "location",
      "scope",
    ];

    textEditor.forEach((x: any) => {
      froalaConfig[x]["events"] = {
        initialized: function () {
          this.html.set(item.value[x]);
          //   froalaInstance.html.set(item.value[x]);
        },
        contentChanged: function () {
          item.value[x] = this.html.get();
        },
      };
    });

    const selectOptions = ref({
      departments: <any>[],
      paper_types: <any>[],
      paper_kinds: <any>[],
    });

    // Event
    const onTab1Validate = async () => {
      return true;
    };

    const handleChangeTag = (tags: any) => {
      tags.value = tags;
      item.value.keyword = tags.value.join(",");
    };

    // Mounted
    onMounted(async () => {
      selectOptions.value.departments = await useMasterData().fetchDepartments({
        is_active: 1,
        perPage: 500,
      });

      selectOptions.value.paper_types = await useMasterData().fetchPaperTypes({
        is_active: 1,
        perPage: 500,
      });

      selectOptions.value.paper_kinds = await useMasterData().fetchPaperKinds({
        is_active: 1,
        perPage: 500,
      });

      if (item.value.keyword != null && item.value.keyword != "") {
        tags.value = [];
      } else {
        tags.value = item.value.keyword.split(",");
      }

      froalaInstanceAbstract = new FroalaEditor(froalaTextareaAbstract.value, {
        ...froalaConfig.abstract,
      });
      froalaInstanceHistory = new FroalaEditor(froalaTextareaHistory.value, {
        ...froalaConfig.history,
      });
      froalaInstanceObjective = new FroalaEditor(
        froalaTextareaObjective.value,
        {
          ...froalaConfig.objectiv,
        }
      );
      froalaInstanceReviewLiterature = new FroalaEditor(
        froalaTextareaReviewLiterature.value,
        {
          ...froalaConfig.review_literature,
        }
      );
      froalaInstanceMethod = new FroalaEditor(froalaTextareaMethod.value, {
        ...froalaConfig.method,
      });
      froalaInstanceBenefit = new FroalaEditor(froalaTextareaBenefit.value, {
        ...froalaConfig.benefit,
      });
      froalaInstanceLocation = new FroalaEditor(froalaTextareaLocation.value, {
        ...froalaConfig.location,
      });
      froalaInstanceScope = new FroalaEditor(froalaTextareaScope.value, {
        ...froalaConfig.scope,
      });
    });

    onBeforeUnmount(() => {
      if (froalaInstanceAbstract) {
        froalaInstanceAbstract.destroy(); // ทำลาย Froala Editor ก่อนที่จะลบคอมโพเนนต์
      }
      if (froalaInstanceHistory) {
        froalaInstanceHistory.destroy(); // ทำลาย Froala Editor ก่อนที่จะลบคอมโพเนนต์
      }
      if (froalaInstanceObjective) {
        froalaInstanceObjective.destroy(); // ทำลาย Froala Editor ก่อนที่จะลบคอมโพเนนต์
      }
      if (froalaInstanceReviewLiterature) {
        froalaInstanceReviewLiterature.destroy(); // ทำลาย Froala Editor ก่อนที่จะลบคอมโพเนนต์
      }
      if (froalaInstanceMethod) {
        froalaInstanceMethod.destroy(); // ทำลาย Froala Editor ก่อนที่จะลบคอมโพเนนต์
      }
      if (froalaInstanceBenefit) {
        froalaInstanceBenefit.destroy(); // ทำลาย Froala Editor ก่อนที่จะลบคอมโพเนนต์
      }
      if (froalaInstanceLocation) {
        froalaInstanceLocation.destroy(); // ทำลาย Froala Editor ก่อนที่จะลบคอมโพเนนต์
      }

      if (froalaInstanceScope) {
        froalaInstanceScope.destroy(); // ทำลาย Froala Editor ก่อนที่จะลบคอมโพเนนต์
      }
    });

    // Return
    return {
      selectOptions,
      tags,
      handleChangeTag,
      onTab1Validate,
      froalaTextareaAbstract,
      froalaTextareaHistory,
      froalaTextareaObjective,
      froalaTextareaReviewLiterature,
      froalaTextareaMethod,
      froalaTextareaBenefit,
      froalaTextareaLocation,
      froalaTextareaScope,
    };
  },
});
</script>

<style>
.fr-wrapper a[href*="froala.com/wysiwyg-editor"] {
  display: none !important;
}

p[data-f-id="pbf"] {
  display: none !important;
}
</style>
