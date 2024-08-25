<template>
  <!--begin::Wrapper-->
  <div class="container mt-5">
    <!-- Profile -->
    <div class="card shadow-sm my-5">
      <div class="card-header bg-white">
        <h4 class="card-title">ข้อมูลกรรมการ</h4>
        <div class="card-toolbar">
          <button
            class="btn btn-outline btn-outline-primary me-2 pe-sm-3 ps-sm-5"
            @click="onEditReviewerModal"
          >
            <i class="fa fa-edit"></i>
            <span class="d-none d-lg-inline-block">แก้ไข</span>
          </button>
        </div>
      </div>
      <div class="card-body row">
        <!-- <div class="col-md-12 px-5 py-3">
          <span class="fw-bold">ตำแหน่งทางวิชาการ : </span>
          <span class="fst-italic">{{ user_item.position }}</span>
        </div> -->
        <!-- <div class="separator separator-dotted my-2"></div> -->
        <div class="col-md-12 px-5 py-3">
          <span class="fw-bold">ชื่อ-นามสกุล : </span>
          <span class="fst-italic"
            >{{ user_item.prefix_name != null ? user_item.prefix_name : ""
            }}{{ user_item.firstname + " " + user_item.surname }}</span
          >
        </div>
        <div class="separator separator-dotted my-2"></div>
        <div class="col-md-12 px-5 py-3">
          <span class="fw-bold">หน่วยงาน : </span>
          <span class="fst-italic">{{ user_item.organization_name }}</span>
        </div>

        <div class="separator separator-dotted my-2"></div>
        <div class="col-md-12 px-5 py-3">
          <span class="fw-bold">เมล : </span>
          <span class="fst-italic">{{ user_item.email }}</span>
        </div>
        <div class="separator separator-dotted my-2"></div>
        <div class="col-md-12 px-5 py-3">
          <span class="fw-bold">ที่อยู่ตามบัตรประชาชน : </span>
          <span class="fst-italic">{{ user_item.organization_name }}</span>
        </div>

        <div class="separator separator-dotted my-2"></div>
        <div class="col-md-12 px-5 py-3">
          <span class="fw-bold">ธนาคาร : </span>
          <span class="fst-italic">{{ user_item.name_bank }}</span>
        </div>

        <div class="separator separator-dotted my-2"></div>
        <div class="col-md-12 px-5 py-3">
          <span class="fw-bold">ชื่อบัญชีธนาคาร : </span>
          <span class="fst-italic">{{ user_item.name_account_bank }}</span>
        </div>

        <div class="separator separator-dotted my-2"></div>
        <div class="col-md-12 px-5 py-3">
          <span class="fw-bold">เลขที่บัญชีธนาคาร : </span>
          <span class="fst-italic">{{ user_item.no_account_bank }}</span>
        </div>

        <div class="separator separator-dotted my-2"></div>
      </div>
    </div>
    <div class="card shadow-sm my-5">
      <div class="card-header bg-white">
        <h4 class="card-title">โครงการวิจัย</h4>
      </div>
      <div class="card-body table-responsive d-none d-lg-block">
        <Preloader :isLoading="isLoading" :position="'absolute'" />
        <ListComponent
          :items="items"
          :paginationData="paginationData"
          :sortKey="sortKey"
          :sortOrder="sortOrder"
          @update:currentPage="paginationData.currentPage = $event"
          @update:perPage="paginationData.perPage = $event"
          @sort="(key: any) => {
            sortedItems(key)}"
          @edit="(it: any) => {goToEditPage(it.id)}"
          @detail="(it: any) => {onDetailModal(it) }"
          @history-detail="(it: any) =>{ onHistoryDetailModal(it)}"
        />
      </div>
      <div class="card-body d-lg-none">
        <CardListComponent
          :items="items"
          :paginationData="paginationData"
          :sortKey="sortKey"
          :sortOrder="sortOrder"
          @update:currentPage="paginationData.currentPage = $event"
          @update:perPage="paginationData.perPage = $event"
          @sort="(key: any) => {
            sortedItems(key)}"
          @edit="(it: any) => {goToEditPage(it.id)}"
          @detail="(it: any) => {onDetailModal(it) }"
          @history-detail="(it: any) =>{ onHistoryDetailModal(it)}"
        />
      </div>
    </div>

    <div>
      <div id="edit-reviewer-modal">
        <EditReviewerPage
          v-if="openEditReviewerModal == true"
          :item="user_item"
          @close-modal="
            () => {
              openEditReviewerModal = false;
            }
          "
          @reload="fetchUser"
        />
      </div>

      <!-- Modal Detail ดูข้อมูล -->
      <div id="detail-modal">
        <DetailPage
          v-if="openDetailModal == true"
          :paper_id="item.id"
          @close-modal="
            () => {
              openDetailModal = false;
            }
          "
        />
      </div>

      <!-- Modal History Detail ดูข้อมูลประวัติการแก้ไข -->
      <div id="history-detail-modal">
        <HistoryDetailPage
          v-if="openHistoryDetailModal == true"
          :paper_id="item.id"
          @close-modal="
            () => {
              openHistoryDetailModal = false;
            }
          "
        />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, reactive, onMounted, watch } from "vue";
