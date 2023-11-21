<script>
    import { RouterLink, RouterView } from 'vue-router'
    import { useRouter } from 'vue-router';

    export default {
        data(){
            return{
                imgSrc: '',
                user: null,
            }
        },
        setup(){
            const router = useRouter();
        },
        methods: {     
            userExist(){
                if(this.user){
                    this.imgSrc = `https://i.pravatar.cc/1000?u=${this.user._id}`
                    return true
                }else{
                    return false
                }
            },  
            userIsValet() {
                if(this.user){
                    return this.user.isValet ? true : false;
                }
            },
            handleLogout() {
                localStorage.removeItem('token');
                window.location.href = '/login';
            },
              // On cherche le valet dans la bd
            async getUser() {
                try {
                const response = await fetch(`http://localhost:3000/user/`, {
                    method: 'GET',
                    headers: {
                        'Authorization': 'Bearer ' + localStorage.getItem('token')
                    },
                });

                if(response.ok){
                    const data = await response.json();
                    if (data.user) {
                        this.user = data.user;
                    } else {
                        window.location.href = '/login';
                    }
                }else{
                    window.location.href = '/login'
                }
                } catch (error) {
                console.log(error)
                }
            },
        },
        created() {
            this.getUser();
        },
    }
</script>

<template>
    <header :class="{ 'fixed': fixed }" class="flex justify-between items-center py-2 px-5 w-full h-[75px]">
        <RouterLink to="/">
            <img alt="Vue logo" class="logo" src="@/assets/logo.svg" width="50" height="50" />
        </RouterLink>

        <nav class="flex gap-2">
            <RouterLink to="/" class="py-2 px-4 hover:bg-slate-200 rounded-md">Accueil</RouterLink>
            <RouterLink v-if="userIsValet() === false" to="/maplace" class="py-2 px-4 hover:bg-slate-200 flex items-center gap-2 rounded-md"><i class="zmdi zmdi-map"></i>Ma place</RouterLink>
            <RouterLink v-if="userIsValet() === true" to="/valet" class="py-2 px-4 hover:bg-slate-200 flex items-center gap-2 rounded-md"><i class="zmdi zmdi-car"></i>Valet</RouterLink>
            <RouterLink to="/profil" class="py-2 px-4 hover:bg-slate-200 flex items-center gap-2 rounded-md">
                <img :src="userExist() ? this.imgSrc : 'https://i.pravatar.cc/1000?u=rien'" class="w-[20px] h-[20px] rounded-md object-cover" alt="-">
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

