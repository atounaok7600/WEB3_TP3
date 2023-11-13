<script>
    import { RouterLink, RouterView } from 'vue-router'
    import AuthLayout from '../layouts/AuthLayout.vue'

    export default {
    components: {
        AuthLayout
    },
    data() {
        return {
            nom: '',
            mail: '',
            mdp: '',
            mdp_confirm: '',
            showErrors: false
        }
    },
    computed: {
        isNomValid() {
            return this.nom.length >= 3 && this.nom.length <= 50
        },
        nomErrMsg(){
            return !this.isNomValid ? 'Le nom doit contenir entre 3 et 50 caractères.' : ''
        },
        isMailValid(){
            return /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(this.mail);
        },
        mailErrMsg(){
            return !this.isMailValid ? 'Le courriel doit être valide.' : ''
        },
        isMdpValid(){
            return this.mdp.length >= 6
        },
        mdpErrMsg(){
            return !this.isMdpValid ? 'Le mot de passe doit contenir au moins 6 caractères.' : ''
        },
        isCMdpValid(){
            return this.mdp_confirm === this.mdp
        },
        cMdpErrMsg(){
            return !this.isCMdpValid ? 'La confirmation du mot de passe doit être identique au mot de passe' : ''
        },
    },
    methods: {
        handleSubmit(e) {
            if (this.isNomValid && this.isMailValid && this.isMdpValid && this.isCMdpValid){
                const data = {
                    username: this.nom,
                    email: this.mail,
                    password: this.mdp,
                    confirmPassword: this.mdp_confirm,
                }
    
                fetch('http://localhost:3000/auth/signup', {
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
                    window.location.href = '/login'
                })
                .catch((err) => {
                    console.error("Erreur lors de l'envoi des données", err)
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
            <div class="p-16 flex justify-center items-center gap-6 border rounded-lg shadow-md">
                <form @submit.prevent="handleSubmit" class="py-6 px-8 h-full flex flex-col gap-12" autocomplete="off">
                    <h2 class="text-3xl font-bold">Créer un compte</h2>
        
                    <div class="flex flex-col gap-4">
                        <div class="flex items-center gap-1 border-b">
                            <label for="nom">
                                <i class="zmdi zmdi-account zmdi-hc-lg"></i>
                            </label>
                            <input type="text" name="nom" v-model="nom" class="px-3 py-2 rounded-md focus:outline-none font-thin" placeholder="Nom complet" required>
                        </div>
                        <div class="text-red-400" v-if="showErrors && !isNomValid">{{ nomErrMsg }}</div>
        
                        <div class="flex items-center gap-1 border-b">
                            <label for="mail">
                                <i class="zmdi zmdi-email"></i>
                            </label>
                            <input type="text" name="mail" v-model="mail" class="px-3 py-2 rounded-md focus:outline-none font-thin" placeholder="Email" required>
                        </div>
                        <div class="text-red-400" v-if="showErrors && !isMailValid">{{ mailErrMsg }}</div>
        
                        <div class="flex items-center gap-1 border-b">
                            <label for="mdp">
                                <i class="zmdi zmdi-lock"></i>
                            </label>
                            <input type="password" name="mdp" v-model="mdp" class="px-3 py-2 rounded-md focus:outline-none font-thin" placeholder="Mot de passe" required>
                        </div>
                        <div class="text-red-400" v-if="showErrors && !isMdpValid">{{ mdpErrMsg }}</div>
        
                        <div class="flex items-center gap-1 border-b">
                            <label for="cmpd">
                                <i class="zmdi zmdi-lock-outline"></i>
                            </label>
                            <input type="password" name="cmdp" v-model="mdp_confirm" class="px-3 py-2 rounded-md focus:outline-none font-thin" placeholder="Confirmer Mot de passe" required>
                        </div>
                        <div class="text-red-400" v-if="showErrors && !isCMdpValid">{{ cMdpErrMsg }}</div>
    
                    </div>
    
                    <div class="flex justify-between gap-4">
                            <input type="submit" class="border w-full py-2 px-4 bg-orange-400 hover:cursor-pointer hover:bg-orange-500">
                            <a href="/" class="border w-full text-center py-2 px-4 bg-slate-200 hover:cursor-pointer hover:bg-slate-300">Annuler</a>
                    </div>
                </form>
    
                <div class=" px-8 h-full flex flex-col gap-6 items-center justify-center">
                    <img src="../assets/signup-image.jpg" alt="image creation compte">
                    <p class="font-thin">Vous avez déjà un compte? <a class="text-blue-400 hover:text-blue-500" href="/login">Se connecter.</a></p>
                </div>
            </div>
        </div>
    </AuthLayout>
</template>
