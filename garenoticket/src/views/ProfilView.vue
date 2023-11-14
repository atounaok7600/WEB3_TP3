<script>
  import AppLayout from '../layouts/AppLayout.vue'
  import ProfileInput from '../components/ProfileInput.vue';

  export default {
    components: {
      AppLayout,
      ProfileInput
    },
    data() {
        return{
            user: null,
            loading: true,
            error: null,
            username: '',
            imgSrc: ''
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
  <AppLayout>
    <div class="py-6 px-36 page-container flex items-center justify-center">
      <div v-if="loading">
        Chargement...
      </div>
      <div v-else-if="error">
        {{ error }}
      </div>
      <div v-else class="flex border shadow-md min-h-full rounded-md bg-white">
        <div class="border-r w-1/3 py-4 px-6 flex flex-col gap-2">
            <img :src="imgSrc" class="rounded-md h-5/6 object-cover" alt="photo de profile">
            <div class="h-1/6">
                <p class="font-thin text-center flex items-center justify-center h-full text-5xl">Bonjour, {{ this.user.username }}.</p>
            </div>
        </div>        
        <div class="w-2/3 py-4 px-6 min-h-[70vh] flex flex-col gap-4 justify-between items-between">
            <div class="border-b flex flex-col p-2">
                <div class="flex items-center mb-4 justify-between w-full gap-4">
                    <div class="flex items-center gap-2">
                        <i class="zmdi zmdi-accounts-list"></i>
                        <h3 class="text-xl font-light">Mes infos</h3>
                    </div>
                    <button class="hover:bg-slate-200 border py-1 px-2.5 rounded-md">
                        <i class="zmdi zmdi-edit"></i>
                    </button>
                </div>

                <form class="flex flex-col gap-8">
                    <ProfileInput  
                        label="Username"
                        name="username"
                        :value="this.user.username ? this.user.username : ''"
                        placeholder="Nom complet"/>
                    
                    <ProfileInput  
                        label="Courriel"
                        name="courriel"
                        type="email"
                        :value="this.user.email ? this.user.email : ''"
                        placeholder="Adresse courriel"/>

                    <div class="flex justify-end">
                        <button type="submit" class="border py-1 px-4 hover:bg-slate-200 rounded-md">Enregistrer</button>
                    </div>
                </form>
            </div>

            <div v-if="user.isValet" class="border-b h-full flex flex-col p-2">
                <div class="flex items-center gap-4 mb-4  justify-between w-full">
                    <div class="flex items-center gap-2">
                        <i class="zmdi zmdi-money"></i>
                        <h3 class="text-xl font-light">Tarifs</h3>
                    </div>
                    <button class="hover:bg-slate-200 border py-1 px-2.5 rounded-md">
                        <i class="zmdi zmdi-edit"></i>
                    </button>
                </div>

                <form class="flex flex-col gap-8 h-full justify-between">
                    <ProfileInput  
                        label="Prix"
                        name="prix"
                        :value="''"
                        placeholder="Tarif pour chaque déplacement"/>
                        
                    <div class="flex justify-end mt-auto">
                        <button type="submit" class="border py-1 px-4 hover:bg-slate-200 rounded-md">Enregistrer</button>
                    </div>
                </form>
            </div>

            <div v-else class="border-b  flex flex-col p-2">
                <div class="flex items-center gap-4 mb-4  justify-between w-full">
                    <div class="flex items-center gap-2">
                        <i class="zmdi zmdi-car"></i>
                        <h3 class="text-xl font-light">Ma voiture</h3>
                    </div>
                    <button class="hover:bg-slate-200 border py-1 px-2.5 rounded-md">
                        <i class="zmdi zmdi-edit"></i>
                    </button>
                </div>

                <form class="flex flex-col gap-8 ">
                    <ProfileInput  
                        label="Marque"
                        name="marque"
                        :value="''"
                        placeholder="Marque de la voiture"/>

                    <ProfileInput  
                        label="Modèle"
                        name="modele"
                        :value="''"
                        placeholder="Modèle de la voiture"/>

                    <ProfileInput  
                        label="Couleur"
                        name="couleur"
                        :value="''"
                        placeholder="Couleur de la voiture"/>

                    <ProfileInput  
                        label="Plaque"
                        name="plaque"
                        :value="''"
                        placeholder="Immatriculation de la voiture"/>
                        
                    <div class="flex justify-end">
                        <button type="submit" class="border py-1 px-4 hover:bg-slate-200 rounded-md">Enregistrer</button>
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

<style scoped>
    .page-container {
        background-image: url('../assets/bg-profil.jpg');
        background-size: cover;
        background-position: center;
    }
</style>
