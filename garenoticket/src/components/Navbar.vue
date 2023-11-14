<script>
    import { RouterLink, RouterView } from 'vue-router'
    import { useRouter } from 'vue-router';

    export default {
        data() {
            return{
                imgSrc: ''
            }
        },
        setup() {
            const router = useRouter();
            
            const handleLogout = () => {
                localStorage.removeItem('token');
                router.push('/login');
            }

            return {
                handleLogout
            }
        },
        async mounted() {
        try {
            const response = await fetch(`http://localhost:3000/user/`, {
                method: 'GET',
                headers: {
                    'Authorization': 'Bearer ' + localStorage.getItem('token')
                },
            });

            if(response.ok){
                const data = await response.json();
                this.user = data.user;
                console.log('Data from API:', this.user.isValet);
                this.imgSrc = `https://i.pravatar.cc/1000?u=${this.user._id}`;
            }else{
                this.error = 'Erreur lors de la récupération des donnée du user'
                window.location.href = '/login'
            }
        } catch (error) {
            this.error = 'Erreur inattendue'
        }finally{
            this.loading = false;
        }
    }

    }
</script>

<template>
    <header class="flex justify-between items-center py-2 px-5 w-full h-[75px]">
        <RouterLink to="/">
            <img alt="Vue logo" class="logo" src="@/assets/logo.svg" width="50" height="50" />
        </RouterLink>

        <nav class="flex gap-2">
            <RouterLink to="/" class="py-2 px-4 hover:bg-slate-200 rounded-md">Accueil</RouterLink>
            <RouterLink to="/maplace" class="py-2 px-4 hover:bg-slate-200 flex items-center gap-2 rounded-md"><i class="zmdi zmdi-map"></i>Ma place</RouterLink>
            <RouterLink to="/valet" class="py-2 px-4 hover:bg-slate-200 flex items-center gap-2 rounded-md"><i class="zmdi zmdi-car"></i>Valet</RouterLink>
            <RouterLink to="/profil" class="py-2 px-4 hover:bg-slate-200 flex items-center gap-2 rounded-md">
                <img :src="imgSrc" class="w-[20px] h-[20px] rounded-md object-cover" alt="photo de profile">
                Profil
            </RouterLink>
            <a @click="handleLogout" class="py-2 px-4 hover:cursor-pointer hover:bg-slate-200 flex items-center gap-2 rounded-md"><i class="zmdi zmdi-square-right"></i> Se déconnecter</a>
        </nav>
    </header>
</template>

