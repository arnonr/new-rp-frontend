<template>
  <div>
    <div class="card" v-if="paper_id != null">
      <div class="card-body">
        <div class="row">
          <div class="mb-7 col-12 col-lg-12 text-end">
            <button
              class="btn btn-primary"
              type="button"
              data-bs-toggle="collapse"
              data-bs-target="#flush-collapseOne"
              aria-expanded="false"
              aria-controls="flush-collapseOne"
            >
              ดูข้อมูล
            </button>
          </div>

          <div class="mb-7 col-12 col-lg-12">
            <div class="accordion accordion-flush" id="accordionFlushExample">
              <div class="accordion-item">
                <div
                  id="flush-collapseOne"
                  class="accordion-collapse collapse"
                  aria-labelledby="flush-headingOne"
                  data-bs-parent="#accordionFlushExample"
                >
                  <div class="accordion-body" style="padding: 0">
                    <DetailPage v-if="paper_id" :paper_id="paper_id" :hide-reviewer-sections="true" />
                    <hr />
                  </div>
                </div>
              </div>
            </div>
          </div>
          <!--  -->
          <div class="form" v-if="item.id">
            <div class="mb-10 col-12 col-lg-12 text-center">
              <h3>แบบประเมินข้อเสนอโครงการทุนวิจัยคณะวิทยาศาสตร์ประยุกต์</h3>
              <h3>ทุนสนับสนุนนักวิจัยทั่วไป</h3>
            </div>
            <div class="mb-7 col-12 col-lg-12">
              <h4>
                ผู้ประเมิน :
                {{
                  item.reviewer.prefix_name +
                  item.reviewer.firstname +
                  " " +
                  item.reviewer.surname
                }}
              </h4>
              <h4>รหัสโครงการวิจัย : {{ item.paper.rp_no }}</h4>
              <h4>ชื่อโครงการวิจัย : {{ item.paper.title_th }}</h4>
              <h4>ประเภทโครงการ : {{ item.paper.paper_type.name }}</h4>
            </div>

            <div class="mb-7 col-12 col-lg-12">
              <div class="table-responsive">
                <table class="table table-bordered table-border-black">
                  <thead>
                    <tr>
                      <th class="text-center" style="">ประเด็นการประเมิน</th>
                      <th class="text-center" style="width: 80px">เต็ม</th>
                      <th class="text-center" style="width: 100px">
                        ผลประเมิน
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    <template v-for="(qt, idx) in questions" :key="idx">
                      <tr class="fw-bold bg-warning">
                        <td>{{ qt.name }}</td>
                        <td class="text-center">{{ qt.total_score }}</td>
                        <td class="text-end"></td>
                      </tr>

                      <template
                        v-for="(sub_header, idx2) in qt.sub_header"
                        :key="idx2"
                      >
                        <tr class="fw-bold" v-if="sub_header.name != 'none'">
                          <td style="text-indent: 1em">
                            {{ sub_header.name }}
                          </td>
                          <td class="text-center">
                            {{ sub_header.total_score }}
                          </td>
                          <td class="text-end"></td>
                        </tr>

                        <template v-for="(q, idx3) in sub_header.q" :key="idx3">
                          <tr>
                            <td style="text-indent: 2em">
                              {{ q.name }}
                            </td>
                            <td class="text-center">
                              {{ q.total_score }}
                            </td>
                            <td class="text-center">
                              <input
                                type="number"
                                class="form-control"
                                :disabled="disabled"
                                placeholder=""
                                aria-label=""
                                :max="q.total_score"
                                v-model="item[q.col_name]"
                              />
                            </td>
                          </tr>
                        </template>
                      </template>
                    </template>
                  </tbody>
                  <tfoot>
                    <tr>
                      <td colspan="3">
                        <div class="fw-bold mb-2">
                          หมายเหตุ : โครงการที่ได้รับคะแนนประเมินรวมเฉลี่ย ตั้งแต่ 60 – 100 คะแนน ถือว่าผ่านเกณฑ์ เพื่อเข้าสู่การพิจารณา
                        </div>
                        <div class="fw-bold">เกณฑ์การแปลผลคะแนนการประเมิน:</div>
                        <ul class="mb-0 mt-2 ps-6">
                          <li>คะแนนเฉลี่ย 90 - 100 คะแนน หมายถึง ระดับดีเยี่ยม</li>
                          <li>คะแนนเฉลี่ย 80 - 89 คะแนน หมายถึง ระดับดีมาก</li>
                          <li>คะแนนเฉลี่ย 70 - 79 คะแนน หมายถึง ระดับดี</li>
                          <li>คะแนนเฉลี่ย 60 - 69 คะแนน หมายถึง ระดับปานกลาง</li>
                          <li>คะแนนเฉลี่ย 0 - 59 คะแนน หมายถึง ไม่ผ่านเกณฑ์การประเมิน</li>
                        </ul>
                      </td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            </div>
            <div class="mb-7 col-12 col-lg-12">
              <label for="" class="form-label required"
                >ข้อคิดเห็นเกี่ยวกับงบประมาณ</label
              >
              <v-select
                id="slt-budget-status-id"
                name="slt-budget-status-id"
                label="name_th"
                placeholder="สถานะ"
                :options="selectOptions.budget_statuses"
                v-model="item.budget_status"
                class="form-control"
                :disabled="disabled"
                :clearable="true"
              ></v-select>
            </div>

            <div class="mb-7 col-12 col-lg-12">
              <label for="" class="form-label">เนื่องจาก</label>
              <textarea
                v-model="item.budget_comment"
                rows="10"
                type="text"
                class="form-control"
                placeholder=""
                aria-label=""
                :disabled="disabled"
              />
            </div>

            <div class="mb-7 col-12 col-lg-12">
              <label for="" class="form-label required"
                >ข้อคิดเห็นเกี่ยวกับผลการประเมินในภาพรวม</label
              >
              <v-select
                id="slt-review-status-id"
                name="slt-review-status-id"
                label="name_th"
                placeholder="สถานะ"
                :options="statuses.filter((x: any) => {return  x.id == 2 || x.id == 3 || x.id == 4})"
                v-model="item.review_status"
                class="form-control"
                :clearable="true"
                :disabled="disabled"
              ></v-select>
            </div>
            <div class="mb-7 col-12 col-lg-12">
              <label for="" class="form-label"> เนื่องจาก</label>
              <textarea
                v-model="item.comment"
                rows="10"
                type="text"
                class="form-control"
                placeholder=""
                aria-label=""
                :disabled="disabled"
              />
            </div>

            <div class="mb-7 col-12 col-lg-12">
              <label for="" class="form-label">Confident Comments</label>
              <textarea
                v-model="item.confident_comment"
                rows="10"
                type="text"
                class="form-control"
                placeholder=""
                aria-label=""
                :disabled="disabled"
              />
            </div>

            <div class="mb-7 col-12 col-lg-12">
              <label for="formFile" class="form-label">แนบไฟล์ (ถ้ามี)</label>
              <input
                class="form-control"
                type="file"
                id="formFile"
                @change="onFileChange"
                :disabled="disabled"
                ref="reviewFile"
              />
            </div>

            <div
              class="mb-7 col-12 col-lg-12"
              v-if="item.review_file_old && disabled"
            >
              ดาวน์โหลไฟล์แนบ :
              <a :href="item.review_file_old" target="_blank">คลิก</a>
            </div>
          </div>

          <div class="mx-auto text-center mt-5">
            <button
              type="button"
              class="btn btn-danger me-2"
              @click="router.push({ name: 'reviewer-paper' })"
            >
              กลับหน้ารายการ
            </button>
            <button
              @click="onSubmit"
              type="button"
              class="btn btn-success"
              :disabled="disabled"
            >
              บันทึก
            </button>
            <div class="mt-3 text-danger">
              ** เมื่อบันทึกแล้วจะไม่สามารถแก้ไขข้อมูลได้ **
            </div>
          </div>
        </div>
      </div>
      <Preloader
        :isLoading="isLoading != undefined ? isLoading : false"
        :position="'fix'"
      />
    </div>
  </div>
