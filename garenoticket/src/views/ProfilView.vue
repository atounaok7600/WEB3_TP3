<script>
  import AppLayout from '../layouts/AppLayout.vue'
  import ProfileInput from '../components/ProfileInput.vue';
  import { toast } from 'vue3-toastify';

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
            imgSrc: '',
            showConfirmationModal: null,
        }
    },
    methods: {
        openConfirmationModal(){this.showConfirmationModal = true;},
        closeConfirmationModal(){this.showConfirmationModal = false;},
        deleteUserConfirmed(){

            fetch('http://localhost:3000/user/', {
                    method: 'DELETE',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': 'Bearer ' + localStorage.getItem('token')
                    },
                })
                .then(res => {
                    if(!res.ok) {
                        throw new Error('Erreur réseau ou serveur')
                    }
                })
                .then(data => {
                    toast.success('Votre compte à été supprimé', {
                        autoClose: 2000
                    })
                    setTimeout(() => {
                        window.location.href = '/signup'
                    }, 2000);
                })
                .catch((err) => {
                    console.error("Erreur lors de l'envoi des données", err)
                })
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
            // Attendez 5 secondes avant de désactiver le chargement
            setTimeout(() => {
                this.loading = false;
            }, 500);
        }
    }
  }
</script>

<template>
  <AppLayout>
    <div class="py-6 px-36 page-container flex items-center justify-center">
      <div v-if="loading" class="bg-white text-black py-8 px-6 rounded-md flex flex-col items-center justify-center gap-6">
        <div role="status">
            <svg aria-hidden="true" class="w-10 h-10 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor"/>
                <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill"/>
            </svg>
            <span class="sr-only">Loading...</span>
        </div>
        <p>Chargement des données...</p>
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
                <button @click.prevent="openConfirmationModal" class="text-red-500 hover:underline flex items-center justify-end gap-2"><i class="zmdi zmdi-delete"></i>Supprimer mon compte.</button>
            </div>

            <!-- Model de confirmation de suppression -->
            <div v-if="showConfirmationModal" class="modal-overlay">
                <div class="modal bg-white w-[20vw] p-6 rounded-lg flex flex-col gap-8">
                    <p class="text-center text-xl font-thin">Voulez-vous vraiment supprimer votre compte?</p>
                    <div class="flex justify-between gap-8">
                        <button @click="deleteUserConfirmed" class="border py-2 w-full text-white bg-red-500 hover:bg-red-400 rounded-md flex items-center justify-center gap-2"><i class="zmdi zmdi-delete"></i>Confirmer</button>
                        <button @click="closeConfirmationModal" class="border py-2 w-full  hover:bg-slate-200 rounded-md">Annuler</button>
                    </div>
                </div>
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
    .modal-overlay{
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.5);
        display: flex;
        align-items: center;
        justify-content: center;
    }
</style>
