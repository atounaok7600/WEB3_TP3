<script>
import { RouterLink, RouterView } from 'vue-router'
import AuthLayout from '../layouts/AuthLayout.vue'

export default {
components: {
    AuthLayout
},
data() {
        return {
            mail: '',
            mdp: '',
            showErrors: false
        }
    },
    computed: {
        isMailValid(){
            return /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(this.mail);
        },
        isMdpValid(){
            return this.mdp.length >= 6
        },
        ErrMsg(){
            return !this.isMdpValid ? 'Adresse email ou mot de passe incorrecte.' : ''
        },
    },
    methods: {
        handleLogin(e) {
            if (this.isMailValid && this.isMdpValid){
                const data = {
                    email: this.mail,
                    password: this.mdp,
                }
    
                fetch('http://localhost:3000/auth/login', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(data),
                })
                .then(res => {
                    if(!res.ok) {
                        throw new Error('Erreur réseau ou serveur')
                    }
                    return res.json()
                })
                .then(data => {
                    console.log('Success: ', data )
                    window.location.href = '/'
                })
                .catch((err) => {
                    console.error("Error lors de l'envoi des données", err)
                })
            } else {
                this.showErrors = true
            }
        }
    }
}
</script>

<template>
    <AuthLayout>
        <div class="min-h-[100vh] flex justify-center items-center">
            <div class="p-16 flex justify-between items-center gap-6 border rounded-lg shadow-md">
                <div class="gap-6 px-8 flex flex-col items-center justify-center">
                    <img src="../assets/signin-image.jpg" alt="image creation compte">
                    <p class="font-thin">Vous n'avez pas de compte? <a class="text-blue-400 hover:text-blue-500" href="/signup">Créer un compte.</a></p>
                </div>

                <form @submit.prevent="handleLogin" class="py-6 px-8 flex flex-col h-auto gap-12 ">
                    <h2 class="text-3xl font-bold">Se connecter</h2>
        
                    <div class="flex flex-col gap-4">      
                        <div class="flex items-center gap-1 border-b">
                            <label for="mail">
                                <i class="zmdi zmdi-email"></i>
                            </label>
                            <input type="text" name="mail" v-model="mail" class="px-3 py-2 rounded-md focus:outline-none font-thin" placeholder="Email" required>
                        </div>
        
                        <div class="flex items-center gap-1 border-b">
                            <label for="mdp">
                                <i class="zmdi zmdi-lock"></i>
                            </label>
                            <input type="password" name="mdp" v-model="mdp" class="px-3 py-2 rounded-md focus:outline-none font-thin" placeholder="Mot de passe" required>
                        </div>
                        <div class="text-red-400" v-if="showErrors">{{ ErrMsg }}</div>
                    </div>
    
                    <div class="flex justify-between gap-4">
                            <input type="submit" class="border w-full py-2 px-4 bg-orange-400 hover:cursor-pointer hover:bg-orange-500">
                            <a href="/" class="border w-full text-center py-2 px-4 bg-slate-200 hover:cursor-pointer hover:bg-slate-300">Annuler</a>
                    </div>
                </form>
            </div>
        </div>
    </AuthLayout>
</template>
