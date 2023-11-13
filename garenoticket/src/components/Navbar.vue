<script>
    import { RouterLink, RouterView } from 'vue-router'
    import { checkAuth } from '../utils/checkAuth';
    import { useRouter } from 'vue-router';

    export default {
        setup() {
            const router = useRouter();
            const { isLogged } = checkAuth();
            
            const handleLogout = () => {
                localStorage.removeItem('token');
                isLogged.value = false;
                router.push('/login');
            }

            return {
                isLogged,
                handleLogout
            }
        }
    }
</script>

<template>
    <header class="flex justify-between items-center py-2 px-5">
        <RouterLink to="/">
            <img alt="Vue logo" class="logo" src="@/assets/logo.svg" width="50" height="50" />
        </RouterLink>

        <nav class="flex gap-2">
            <RouterLink to="/" class="py-2 px-4 hover:bg-slate-200">Accueil</RouterLink>
            <RouterLink to="/maplace" class="py-2 px-4 hover:bg-slate-200 flex items-center gap-2"><i class="zmdi zmdi-pin-drop"></i>Ma place</RouterLink>
            <RouterLink to="/valet" class="py-2 px-4 hover:bg-slate-200 flex items-center gap-2"><i class="zmdi zmdi-car"></i>Valet</RouterLink>
            <RouterLink to="/profil" class="py-2 px-4 hover:bg-slate-200 flex items-center gap-2"><i class="zmdi zmdi-account"></i> Profil</RouterLink>
            <a @click="handleLogout" class="py-2 px-4 hover:cursor-pointer hover:bg-slate-200">Se déconnecter</a>
        </nav>
    </header>
</template>