</template>

<script lang="ts">
import {
  defineComponent,
  ref,
  reactive,
  computed,
  onMounted,
  onUnmounted,
  toRefs,
} from "vue";
// Import Modal Bootstrap
import ApiService from "@/core/services/ApiService";
// Use Toast Composables
import useToast from "@/composables/useToast";
import { useRouter, useRoute } from "vue-router";
import { getQuestionsByPaper } from "@/config/evaluationQuestions";

// Import Vue-select
import vSelect from "vue-select";
import "vue-select/dist/vue-select.css";

// Import Yup Validate
import * as Yup from "yup";

// Use Composables
import Preloader from "@/components/preloader/Preloader.vue";
import useDateData from "@/composables/useDateData";

// Import Component
import DetailPage from "@/views/admin-paper/Detail.vue";
import useReviewStatusData from "@/composables/useReviewStatusData";

export default defineComponent({
  name: "review-edit",
  components: {
    Preloader,
    DetailPage,
    vSelect,
  },
  setup(props, { emit }) {
    // UI
    const isLoading = ref<any>(true);
    const router = useRouter();
    const route = useRoute();
    const userData = JSON.parse(localStorage.getItem("userData") || "{}");
    let { statuses } = useReviewStatusData();
    const selectOptions = ref<any>({
      budget_statuses: [
        { name_th: "เหมาะสม", id: 1 },
        { name_th: "ไม่เหมาะสม", id: 0 },
      ],
    });
    const paper_id = <any>ref(null);
    const disabled = ref<any>(false);

    // Variable
    const reviewFile = ref<any>(null);
    const item = reactive<any>({
      review_file: [],
    });

    const questions = computed(() => {
      return getQuestionsByPaper(item.paper);
    });

    // Dynamic Validate Schema based on active question set
    const getValidationSchema = () => {
      const shape: Record<string, any> = {};

      questions.value.forEach((group: any) => {
        group.sub_header?.forEach((sub: any) => {
          sub.q?.forEach((q: any) => {
            const labelNumber = q.name.split(".")[0]?.trim() || q.col_name;
            shape[q.col_name] = Yup.number()
              .typeError(`ข้อ ${labelNumber} จำเป็นต้องระบุตัวเลข`)
              .required(`ข้อ ${labelNumber} จำเป็นต้องระบุ`)
              .max(q.total_score, `ข้อ ${labelNumber} ระบุได้ไม่เกินคะแนนเต็ม (${q.total_score})`)
              .min(0, `ข้อ ${labelNumber} ต้องไม่ต่ำกว่า 0`)
              .label(labelNumber);
          });
        });
      });

      shape.budget_status = Yup.object()
        .required("${label} จำเป็นต้องระบุ")
        .label("ข้อคิดเห็นเกี่ยวกับงบประมาณ");
      shape.review_status = Yup.object()
        .required("${label} จำเป็นต้องระบุ")
        .label("ข้อคิดเห็นเกี่ยวกับผลการประเมินในภาพรวม");
      shape.budget_comment = Yup.string().nullable().label("");
      shape.comment = Yup.string().nullable().label("");
      shape.confident_comment = Yup.string().nullable().label("");

      return Yup.object().shape(shape);
    };

    const errors_default = {
      score_1: { error: 0, text: "" },
      score_2: { error: 0, text: "" },
      score_3: { error: 0, text: "" },
      score_4: { error: 0, text: "" },
      score_5: { error: 0, text: "" },
      score_6: { error: 0, text: "" },
      score_7: { error: 0, text: "" },
      score_8: { error: 0, text: "" },
      score_9: { error: 0, text: "" },
      score_10: { error: 0, text: "" },
      score_11: { error: 0, text: "" },
      score_12: { error: 0, text: "" },
      score_13: { error: 0, text: "" },
      budget_status: { error: 0, text: "" },
      review_status: { error: 0, text: "" },
      budget_comment: { error: 0, text: "" },
      comment: { error: 0, text: "" },
      confident_comment: { error: 0, text: "" },
    };
    const errors = reactive<any>({
      ...errors_default,
    });

    // Fetch Data
    const fetchItem = async () => {
      isLoading.value = true;
      const { data } = await ApiService.query(`review/${route.params.id}`, {});

      Object.assign(item, {
        ...data.data,
      });

      paper_id.value = data.data.paper_id;

      if (item.review_status != 1) {
        disabled.value = true;
        item.review_status = statuses.find((x: any) => {
          return x.id == data.data.review_status;
        });
        item.budget_status = selectOptions.value.budget_statuses.find(
          (x: any) => {
            return x.id == data.data.budget_status;
          }
        );
      } else {
        item.review_status = null;
      }

      item.review_file_old = data.data.review_file;

      isLoading.value = false;
    };

    // Number(route.params.id);

    // Event

    const onFileChange = (event: any) => {
      item.review_file = event.target.files[0];
    };

    const onSubmit = async () => {
      // validate
      Object.assign(errors, errors_default);
      try {
        const validationItemSchema = getValidationSchema();
        await validationItemSchema.validate(item, {
          abortEarly: false,
        });
      } catch (err: any) {
        let text = "";

        err.inner.forEach((error: any) => {
          const fieldName = error.path;
          const errorMessage = error.message;
          if (errors[fieldName]) {
            errors[fieldName].error = 1;
            errors[fieldName].text = errorMessage;
          }
          text = text + errorMessage + ", ";
        });

        useToast(text, "error");
        isLoading.value = false;
        return false;
      }

      isLoading.value = true;
      let data_item: any = {
        ...item,
        budget_status: item.budget_status ? item.budget_status.id : undefined,
        review_status: item.review_status ? item.review_status.id : undefined,
        review_file:
          item.review_file?.length != 0 ? item.review_file : undefined,
        //
        created_at: undefined,
        created_by: undefined,
        paper: undefined,
        time_no_send_mail: undefined,
        updated_at: undefined,
        updated_by: undefined,
        reviewer_id: undefined,
        reviewer: undefined,
        paper_id: undefined,
        is_active: undefined,
        is_send_mail: undefined,
      };

      await ApiService.putFormData("review/" + route.params.id, data_item)
        .then(({ data }) => {
          if (data.msg != "success") {
            throw new Error("ERROR");
          }
          isLoading.value = false;

          useToast("บันทึกข้อมูลเสร็จสิ้น");
          router.push({ name: "reviewer-paper" });
        })
        .catch(({ response }) => {
          isLoading.value = false;
          console.log(response);
        });
    };

    // Mounted
    onMounted(async () => {
      fetchItem();
      isLoading.value = false;
    });

    onUnmounted(() => {});
    // Return
    return {
      isLoading,
      convertDate: useDateData().convertDate,
      item,
      statuses,
      onSubmit,
      paper_id,
      questions,
      disabled,
      router,
      selectOptions,
      onFileChange,
      reviewFile,
    };
  },
});
</script>

<style scoped>
.separator.separator-dotted {
  border-bottom-color: #ccc;
}
</style>
