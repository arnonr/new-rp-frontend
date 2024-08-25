<template>
  <div>
    <div class="card" v-if="paper_id != null">
      <div class="card-body">
        <div class="row">
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

            <div
              class="mb-7 col-12 col-lg-12"
              v-if="item.review_file_old && disabled"
            >
              ดาวน์โหลไฟล์แนบ :
              <a :href="item.review_file_old" target="_blank">คลิก</a>
            </div>
          </div>

          <div class="mx-auto text-center mt-5"></div>
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
import { defineComponent, ref, reactive, onMounted, onUnmounted } from "vue";
// Import Modal Bootstrap
import ApiService from "@/core/services/ApiService";
// Use Toast Composables
import useToast from "@/composables/useToast";
import { useRouter, useRoute } from "vue-router";

// Import Vue-select
import vSelect from "vue-select";
import "vue-select/dist/vue-select.css";

// Use Composables
import Preloader from "@/components/preloader/Preloader.vue";
import useDateData from "@/composables/useDateData";

// Import Component
import useReviewStatusData from "@/composables/useReviewStatusData";

export default defineComponent({
  name: "review-detail",
  components: {
    Preloader,
    vSelect,
  },
  props: {
    review_id: { type: Number },
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
    const questions = [
      {
        name: "1. คุณค่าทางปัญญาของโครงการวิจัย",
        total_score: 85,
        sub_header: [
          {
            name: "1.1 ปัจจัยการวิจัย (Input)",
            total_score: 45,
            q: [
              {
                name: "1.1.1 หัวเรื่องของการวิจัยน่าสนใจ/เป็นประเด๋นเร่งด่วน/สำคัญ",
                total_score: 5,
                col_name: "score_1",
              },
              {
                name: "1.1.2 วัตถุประสงค์ของการวิจัยชัดเจน",
                total_score: 5,
                col_name: "score_2",
              },
              {
                name: "1.1.3 ความเหมาะสมและความพร้อมของคณะผู้วิจัยในการดำเนินงาน",
                total_score: 5,
                col_name: "score_3",
              },
              {
                name: "1.1.4 มีผลการวิจัยที่เกี่ยวข้องและการตรวจเอกสารอ้างอิงอย่างสมบูรณ์",
                total_score: 7,
                col_name: "score_4",
              },
              {
                name: "1.1.5 แผนการดำเนินงานวิจัยที่ชัดเจนและเป็นรูปธรรม",
                total_score: 8,
                col_name: "score_5",
              },
              {
                name: "1.1.6 ความพร้อมด้านสถานที่และอุปกรณ์",
                total_score: 5,
                col_name: "score_6",
              },
              {
                name: "1.1.7 ความเหมาะสมของงบประมาณที่ใช้ทำวิจัย (ไม่เกิน 100,000 บาท)",
                total_score: 10,
                col_name: "score_7",
              },
            ],
          },
          {
            name: "1.2 กระบวนการวิจัย (process)",
            total_score: 25,
            q: [
              {
                name: "1.2.1 ระบุกลยุทธ์การเชื่อมโยงของขั้นตอนการวิจัยอบ่างสมบูรณ์ ถูกต้อง ชัดเจน และสอดคล้องกับวัตถุุประสงค์",
                total_score: 15,
                col_name: "score_8",
              },
              {
                name: "1.2.2 แผนการถ่ายทอดผลการวิจัย/เทคโนโลยีชัดเจน/การนำเสนอในที่ประชุมวิชาการ/การตีพิมพ์ในวารสารวิชาการ",
                total_score: 10,
                col_name: "score_9",
              },
            ],
          },
          {
            name: "1.3 ผลผลิตการวิจัย (output)",
            total_score: 15,
            q: [
              {
                name: "1.3.1 งานวิจัยก่อให้เกิดมูลค่าเพิ่มทางเศรษฐกิจ",
                total_score: 5,
                col_name: "score_10",
              },
              {
                name: "1.3.2 ผลสำเร็จเมื่อสิ้นสุดโครงการวิจัยชัดเจน",
                total_score: 5,
                col_name: "score_11",
              },
              {
                name: "1.3.3 ระบกลุ่มเป้าหมายที่ได้รับผลประโยชน์ชัดเจน",
                total_score: 5,
                col_name: "score_12",
              },
            ],
          },
        ],
      },
      {
        name: "2. ผลกระทบของโครงการวิจัย (Impact)",
        total_score: 15,
        sub_header: [
          {
            name: "none",
            total_score: 15,
            q: [
              {
                name: "2.1 โอกาสในการเผยแพร่ในที่ประชุมวิชาการ/วารสารวิชาการระดับชาติหรือนานาชาติ",
                total_score: 15,
                col_name: "score_13",
              },
            ],
          },
        ],
      },
    ];

    const item = reactive<any>({});

    // Fetch Data
    const fetchItem = async () => {
      isLoading.value = true;
      const { data } = await ApiService.query(`review/${props.review_id}`, {});

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

    // Mounted
    onMounted(async () => {
      fetchItem();
      isLoading.value = false;
    });

    onUnmounted(() => {});
    // Return
    return {
      isLoading,
      item,
      statuses,
      paper_id,
      questions,
      disabled,
      router,
      selectOptions,
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
