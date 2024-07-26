<template>
  <div>
    <h5>Hello Admin</h5>
    <div><Task /></div>
  </div>
</template>

<script setup>
import Task from '../components/Task.vue'
</script>

<style>
h5{
  background-color: lavender;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0;
  padding: 20px;
  color: blueviolet;
  font-weight: 500;
  font-size: 1cm;
}
</style>
