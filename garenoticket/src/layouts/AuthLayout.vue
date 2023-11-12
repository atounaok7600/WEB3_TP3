<script setup>
    import { RouterLink, RouterView } from 'vue-router'
</script>

<template>
    <div class="min-w-screen min-h-screen flex flex-col">

        <div>
            <slot></slot>
        </div>

    </div>
</template>