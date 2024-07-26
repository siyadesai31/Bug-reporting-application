<template>
  <q-layout view="lHh Lpr lFf">
    <q-header elevated>
      <q-toolbar>
        <q-toolbar-title>
          Bug Reporting Application
        </q-toolbar-title>

        <!-- Right-aligned logout button -->
        <q-btn
          flat
          dense
          round
          icon="logout"
          @click="logout"
          class="q-ml-auto"
        />
      </q-toolbar>
    </q-header>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'


defineOptions({
  name: 'MainLayout'
})

const router = useRouter()

function logout() {
  router.push('/') // Navigate to IndexPage.vue
}
</script>

<style scoped>
.q-toolbar-title {
  flex: 1;
}
</style>
