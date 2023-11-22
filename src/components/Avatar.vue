<script setup>
import { computed } from 'vue'

const props = defineProps({
  url: {
    type: String,
    required: true
  },
  alt: {
    type: String,
    default: null
  },
})

const avatar = computed(() => props.url)
const alt = computed(() => props.alt)
</script>

<template>
  <div>
    <img
      :src="avatar"
      :alt="alt"
      class="block h-auto w-full max-w-full bg-gray-100 dark:bg-slate-800"
    />
    <slot />
  </div>
</template>
