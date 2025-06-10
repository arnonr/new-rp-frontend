<template>
  <div>
    <!-- Detail Modal -->
    <div id="detail-modal">
      <DetailPage
        v-if="modals.detail"
        :paper_id="selectedItem.id"
        @close-modal="$emit('closeDetail')"
      />
    </div>

    <!-- Detail Modal -->
    <div id="reject-modal">
      <RejectPaperPage
        v-if="modals.reject"
        :item="selectedItem"
        @close-modal="$emit('closeReject')"
        @reload="$emit('reload')"
      />
    </div>

    <!-- History Detail Modal -->
    <div id="history-detail-modal">
      <HistoryDetailPage
        v-if="modals.historyDetail"
        :paper_id="selectedItem.id"
        :item="selectedItem"
        @close-modal="$emit('closeHistoryDetail')"
      />
    </div>

    <!-- Approve Modal -->
    <div id="approve-modal">
      <ApprovePaperPage
        v-if="modals.approve"
        :item="selectedItem"
        @close-modal="$emit('closeApprove')"
        @reload="$emit('reload')"
      />
    </div>

    <!-- Manage Review Modal -->
    <div id="manage-review-modal">
      <ManageReviewPaperPage
        v-if="modals.manageReview"
        :item="selectedItem"
        @close-modal="$emit('closeManageReview')"
        @reload="$emit('reload')"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
// Components
import DetailPage from "@/views/paper/DetailModal.vue";
import RejectPaperPage from "@/views/admin-paper/RejectModal.vue";
import ApprovePaperPage from "@/views/admin-paper/ApproveModal.vue";
import ManageReviewPaperPage from "@/views/admin-paper/ManageReviewModal.vue";
import HistoryDetailPage from "@/views/paper/HistoryDetailModal.vue";

// Props
defineProps({
  selectedItem: { type: Object, required: true },
  modals: { type: Object, required: true },
});

// Emits
defineEmits<{
  closeDetail: [];
  closeHistoryDetail: [];
  closeReject: [];
  closeApprove: [];
  closeCancel: [];
  closeManageReview: [];
  reload: [];
}>();
</script>
