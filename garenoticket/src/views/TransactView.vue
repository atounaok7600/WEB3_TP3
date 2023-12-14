<script setup>
import AppLayout from '../layouts/AppLayout.vue';
import { ref, onMounted } from 'vue'

const user = ref(null);
const solde = ref(0);
const factures = ref(null);
const historique = ref(null);

// Permet d'obtenir le montant total du solde à payer
const getSolde = () => {
    historique.value.forEach((deplacement) => {
        if(!deplacement.isPaid){
            solde.value += deplacement.price;
        }
    })
}

// Permet d'obtenir un historique de facturation
const getHistorique = async () => {
    try {
        const response = await fetch(`http://localhost:3000/historique/`, {
            method: 'GET',
            headers: {
                'Authorization': 'Bearer ' + localStorage.getItem('token')
            },
        });

        if(response.ok){
            const data = await response.json();

            if(data != null){
                historique.value = data.histo;
            }
        }
    } catch (error) {
        console.log(error)
    }
}

// Permet d'obtenir un historique des déplacements
const getDeplacements = () => {
    deplacements.value = [];
}

// Permet de s'assurer que le user est bien authentifié avant de continuer.
const verifLogin = async () => {
    try {
            const response = await fetch(`http://localhost:3000/user/`, {
                method: 'GET',
                headers: {
                    'Authorization': 'Bearer ' + localStorage.getItem('token')
                },
            });

            if(response.ok){
                const data = await response.json();
                user.value = data.user;
            }else{
                this.error = 'Erreur lors de la récupération des donnée du user'
                window.location.href = '/login'
            }
        } catch (error) {
            console.log(error)
        }
}

onMounted(async () => {
    // On verifie en premier voir si user authentifié
    await verifLogin();

    // On prend toutes les factures
    await getHistorique();

    // On charge le solde
    getSolde()
  });
</script>

<template>
    <AppLayout>
      <div class="py-6 px-36 page-container flex flex-col items-center gap-4">
        <div class="py-4 px-6 flex flex-col justify-between gap-4">
        <h2 class="font-ligth text-center text-5xl">Solde actuel</h2>
        <h3 class="font-thin text-center text-4xl">{{ solde }} <span>$</span></h3>
        <button v-if="solde > 0" class="border py-2 w-full text-white bg-green-500 hover:bg-green-300 rounded-md flex items-center justify-center gap-2"><i class="zmdi zmdi-money"></i>Payer</button>
        <button v-else disabled class="border py-2 w-full bg-slate-200 rounded-md flex items-center justify-center gap-2"><i class="zmdi zmdi-money"></i>Payer</button>
        </div>    

        <div class="py-4 border-t px-6 flex gap-12 justify-between">
            <div class="border-b flex flex-col p-2 min-h-[20vh] max-h-[50vh] overflow-y-auto min-w-[25vw]">
                <div class="flex items-center mb-4 justify-between w-full gap-4">
                    <div class="flex items-center gap-2">
                        <i class="zmdi zmdi-receipt"></i>
                        <h3 class="text-xl font-light">Historique des factures</h3>
                    </div>
                    <button class="hover:bg-slate-200 border py-1 px-2.5 rounded-md">
                        <i class="zmdi zmdi-edit"></i>
                    </button>
                </div>

                <div v-if="factures" class="h-full flex items-center justify-center">
                    <p class="text-2xl font-thin">Vous avez des factures.</p>
                </div>

                <div v-else class="h-full flex items-center justify-center">
                    <p class="text-2xl font-thin">Vous n'avez aucune facture au compte.</p>
                </div>
            </div>

            <div class="border-b flex flex-col p-2 min-h-[20vh] max-h-[50vh] overflow-y-auto min-w-[25vw]">
                <div class="flex items-center mb-4 justify-between w-full gap-4">
                    <div class="flex items-center gap-2">
                        <i class="zmdi zmdi-car"></i>
                        <h3 class="text-xl font-light">Historique des déplacements</h3>
                    </div>
                    <button class="hover:bg-slate-200 border py-1 px-2.5 rounded-md">
                        <i class="zmdi zmdi-edit"></i>
                    </button>
                </div>

                <div v-if="historique" class="h-full flex flex-col gap-2">
                    <li class=" list-none border bg-slate-100 px-4 py-2 text-center font-thin" v-for="deplacement in historique">
                     {{ deplacement.createdAt }} - {{ deplacement.price }} $ - {{ deplacement.isPaid }}
                    </li>
                </div>

                <div v-else class="h-full flex items-center justify-center">
                    <p class="text-2xl font-thin">Vous n'avez fait aucun déplacement.</p>
                </div>
            </div>
        </div> 
      </div>
    </AppLayout>
  </template>

<style lang="">
    
</style>