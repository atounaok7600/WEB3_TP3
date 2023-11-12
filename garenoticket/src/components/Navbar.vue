<script>
    import { RouterLink, RouterView } from 'vue-router'
</script>

<template>
    <header class="flex justify-between items-center py-2 px-5">
        <RouterLink to="/">
            <img alt="Vue logo" class="logo" src="@/assets/logo.svg" width="50" height="50" />
        </RouterLink>

        <nav class="flex gap-2">
            <RouterLink to="/" class="py-2 px-4 hover:bg-slate-200">Accueil</RouterLink>
            <RouterLink to="/maplace" class="py-2 px-4 hover:bg-slate-200">Ma place</RouterLink>
            <RouterLink to="/valet" class="py-2 px-4 hover:bg-slate-200">Valet</RouterLink>
            <RouterLink to="/login" class="py-2 px-4 hover:bg-slate-200">Se connecter</RouterLink>
            <RouterLink to="/signup" class="py-2 px-4 hover:bg-slate-200">Créer un compte</RouterLink>
        </nav>
    </header>
</template>

