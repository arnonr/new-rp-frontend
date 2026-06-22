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
        <div class="modal-header" v-if="!isLoading">
          <h3 class="modal-title">ข้อมูลสาระสำคัญของโครงการ</h3>
          <button
            @click="onClose({ reload: false })"
            type="button"
            class="btn-close"
            data-bs-dismiss="modal"
            aria-label="Close"
          ></button>
        </div>

        <div class="modal-body" v-if="!isLoading">
          <div class="row">
            <div ref="pdfContent" class="pdfContent">
              <Section1 v-if="item.id != null" :item="item" />

              <Section2
                v-if="item.id != null"
                :item="item"
                :researcher="researcher"
                :method_list="method_list"
              />

              <Section3
                v-if="item.id != null"
                :item="item"
                :budget="budget"
                :budget2="budget2"
                :budget3="budget3"
                :file_attach="file_attach"
              />
            </div>

            <div class="mx-auto text-center mt-5">
              <button
                @click="generatePDF"
                type="button"
                class="btn btn-success"
                v-if="item.status_id != 1"
              >
                พิมพ์ข้อมูล
              </button>
            </div>
          </div>
        </div>
        <Preloader :isLoading="isLoading" :position="'absolute'" />
        <Preloader :isLoading="isLoading1" :position="'absolute'" />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, reactive, onMounted, onUnmounted } from "vue";
import ApiService from "@/core/services/ApiService";
// Import Modal Bootstrap
import { Modal } from "bootstrap";
// Import Dayjs
import dayjs from "dayjs";
import "dayjs/locale/th";
import buddhistEra from "dayjs/plugin/buddhistEra";
dayjs.extend(buddhistEra);
// import { jsPDF } from "jspdf";
import html2pdf from "html2pdf.js";
import "@/assets/fonts/THSarabunNew-normal.js";

// Use Composables
import useBasicData from "@/composables/useBasicData";
import Preloader from "@/components/preloader/Preloader.vue";
import useDateData from "@/composables/useDateData";

// Import Component
import Section1 from "@/components/paper/detail/Section1.vue";
import Section2 from "@/components/paper/detail/Section2.vue";
import Section3 from "@/components/paper/detail/Section3.vue";

