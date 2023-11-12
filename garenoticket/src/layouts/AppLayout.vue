<script setup>
    import { RouterLink, RouterView } from 'vue-router'
    import Navbar from '../components/Navbar.vue';
    import FooterView from '../components/FooterView.vue'
</script>

<template>
    <div class="min-w-screen min-h-screen flex flex-col">
        <Navbar/>

        <div>
            <slot></slot>
        </div>

        <FooterView/>
    </div>
</template>
