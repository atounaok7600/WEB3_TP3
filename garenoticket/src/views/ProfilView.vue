<script>
  import AppLayout from '../layouts/AppLayout.vue'

  export default {
    components: {
      AppLayout
    },
    data() {
        return{
            user: null,
            loading: true,
            error: null,
            username: '',
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
                console.log('Data from API:', this.user);
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
  <AppLayout>
    <div class="h-screen py-24 px-36">
      <div v-if="loading">
        Chargement...
      </div>
      <div v-else-if="error">
        {{ error }}
      </div>
      <div v-else class="flex border shadow-md h-full">
        <div class="border-r w-1/3 py-4 px-6 flex flex-col gap-2">
            <div class="flex flex-col h-1/2 border items-center justify-center">
                <div class="">
                    Votre photo
                </div>
                <p class="font-thin">Bonjour, {{ this.user.username }}</p>
            </div>
            <div class="h-1/2 border">
                
            </div>
        </div>        
        <div class="w-2/3 py-4 px-6 flex flex-col gap-4 justify-between items-between">
            <div class="border flex flex-col p-2">
                <div class="flex items-center justify-between w-full gap-4">
                    <div class="flex items-center gap-2">
                        <i class="zmdi zmdi-accounts-list"></i>
                        <h3 class="text-lg font-semibold">Mes infos</h3>
                    </div>
                    <button class="hover:bg-slate-200 border py-1 px-2.5">
                        <i class="zmdi zmdi-edit"></i>
                    </button>
                </div>

                <form class="flex flex-col gap-4">
                    <div class="flex flex-col gap-1">
                        <label for="usename">Username</label>
                        <input type="text" name="username" id="username" class="border py-1 px-2">
                    </div>
                    <div class="flex flex-col gap-1">
                        <label for="courriel">Courriel</label>
                        <input type="email" name="courriel" id="courriel" class="border py-1 px-2">
                    </div>
                    <div class="flex justify-end">
                        <button type="submit" class="border py-1 px-4">Enregistrer</button>
                    </div>
                </form>
            </div>

            <div class="border flex flex-col p-2">
                <div class="flex items-center gap-4 justify-between w-full">
                    <div class="flex items-center gap-2">
                        <i class="zmdi zmdi-car"></i>
                        <h3 class="text-lg font-semibold">Ma voiture</h3>
                    </div>
                    <button class="hover:bg-slate-200 border py-1 px-2.5">
                        <i class="zmdi zmdi-edit"></i>
                    </button>
                </div>

                <form class="flex flex-col gap-4">
                    <div class="flex flex-col gap-1">
                        <label for="usename">Marque</label>
                        <input type="text" name="username" id="username" class="border py-1 px-2">
                    </div>
                    <div class="flex flex-col gap-1">
                        <label for="courriel">Modèle</label>
                        <input type="email" name="courriel" id="courriel" class="border py-1 px-2">
                    </div>
                    <div class="flex flex-col gap-1">
                        <label for="usename">Couleur</label>
                        <input type="text" name="username" id="username" class="border py-1 px-2">
                    </div>
                    <div class="flex flex-col gap-1">
                        <label for="courriel">Plaque</label>
                        <input type="email" name="courriel" id="courriel" class="border py-1 px-2">
                    </div>
                    <div class="flex justify-end">
                        <button type="submit" class="border py-1 px-4">Enregistrer</button>
                    </div>
                </form>
            </div>

            <div class="text-end self-end">
                <a href="" class="text-red-500 hover:underline flex items-center justify-end gap-2"><i class="zmdi zmdi-delete"></i>Supprimer mon compte.</a>
            </div>
        </div>        
      </div>
    </div>
  </AppLayout>
</template>