import ApiService from "@/core/services/ApiService";
import { useRouter } from "vue-router";
import useToast from "@/composables/useToast";

// Component
import ListComponent from "@/components/review/List.vue";
import CardListComponent from "@/components/review/CardList.vue";
import Preloader from "@/components/preloader/Preloader.vue";
import EditReviewerPage from "@/views/admin-reviewer/EditReviewerModal.vue";
import DetailPage from "@/views/paper/DetailModal.vue";
import HistoryDetailPage from "@/views/paper/HistoryDetailModal.vue";

export default defineComponent({
  name: "paper",
  components: {
    ListComponent,
    CardListComponent,
    Preloader,
    EditReviewerPage,
    DetailPage,
    HistoryDetailPage,
  },
  setup() {
    // UI Variable
    const isLoading = ref<any>(false);
    const router = useRouter();
    const sortKey = ref<any>("");
    const sortOrder = ref<any>(-1);

    // Variable
    const userData = JSON.parse(localStorage.getItem("userData") || "{}");
    const openEditReviewerModal = ref<any>(false);
    const user_item = reactive<any>({});

    const search = reactive<any>({});

    const items = reactive<any[]>([]);
    const item = reactive<any>({});

    const paginationData = reactive<any>({
      perPage: 20,
      currentPage: 1,
      totalPage: 1,
      totalItems: 0,
    });

    const openDetailModal = ref(false);
    const openEditModal = ref(false);
    const openReceive1Modal = ref(false);
    const openHistoryDetailModal = ref(false);

    // Fetch Data
    const fetchUser = async () => {
      try {
        const { data } = await ApiService.query("reviewer/" + userData.id, {});
        Object.assign(user_item, {
          ...data.data,
        });
      } catch (error) {
        console.log(error);
      }
    };

    const fetchItems = async () => {
      try {
        isLoading.value = true;
        const params = {
          ...search,
          reviewer_id: user_item.id,
          time_no_send_mail: "not zero",
          is_active: 1,
        };

        const { data } = await ApiService.query("review/", {
          params: params,
        });

        items.length = 0;
        Object.assign(items, data.data);
        paginationData.totalPage = data.totalPage;
        paginationData.totalItems = data.totalData;
        paginationData.currentPage = data.currentPage;
        isLoading.value = false;
      } catch (error) {
        console.log(error);
      }
    };

    // Event
    const onClear = () => {
      Object.keys(search).forEach((key) => {
        if (typeof search[key] === "object" && search[key] !== null) {
          Object.keys(search[key]).forEach((subKey) => {
            search[key][subKey] = null;
          });
        } else {
          search[key] = null;
        }
      });
    };

    // Modal action

    const onDetailModal = (it: any) => {
      Object.assign(item, it);
      openDetailModal.value = true;
    };

    const onEditReviewerModal = () => {
      openEditReviewerModal.value = true;
    };

    const onHistoryDetailModal = (it: any) => {
      Object.assign(item, it);
      openHistoryDetailModal.value = true;
    };

    // Mounted
    onMounted(async () => {
      await fetchUser();
      await fetchItems();
    });

    // Watch
    watch(
      () => paginationData.currentPage,
      () => {
        fetchItems();
      }
    );

    watch(
      () => paginationData.perPage,
      () => {
        fetchItems();
      }
    );

    const goToEditPage = (id: number) => {
      router.push({ name: "review-edit", params: { id: id } });
    };

    const sortedItems = (key: any) => {
      if (sortKey.value === key) {
        sortOrder.value = sortOrder.value * -1;
      } else {
        sortKey.value = key;
      }

      if (!sortKey.value) return items;

      fetchItems();
    };

    return {
      search,
      items,
      item,
      paginationData,
      isLoading,
      fetchItems,
      fetchUser,

      onDetailModal,
      openDetailModal,
      openEditModal,
      onEditReviewerModal,

      openReceive1Modal,
      goToEditPage,
      openEditReviewerModal,
      user_item,
      sortKey,
      sortOrder,
      sortedItems,
      openHistoryDetailModal,
      onHistoryDetailModal,
    };
  },
});
</script>
