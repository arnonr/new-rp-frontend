<template>
  <div class="empty-state">
    <div class="empty-state-content">
      <div class="empty-state-icon">
        <i class="bi bi-inbox"></i>
      </div>
      <h5 class="empty-state-title">ไม่พบข้อมูล</h5>
      <p class="empty-state-description">
        ขณะนี้ยังไม่มีข้อมูลที่แสดง โปรดลองใหม่อีกครั้ง
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
// Empty State Component
</script>

<style scoped>
.empty-state {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 300px;
  padding: 2rem;
}

.empty-state-content {
  text-align: center;
  max-width: 400px;
}

.empty-state-icon {
  margin-bottom: 1.5rem;
}

.empty-state-icon i {
  font-size: 4rem;
  color: #adb5bd;
}

.empty-state-title {
  color: #6c757d;
  font-weight: 500;
  margin-bottom: 0.75rem;
}

.empty-state-description {
  color: #adb5bd;
  font-size: 0.9rem;
  margin-bottom: 0;
  line-height: 1.5;
}
</style>
