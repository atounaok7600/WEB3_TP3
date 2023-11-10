<script>
    import { RouterLink, RouterView } from 'vue-router'
</script>

<template>
    <header class="border">
        <img alt="Vue logo" class="logo" src="@/assets/logo.svg" width="50" height="50" />

        <nav>
            <RouterLink to="/">Home</RouterLink>
            <RouterLink to="/about">About</RouterLink>
        </nav>
    </header>
</template>

