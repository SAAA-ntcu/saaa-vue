<template>
  <div class="flex flex-col min-h-screen overflow-x-hidden main_bg pt-16 lg:pt-20 pb-32 md:pb-36">
    <AppHeader />
    <NotebookFrame>
      <router-view v-slot="{ Component }">
        <transition name="fade" mode="out-in">
          <component :is="Component" />
        </transition>
      </router-view>
    </NotebookFrame>
    <AppFooter />
  </div>
</template>

<script setup>
import AppHeader from './components/layout/AppHeader.vue'
import AppFooter from './components/layout/AppFooter.vue'
import NotebookFrame from './components/layout/NotebookFrame.vue'
</script>

<style>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.18s ease-in-out;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
