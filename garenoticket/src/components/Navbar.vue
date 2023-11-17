<script>
    import { RouterLink, RouterView } from 'vue-router'
    import { useRouter } from 'vue-router';

    export default {
        data(){
            return{
                imgSrc: '',
            }
        },
        props:{
            userId: {
                type: String,
                default: 0
            }
        },
        setup(){
            const router = useRouter();
        },
        methods: {     
            userExist(){
                if(this.userId){
                    this.imgSrc = `https://i.pravatar.cc/1000?u=${this.userId}`
                    return true
                }else{
                    return false
                }
            },    
            handleLogout() {
                localStorage.removeItem('token');
                window.location.href = '/login';
            }
        },
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
                <img :src="userExist() ? this.imgSrc : 'https://i.pravatar.cc/1000?u=${this.userId}'" class="w-[20px] h-[20px] rounded-md object-cover" alt="-">
                Profil
            </RouterLink>
            <button @click="handleLogout" class="
                transition ease-in-out delay-100 
                hover:translate-x-2 hover:scale-110
                py-2 px-4 hover:cursor-pointer 
                hover:bg-slate-200 flex items-center 
                
                gap-2 rounded-md">
                <i class="zmdi zmdi-square-right"></i>
            </button>
        </nav>
    </header>
</template>

