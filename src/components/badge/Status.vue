<template>
  <span class="status-badge" :style="{ backgroundColor: status.bg_color }">
    {{ status.name_th }}
  </span>
</template>

<script setup lang="ts">
defineProps({
  status: { type: Object, required: true },
});

defineOptions({
  name: "StatusBadge",
});
</script>

<style scoped>
.status-badge {
  color: white;
  padding: 8px 16px;
  border-radius: 25px;
  font-weight: 600;
  font-size: 0.8rem;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  display: inline-block;
  min-width: 80px;
  text-align: center;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  border: 2px solid rgba(255, 255, 255, 0.2);
  transition: all 0.3s ease;
}

.status-badge:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
}
</style>
