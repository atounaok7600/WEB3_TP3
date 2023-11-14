<script>
import { RouterLink, RouterView } from 'vue-router'
import AuthLayout from '../layouts/AuthLayout.vue'
import AuthInput from '../components/AuthInput.vue'

export default {
components: {
    AuthLayout,
    AuthInput,
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
                    localStorage.setItem('token', data.token)
                    
                    // Vérifie le rôle et redirige en conséquence
                    if (data.isValet) {
                        console.log(data.isValet)
                        window.location.href = '/valet';
                    } else {
                        window.location.href = '/maplace';
                    }
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

                <form @submit.prevent="handleLogin" class="py-6 px-8 flex flex-col h-auto gap-12" autocomplete="off">
                    <h2 class="text-3xl font-bold">Se connecter</h2>
        
                    <div class="flex flex-col gap-4">      
                        <AuthInput 
                            iconName="zmdi zmdi-email" 
                            name="mail" 
                            type="email"  
                            v-model="mail" 
                            placeholder="Email" 
                            required/>
        
                        <AuthInput 
                            iconName="zmdi zmdi-lock" 
                            name="mdp" 
                            type="password"  
                            v-model="mdp" 
                            placeholder="Mot de passes" 
                            required/>
                        <div class="text-red-400" v-if="showErrors">{{ ErrMsg }}</div>
                    </div>
    
                    <div class="flex justify-between gap-4">
                            <input type="submit" class="border w-full py-2 px-4 bg-orange-400 hover:cursor-pointer hover:bg-orange-500 rounded-md">
                            <input type="reset" class="border w-full text-center py-2 px-4 bg-slate-200 hover:cursor-pointer hover:bg-slate-300 rounded-md"/>
                    </div>
                </form>
            </div>
        </div>
    </AuthLayout>
</template>