export default defineComponent({
  name: "paper-detail-modal",
  props: {
    paper_id: {
      type: Number,
      required: true,
    },
  },
  components: {
    Preloader,
    Section1,
    Section2,
    Section3,
  },
  setup(props, { emit }) {
    // UI
    const isLoading = ref<any>(true);
    const isLoading1 = ref<any>(false);
    const mainModalRef = ref<any>(null);
    const mainModalObj = ref<any>(null);
    const htmlPdf = ref<any>(null);

    const margin = {
      top: "20cm",
      bottom: "20cm",
      left: "0cm",
      right: "0cm",
    };

    // Variable
    const userData = JSON.parse(localStorage.getItem("userData") || "{}");

    const item = reactive<any>({});
    const user_item = reactive<any>({});
    const researcher_types = useBasicData().researcher_types;
    const budget = reactive<any[]>([] as any[]);
    const budget2 = reactive<any[]>([] as any[]);
    const budget3 = reactive<any[]>([] as any[]);
    const researcher = reactive<any[]>([] as any[]);
    const method_list = reactive<any[]>([] as any[]);
    const file_attach = reactive<any[]>([] as any[]);

    // เพิ่มฟังก์ชัน generatePDF
    // const generatePDF = () => {
    //   const doc = new jsPDF({ unit: "mm", format: "a4" });
    //   doc.setFont("THSarabunNew", "normal");
    //   doc.setFontSize(18);
    //   doc.text("ทดสอบภาษาไทย", 10, 10);
    //   let y = 15;
    //   // Section 1: ข้อมูลโครงการ
    //   doc.text("ชื่อโครงการ (ภาษาไทย): " + (item.title_th || "-"), 15, y);
    //   y += 10;
    //   doc.text("ชื่อโครงการ (ภาษาอังกฤษ): " + (item.title_en || "-"), 15, y);
    //   y += 10;
    //   doc.text("ประเภทงานวิจัย: " + (item.paper_type_id?.name || "-"), 15, y);
    //   y += 10;
    //   doc.text("ลักษณะงานวิจัย: " + (item.paper_kind_id?.name || "-"), 15, y);
    //   y += 10;
    //   doc.text("บทคัดย่อ:", 15, y);
    //   y += 8;
    //   doc.setFontSize(14);
    //   doc.text(item.abstract || "-", 20, y, { maxWidth: 170 });
    //   y += 12;
    //   doc.setFontSize(18);
    //   doc.text("Keyword: " + (item.keyword || "-"), 15, y);
    //   y += 10;
    //   doc.text("หน่วยงาน: " + (item.department_id?.name || "-"), 15, y);
    //   y += 10;
    //   doc.text("ความเป็นมาและความสำคัญของปัญหา:", 15, y);
    //   y += 8;
    //   doc.setFontSize(14);
    //   doc.text(item.history || "-", 20, y, { maxWidth: 170 });
    //   y += 12;
    //   doc.setFontSize(18);
    //   doc.text("วัตถุประสงค์ของโครงการวิจัย:", 15, y);
    //   y += 8;
    //   doc.setFontSize(14);
    //   doc.text(item.objective || "-", 20, y, { maxWidth: 170 });
    //   y += 12;
    //   doc.setFontSize(18);
    //   doc.text("ขอบเขตของการวิจัย:", 15, y);
    //   y += 8;
    //   doc.setFontSize(14);
    //   doc.text(item.scope || "-", 20, y, { maxWidth: 170 });
    //   y += 12;
    //   doc.setFontSize(18);
    //   doc.text("ผลงานวิจัยที่เกี่ยวข้อง:", 15, y);
    //   y += 8;
    //   doc.setFontSize(14);
    //   doc.text(item.review_literature || "-", 20, y, { maxWidth: 170 });
    //   y += 12;
    //   doc.setFontSize(18);
    //   doc.text("ระเบียบวิธีวิจัย:", 15, y);
    //   y += 8;
    //   doc.setFontSize(14);
    //   doc.text(item.method || "-", 20, y, { maxWidth: 170 });
    //   y += 12;
    //   doc.setFontSize(18);
    //   doc.text("ประโยชน์ที่คาดว่าจะได้รับ:", 15, y);
    //   y += 8;
    //   doc.setFontSize(14);
    //   doc.text(item.benefit || "-", 20, y, { maxWidth: 170 });
    //   y += 12;
    //   doc.setFontSize(18);
    //   doc.text("สถานที่ทำการทดลอง/หรือเก็บข้อมูล:", 15, y);
    //   y += 8;
    //   doc.setFontSize(14);
    //   doc.text(item.location || "-", 20, y, { maxWidth: 170 });
    //   y += 12;
    //   doc.setFontSize(18);
    //   // Section 2: นักวิจัย
    //   y += 5;
    //   doc.text(
    //     "\u0e04\u0e13\u0e30\u0e1c\u0e39\u0e49\u0e27\u0e34\u0e08\u0e31\u0e22",
    //     15,
    //     y
    //   );
    //   y += 8;
    //   doc.setFontSize(14);
    //   doc.text(
    //     "ลำดับ | ชื่อ-นามสกุล | หน่วยงาน | เบอร์โทรศัพท์ | ความชำนาญ/สาขา | ประเภท | สัดส่วน(%)",
    //     15,
    //     y
    //   );
    //   y += 7;
    //   researcher.forEach((rc: any, idx: number) => {
    //     doc.text(
    //       `${idx + 1} | ${rc.prefix_name} ${rc.firstname} ${rc.surname} | ${
    //         rc.department_id ? rc.department_id.name : rc.department_text
    //       } | ${rc.phone_number} | ${rc.expertise} | ${
    //         rc.researcher_type?.name || "-"
    //       } | ${rc.percentage}`,
    //       15,
    //       y
    //     );
    //     y += 7;
    //   });
    //   y += 5;
    //   doc.setFontSize(18);
    //   doc.text(
    //     "\u0e02\u0e31\u0e49\u0e19\u0e15\u0e2d\u0e19\u0e41\u0e25\u0e30\u0e23\u0e30\u0e22\u0e30\u0e40\u0e27\u0e25\u0e32\u0e02\u0e2d\u0e07\u0e41\u0e1c\u0e19\u0e14\u0e33\u0e40\u0e19\u0e34\u0e19\u0e07\u0e32\u0e19",
    //     15,
    //     y
    //   );
    //   y += 8;
    //   doc.setFontSize(14);
    //   doc.text("ลำดับ | รายละเอียด | วันที่เริ่ม | วันที่สิ้นสุด", 15, y);
    //   y += 7;
    //   method_list.forEach((ml: any, idx: number) => {
    //     doc.text(
    //       `${idx + 1} | ${ml.detail} | ${ml.start_date} | ${ml.end_date}`,
    //       15,
    //       y
    //     );
    //     y += 7;
    //   });
    //   y += 5;
    //   // Section 3: งบประมาณ
    //   doc.setFontSize(18);
    //   doc.text("งบประมาณในงานวิจัย", 15, y);
    //   y += 8;
    //   doc.setFontSize(14);
    //   doc.text("ลำดับ | รายละเอียด | จำนวนเงิน (บาท)", 15, y);
    //   y += 7;
    //   budget.forEach((bg: any, idx: number) => {
    //     doc.text(
    //       `${idx + 1} | ${bg.detail} | ${Number(bg.amount).toLocaleString(
    //         "en-US",
    //         { minimumFractionDigits: 2, maximumFractionDigits: 2 }
    //       )}`,
    //       15,
    //       y
    //     );
    //     y += 7;
    //   });
    //   y += 5;
    //   if (budget2.length > 0) {
    //     doc.setFontSize(18);
    //     doc.text("งบประมาณใช้สอย/ค่าใช้จ่ายอื่น ๆ", 15, y);
    //     y += 8;
    //     doc.setFontSize(14);
    //     doc.text("ลำดับ | รายละเอียด | จำนวนเงิน (บาท)", 15, y);
    //     y += 7;
    //     budget2.forEach((bg: any, idx: number) => {
    //       doc.text(
    //         `${idx + 1} | ${bg.detail} | ${Number(bg.amount).toLocaleString(
    //           "en-US",
    //           { minimumFractionDigits: 2, maximumFractionDigits: 2 }
    //         )}`,
    //         15,
    //         y
    //       );
    //       y += 7;
    //     });
    //     y += 5;
    //   }
    //   if (budget3.length > 0) {
    //     doc.setFontSize(18);
    //     doc.text("งบประมาณวัสดุ (แจกแจงรายละเอียดรายจ่าย)", 15, y);
    //     y += 8;
    //     doc.setFontSize(14);
    //     doc.text("ลำดับ | รายละเอียด | จำนวนเงิน (บาท)", 15, y);
    //     y += 7;
    //     budget3.forEach((bg: any, idx: number) => {
    //       doc.text(
    //         `${idx + 1} | ${bg.detail} | ${Number(bg.amount).toLocaleString(
    //           "en-US",
    //           { minimumFractionDigits: 2, maximumFractionDigits: 2 }
    //         )}`,
    //         15,
    //         y
    //       );
    //       y += 7;
    //     });
    //     y += 5;
    //   }
    //   // อ้างอิง
    //   doc.setFontSize(18);
    //   doc.text("รายการอ้างอิง/บรรณานุกรม:", 15, y);
    //   y += 8;
    //   doc.setFontSize(14);
    //   doc.text(item.references || "-", 20, y, { maxWidth: 170 });
    //   // Save
    //   doc.save("ข้อมูลโครงการ.pdf");
    // };
    const generatePDF = () => {
      const element = mainModalRef.value.querySelector(".pdfContent");
      const opt = {
        margin: 0.5,
        filename: "ข้อมูลโครงการ.pdf",
        image: { type: "jpeg", quality: 0.98 },
        html2canvas: { scale: 2 },
        jsPDF: { unit: "in", format: "a4", orientation: "portrait" },
      };
      html2pdf().set(opt).from(element).save();
    };

    //Fetch
    const fetchUser = async () => {
      try {
        const { data } = await ApiService.query("user/" + userData.id, {});
        Object.assign(user_item, {
          ...data.data,
          department_id:
            data.data.department_id != null
              ? {
                  name: data.data.department.name,
                  id: data.data.department_id,
                }
              : null,
        });
      } catch (error) {
        console.log(error);
      }
    };

    const fetchItem = async () => {
      try {
        const { data } = await ApiService.query("paper/" + props.paper_id, {});
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
          paper_kind_id:
            data.data.paper_kind_id != null
              ? {
                  name: data.data.paper_kind.name,
                  id: data.data.paper_kind_id,
                }
              : null,
        });

        budget.length = 0;
        Object.assign(budget, data.data.budget);

        budget2.length = 0;
        Object.assign(budget2, data.data.budget2);

        budget3.length = 0;
        Object.assign(budget3, data.data.budget3);

        method_list.length = 0;
        Object.assign(method_list, data.data.method_list);

        researcher.length = 0;
        let new_rs = data.data.researcher.map((el: any) => {
          if (el.department_id != null) {
            el.department_id = {
              id: el.department_id,
              name: el.department.name,
            };
          }

          if (el.researcher_type != null) {
            el.researcher_type = researcher_types.find((x: any) => {
              return x.id == el.researcher_type;
            });
          }

          return el;
        });
        Object.assign(researcher, new_rs);
      } catch (error) {
        console.log(error);
      }
    };

    const fetchFileAttach = async () => {
      try {
        let params = { paper_id: props.paper_id };

        const { data } = await ApiService.query("file-attach/", {
          params: { ...params },
        });
        Object.assign(file_attach, data.data);
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

      await fetchUser();
      await fetchItem();
      await fetchFileAttach();
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
      isLoading1,
      mainModalRef,
      convertDate: useDateData().convertDate,
      item,
      file_attach,
      onClose,
      htmlPdf,
      researcher,
      method_list,
      budget,
      budget2,
      budget3,
      margin,
      generatePDF,
    };
  },
});
</script>

