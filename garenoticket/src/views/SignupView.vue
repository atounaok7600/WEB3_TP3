<script>
    import { RouterLink, RouterView } from 'vue-router'
    import AuthLayout from '../layouts/AuthLayout.vue'

    export default {
    components: {
        AuthLayout
    }
    }
</script>

<template>
    <AuthLayout>
        <div class="min-h-[100vh] flex justify-center items-center">
            <div class="p-16 flex justify-center items-center gap-6 border rounded-lg shadow-md">
                <Form class="py-6 px-8 h-full flex flex-col gap-12">
                    <h2 class="text-3xl font-bold">Créer un compte</h2>
        
                    <div class="flex flex-col gap-4">
                        <div class="flex items-center gap-1 border-b">
                            <label for="nom">
                                <i class="zmdi zmdi-account zmdi-hc-lg"></i>
                            </label>
                            <input type="text" name="nom" class="px-3 py-2 rounded-md focus:outline-none font-thin" placeholder="Nom complet" required>
                        </div>
        
                        <div class="flex items-center gap-1 border-b">
                            <label for="mail">
                                <i class="zmdi zmdi-email"></i>
                            </label>
                            <input type="text" name="mail" class="px-3 py-2 rounded-md focus:outline-none font-thin" placeholder="Email" required>
                        </div>
        
                        <div class="flex items-center gap-1 border-b">
                            <label for="mdp">
                                <i class="zmdi zmdi-lock"></i>
                            </label>
                            <input type="text" name="mdp" class="px-3 py-2 rounded-md focus:outline-none font-thin" placeholder="Mot de passe" required>
                        </div>
        
                        <div class="flex items-center gap-1 border-b">
                            <label for="cmpd">
                                <i class="zmdi zmdi-lock-outline"></i>
                            </label>
                            <input type="text" name="cmdp" class="px-3 py-2 rounded-md focus:outline-none font-thin" placeholder="Confirmer Mot de passe" required>
                        </div>
    
                    </div>
    
                    <div class="flex justify-between gap-4">
                            <input type="submit" class="border w-full py-2 px-4 bg-orange-400 hover:cursor-pointer hover:bg-orange-500">
                            <v-btn to="/" class="border w-full text-center py-2 px-4 bg-slate-200 hover:cursor-pointer hover:bg-slate-300">Annuler</v-btn>
                    </div>
                </Form>
    
                <div class="py-12 px-8 h-full flex flex-col items-center justify-center">
                    <img src="../assets/signup-image.jpg" alt="image creation compte">
                    <p class="font-thin">Vous avez déjà un compte? <a class="text-blue-400 hover:text-blue-500" href="/signup">Se connecter.</a></p>
                </div>
            </div>
        </div>
    </AuthLayout>
</template>
