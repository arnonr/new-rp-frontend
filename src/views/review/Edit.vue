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
                    <DetailPage v-if="paper_id" :paper_id="paper_id" />
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
                      <td colspan="3" class="fw-bold">
                        หมายเหตุ : โครงการที่ถือว่าผ่านเกณฑ์การประเมิน
                        จะต้องมีคะแนนมากกว่า 50 คะแนนขึ้นไป
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
  onMounted,
  onUnmounted,
  toRefs,
} from "vue";
// Import Modal Bootstrap
import ApiService from "@/core/services/ApiService";
// Use Toast Composables
import useToast from "@/composables/useToast";
import { useRouter, useRoute } from "vue-router";

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
    // const questions = [
    //   {
    //     name: "1. ความเป็นไปได้ของโครงการ (Input)",
    //     total_score: 85,
    //     sub_header: [
    //       {
    //         name: "1.1 ปัจจัยการวิจัย (Input)",
    //         total_score: 45,
    //         q: [
    //           {
    //             name: "1.1.1 หัวเรื่องของการวิจัยน่าสนใจ/เป็นประเด็นเร่งด่วน/สำคัญ",
    //             total_score: 5,
    //             col_name: "score_1",
    //           },
    //           {
    //             name: "1.1.2 วัตถุประสงค์ของการวิจัยชัดเจน",
    //             total_score: 5,
    //             col_name: "score_2",
    //           },
    //           {
    //             name: "1.1.3 ความเหมาะสมและความพร้อมของคณะผู้วิจัยในการดำเนินงาน",
    //             total_score: 5,
    //             col_name: "score_3",
    //           },
    //           {
    //             name: "1.1.4 มีผลการวิจัยที่เกี่ยวข้องและการตรวจเอกสารอ้างอิงอย่างสมบูรณ์",
    //             total_score: 7,
    //             col_name: "score_4",
    //           },
    //           {
    //             name: "1.1.5 แผนการดำเนินงานวิจัยที่ชัดเจนและเป็นรูปธรรม",
    //             total_score: 8,
    //             col_name: "score_5",
    //           },
    //           {
    //             name: "1.1.6 ความพร้อมด้านสถานที่และอุปกรณ์",
    //             total_score: 5,
    //             col_name: "score_6",
    //           },
    //           {
    //             name: "1.1.7 ความเหมาะสมของงบประมาณที่ใช้ทำวิจัย (ไม่เกิน 100,000 บาท)",
    //             total_score: 10,
    //             col_name: "score_7",
    //           },
    //         ],
    //       },
    //       {
    //         name: "1.2 กระบวนการวิจัย (process)",
    //         total_score: 25,
    //         q: [
    //           {
    //             name: "1.2.1 ระบุกลยุทธ์การเชื่อมโยงของขั้นตอนการวิจัยอย่างสมบูรณ์ ถูกต้อง ชัดเจน และสอดคล้องกับวัตถุประสงค์",
    //             total_score: 15,
    //             col_name: "score_8",
    //           },
    //           {
    //             name: "1.2.2 แผนการถ่ายทอดผลการวิจัย/เทคโนโลยีชัดเจน/การนำเสนอในที่ประชุมวิชาการ/การตีพิมพ์ในวารสารวิชาการ",
    //             total_score: 10,
    //             col_name: "score_9",
    //           },
    //         ],
    //       },
    //       {
    //         name: "1.3 ผลผลิตการวิจัย (output)",
    //         total_score: 15,
    //         q: [
    //           {
    //             name: "1.3.1 งานวิจัยก่อให้เกิดมูลค่าเพิ่มทางเศรษฐกิจ",
    //             total_score: 5,
    //             col_name: "score_10",
    //           },
    //           {
    //             name: "1.3.2 ผลสำเร็จเมื่อสิ้นสุดโครงการวิจัยชัดเจน",
    //             total_score: 5,
    //             col_name: "score_11",
    //           },
    //           {
    //             name: "1.3.3 ระบุกลุ่มเป้าหมายที่ได้รับผลประโยชน์ชัดเจน",
    //             total_score: 5,
    //             col_name: "score_12",
    //           },
    //         ],
    //       },
    //     ],
    //   },
    //   {
    //     name: "2. ผลกระทบของโครงการวิจัย (Impact)",
    //     total_score: 15,
    //     sub_header: [
    //       {
    //         name: "none",
    //         total_score: 15,
    //         q: [
    //           {
    //             name: "2.1 โอกาสในการเผยแพร่ในที่ประชุมวิชาการ/วารสารวิชาการระดับชาติหรือนานาชาติ",
    //             total_score: 15,
    //             col_name: "score_13",
    //           },
    //         ],
    //       },
    //     ],
    //   },
    // ];

    const questions_2569 = [
      {
        name: "ความเป็นไปได้ของโครงการ (Input)",
        total_score: 20,
        sub_header: [
          {
            name: "none",
            total_score: 20,
            q: [
              {
                name: "1. ความรู้และประสบการณ์ (ผู้สมัครขอรับทุนควรมีคุณสมบัติที่เหมาะสมกับโครงการวิจัยที่เสนอ เช่น มีผลงานวิจัยที่ตีพิมพ์ในวารสารวิชาการระดับนานาชาติหรือระดับชาติ และมีความรู้ความสามารถที่เกี่ยวข้องกับหัวข้อวิจัย)",
                total_score: 5,
                col_name: "score_1",
              },
              {
                name: "2. ความพร้อมด้านบุคลากร (ผู้สมัครขอรับทุนทำงานวิจัยเดี่ยว หรือเป็นหมู่คณะ หากเป็นหมู่คณะควรมีบุคลากรที่เหมาะสม และมีประสบการณ์ในการทำงานวิจัย)",
                total_score: 5,
                col_name: "score_2",
              },
              {
                name: "3. ความสอดคล้องกับศักยภาพของเงินทุน (ขนาดของโครงการวิจัยที่ผู้สมัครขอรับทุนเสนอมีความเหมาะสมต่อการดำเนินงานวิจัย)",
                total_score: 10,
                col_name: "score_3",
              },
            ],
          },
        ],
      },
      {
        name: "กระบวนการวิจัยและความเหมาะสมของโครงการ (Process)",
        total_score: 40,
        sub_header: [
          {
            name: "none",
            total_score: 40,
            q: [
              {
                name: "4. ความน่าสนใจของหัวข้อวิจัย (หัวข้อการวิจัยน่าสนใจ เป็นประเด็นเร่งด่วนมีความสำคัญ)",
                total_score: 10,
                col_name: "score_4",
              },
              {
                name: "5. ความชัดเจนของวัตถุประสงค์ (โครงการวิจัยควรมีวัตถุประสงค์ที่ชัดเจน และสามารถวัดผลสำเร็จได้)",
                total_score: 5,
                col_name: "score_5",
              },
              {
                name: "6. แผนการดำเนินการวิจัย (แผนการดำเนินการวิจัยมีความชัดเจน มีความเป็นไปได้ และเป็นรูปธรรม)",
                total_score: 10,
                col_name: "score_6",
              },
              {
                name: "7. ความสอดคล้องกับเป้าหมาย (โครงการวิจัยควรมีความสอดคล้องกับเป้าหมายของทุนวิจัย และแผนงานของคณะวิทยาศาสตร์ประยุกต์)",
                total_score: 10,
                col_name: "score_7",
              },
              {
                name: "8. ความสามารถในการดำเนินงาน (โครงการวิจัยควรมีความสามารถในการดำเนินงาน ได้จริง และมีระยะเวลาที่เหมาะสม)",
                total_score: 5,
                col_name: "score_8",
              },
            ],
          },
        ],
      },
      {
        name: "ผลงานที่คาดว่าจะได้รับ (Output)",
        total_score: 40,
        sub_header: [
          {
            name: "none",
            total_score: 40,
            q: [
              {
                name: "9. องค์ความรู้ใหม่ (โครงการวิจัยควรมีศักยภาพในการสร้างองค์ความรู้ใหม่)",
                total_score: 10,
                col_name: "score_9",
              },
              {
                name: "10. การตีพิมพ์ผลงาน (โครงการวิจัยควรมีศักยภาพในการนำไปตีพิมพ์บนฐานข้อมูล SCOPUS หรือ TCI ตามเงื่อนไขการปิดทุนวิจัย)",
                total_score: 10,
                col_name: "score_10",
              },
              {
                name: "11. การประยุกต์ใช้ (โครงการวิจัยควรมีศักยภาพในการนำไปประยุกต์ใช้เพื่อแก้ปัญหา หรือพัฒนาผลิตภัณฑ์ใหม่ หรือมีแนวทางในการต่อยอดงานวิจัยในอนาคต)",
                total_score: 10,
                col_name: "score_11",
              },
              {
                name: "12. ประโยชน์ต่อสังคม (โครงการวิจัยควรมีประโยชน์ต่อสังคม และสามารถสร้างผลกระทบเชิงบวก)",
                total_score: 10,
                col_name: "score_12",
              },
            ],
          },
        ],
      },
    ];

    const questions = questions_2569;

    const item = reactive<any>({
      review_file: [],
    });

    // Validate Schema
    const validationItemSchema = Yup.object().shape({
      score_1: Yup.number()
        .required("${label} จำเป็นต้องระบุ")
        .max(5, "${label} ระบุได้ไม่เกินคะแนนเต็ม")
        .label("1"),
      score_2: Yup.number()
        .required("${label} จำเป็นต้องระบุ")
        .max(5, "${label} ระบุได้ไม่เกินคะแนนเต็ม")
        .label("2"),
      score_3: Yup.number()
        .required("${label} จำเป็นต้องระบุ")
        .max(10, "${label} ระบุได้ไม่เกินคะแนนเต็ม")
        .label("3"),
      score_4: Yup.number()
        .required("${label} จำเป็นต้องระบุ")
        .max(10, "${label} ระบุได้ไม่เกินคะแนนเต็ม")
        .label("4"),
      score_5: Yup.number()
        .required("${label} จำเป็นต้องระบุ")
        .max(5, "ระบุได้ไม่เกินคะแนนเต็ม")
        .label("5"),
      score_6: Yup.number()
        .required("${label} จำเป็นต้องระบุ")
        .max(10, "${label} ระบุได้ไม่เกินคะแนนเต็ม")
        .label("6"),
      score_7: Yup.number()
        .required("${label} จำเป็นต้องระบุ")
        .max(10, "${label} ระบุได้ไม่เกินคะแนนเต็ม")
        .label("7"),
      score_8: Yup.number()
        .required("${label} จำเป็นต้องระบุ")
        .max(5, "${label} ระบุได้ไม่เกินคะแนนเต็ม")
        .label("8"),
      score_9: Yup.number()
        .required("${label} จำเป็นต้องระบุ")
        .max(10, "${label} ระบุได้ไม่เกินคะแนนเต็ม")
        .label("9"),
      score_10: Yup.number()
        .required("${label} จำเป็นต้องระบุ")
        .max(10, "${label} ระบุได้ไม่เกินคะแนนเต็ม")
        .label("10"),
      score_11: Yup.number()
        .required("${label} จำเป็นต้องระบุ")
        .max(10, "${label} ระบุได้ไม่เกินคะแนนเต็ม")
        .label("11"),
      score_12: Yup.number()
        .required("${label} จำเป็นต้องระบุ")
        .max(10, "${label} ระบุได้ไม่เกินคะแนนเต็ม")
        .label("12"),
      budget_status: Yup.object()
        .required("${label} จำเป็นต้องระบุ")
        .label("ข้อคิดเห็นเกี่ยวกับงบประมาณ"),
      review_status: Yup.object()
        .required("${label} จำเป็นต้องระบุ")
        .label("ข้อคิดเห็นเกี่ยวกับผลการประเมินในภาพรวม"),
      budget_comment: Yup.string().nullable().label(""),
      comment: Yup.string().nullable().label(""),
      confident_comment: Yup.string().nullable().label(""),
    });
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
      try {
        await validationItemSchema.validate(item, {
          abortEarly: false,
        });
      } catch (err: any) {
        let text = "";

        err.inner.forEach((error: any) => {
          const fieldName = error.path;
          const errorMessage = error.message;
          errors[fieldName].error = 1;
          errors[fieldName].text = errorMessage;
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
