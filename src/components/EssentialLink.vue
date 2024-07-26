<template>
  <router-link :to="link" class="essential-links">
  <q-item
    clickable
    tag="a"
    target="_blank"
  >
    <q-item-section
      v-if="props.icon"
      avatar
    >
      <q-icon :name="props.icon" />
    </q-item-section>

    <q-item-section>
      <q-item-label>{{ props.title }}</q-item-label>
      <q-item-label caption>{{ props.caption }}</q-item-label>
    </q-item-section>
  </q-item>
  </router-link>
</template>

<script setup>
defineOptions({
  name: 'EssentialLink'
})

const props = defineProps({
  title: {
    type: String,
    required: true
  },

  caption: {
    type: String,
    default: ''
  },

  link: {
    type: [String,Object],
    required: true
  },

  icon: {
    type: String,
    default: ''
  }
})
</script>

<style scoped>
.essential-links{
  text-decoration: none;
  color: inherit;
}
</style>

