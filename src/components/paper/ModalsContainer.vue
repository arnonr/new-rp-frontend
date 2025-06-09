<template>
  <div>
    <!-- Edit User Modal -->
    <div id="edit-user-modal">
      <EditUserPage
        v-if="modals.editUser"
        :id="userItem.id"
        @close-modal="$emit('closeEditUser')"
        @reload="$emit('reloadUser')"
      />
    </div>

    <!-- Detail Modal -->
    <div id="detail-modal">
      <DetailPage
        v-if="modals.detail"
        :paper_id="selectedItem.id"
        @close-modal="$emit('closeDetail')"
      />
    </div>

    <!-- History Detail Modal -->
    <div id="history-detail-modal">
      <HistoryDetailPage
        v-if="modals.historyDetail"
        :paper_id="selectedItem.id"
        @close-modal="$emit('closeHistoryDetail')"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
// Components
import EditUserPage from "@/views/user/EditUser.vue";
import DetailPage from "@/views/paper/DetailModal.vue";
import HistoryDetailPage from "@/views/paper/HistoryDetailModal.vue";

// Props
defineProps({
  userItem: { type: Object, required: true },
  selectedItem: { type: Object, required: true },
  modals: { type: Object, required: true },
});

// Emits
defineEmits<{
  closeEditUser: [];
  closeDetail: [];
  closeHistoryDetail: [];
  reloadUser: [];
}>();
</script>
