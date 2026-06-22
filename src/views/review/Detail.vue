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