<style scoped>
/* @import "https://fonts.googleapis.com/css2?family=Sarabun&display=swap"; */
.generate-pdf {
  font-family: Sarabun, sans-serif;
}

.separator.separator-dotted {
  border-bottom-color: #ccc;
}

.pdf-section {
  margin: 50px 20px;
  page-break-after: always;
  min-height: 297mm; /* A4 height */
  box-sizing: border-box;
  padding-bottom: 50px; /* เพิ่ม padding ด้านล่างเพื่อให้แน่ใจว่ามี space */
  position: relative;
}

/* จัดการ overflow content */
.pdf-section::after {
  content: "";
  display: block;
  height: 50px; /* ความสูงเท่ากับ bottom margin */
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  background: white; /* หรือสีพื้นหลังของคุณ */
}

@media print {
  .pdf-section {
    margin: 0;
    padding: 50px 20px;
  }
}
</style>

<style>
.generate-pdf {
  padding: 0mm 10mm 0mm 10mm;
}

.html2pdf__page-break {
  page-break-before: always; /* บังคับให้เริ่มหน้าใหม่ */
  height: 0; /* ซ่อนเส้นแบ่งหน้า */
}

.page-break {
  page-break-before: always;
}

/* ป้องกันตารางถูกแยกข้ามหน้า */
table,
thead,
tbody,
tr,
.avoid-page-break {
  break-inside: avoid !important;
  page-break-inside: avoid !important;
}
/* @media print {
  .pdf-section {
    margin-bottom: 50px; 
  }
} */
</style>
