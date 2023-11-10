<script setup>
import { RouterLink, RouterView } from 'vue-router'
import Navbar from './components/Navbar.vue';
import FooterView from './components/FooterView.vue'
</script>

<template>
  <body class="border min-w-screen min-h-screen flex flex-col">
    <Navbar/>

    <main class="">
      <RouterView />    
    </main>

    <FooterView/>
  </body>
</template>
