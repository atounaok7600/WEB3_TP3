<script setup>
import AppLayout from '../layouts/AppLayout.vue';
import { ref, onMounted } from 'vue'
import L from 'leaflet'
import mapMarkerRed from '../assets/map-marker-red.svg';
import mapMarkerBlue from '../assets/map-marker-blue.svg';
import { toast } from 'vue3-toastify';
import moment from 'moment-timezone'

  const coords = {
    lat: ref(0),
    lng: ref(0),
  }
  let marker;
  let carMarker;
  const map = ref()
  const mapContainer = ref()

  const valet = ref(null);
  const users = ref(null);
  const timeRemaingPerUser = ref([])
  const showConfirmationModal = ref(false);

  const isTableHovered = ref(false);

  // Permet de demander la localisation du valet.
  const getLocation = () => {
    if(navigator.geolocation){
      navigator.geolocation.watchPosition((pos) => {

        coords.lat.value = pos.coords.latitude
        coords.lng.value = pos.coords.longitude

        // On met le marker au centre
        setView();
      })
    }
  }

  // On ajoute le marker du valet
  const updateValetMarkerPosition = () => {
    const redIcon = new L.Icon({
      iconUrl: mapMarkerRed,
      iconSize: [35, 35]
    })

    if(!marker){

      marker = L.marker([coords.lat.value, coords.lng.value], { icon: redIcon })
      .addTo(map.value)
      .bindPopup(`Ma position`);
    } else {
      marker.setLatLng([coords.lat.value, coords.lng.value], { icon: redIcon });
    }
  }

  // On ajoute le marker des voitures
  const updateCarsMarkers = () => {
    const buleIcon = new L.Icon({
      iconUrl: mapMarkerBlue,
      iconSize: [35, 35]
    })

    // Supprimer tous les marqueurs bleu
    map.value.eachLayer((layer) => {
      if(layer.options.icon && layer.options.icon.options.iconUrl === mapMarkerBlue) {
        map.value.removeLayer(layer);
      }
    })

    // Ajouter les nouveaux marqueurs bleu
    users.value.forEach(user => {
      const car = user.voiture;
      if(car && car.isParked && car.latitude && car.longitude){
        carMarker = L.marker([car.latitude, car.longitude], { icon: buleIcon })
          .addTo(map.value)
          .bindPopup(`Voiture de ${user.username}`);
      }
    });
  }

  // On cherche le valet dans la bd
  const getValet = async () => {
    try {
      const response = await fetch(`http://localhost:3000/user/`, {
          method: 'GET',
          headers: {
              'Authorization': 'Bearer ' + localStorage.getItem('token')
          },
      });

      if(response.ok){
          const data = await response.json();
          if(!data.user.isValet){
            window.location.href = '/maplace'
          }
          valet.value = data.user;
      }else{
          window.location.href = '/login'
      }
    } catch (error) {
      console.log(error)
    }
  }

  // On cherche toutes les voitures stationnées
  const getCars = async () => {
    try {
      const response = await fetch(`http://localhost:3000/users/`, {
          method: 'GET',
          headers: {
              'Authorization': 'Bearer ' + localStorage.getItem('token')
          },
      });

      if(response.ok){
          const data = await response.json();
          users.value = data.users;

          updateCarsMarkers();
      }else{
          window.location.href = '/login'
      }
    } catch (error) {
      console.log(error)
    }
  }

  // Focus sur la position actuelle
  const setView = () => {
    map.value.setView([coords.lat.value, coords.lng.value]);
    updateValetMarkerPosition();
  }

  // Focus sur la position actuelle de la voiture
  const viewCar = (latitude, longitude) => {
    map.value.setView([latitude, longitude], 15);
  }

  // Converti le temps en secondes
  const timeConvertion = (utcTime) => {
    const targetTime = moment.utc(utcTime).tz('America/Toronto');
    const now = new Date();

    const timeDifference = targetTime - now;

    const timeRemainingInSeconds = Math.floor(timeDifference / 1000);

    if(timeRemainingInSeconds <= 0) {
      return "Temps écoulé!"
    }

    return timeRemainingInSeconds + ' s';
  }

  const handleMouseEnter = () => {
    isTableHovered.value = false;
  }

  const handleMouseLeave = () => {
    isTableHovered.value = true;
  }

  // Fait couler les secondes restantes
  const updateRemainingTime = () => {
    if(users.value){
      timeRemaingPerUser.value = users.value.map(user => {
      return timeConvertion(user.voiture.timeToLeave);
    });
    }
  }

  onMounted(async () => {
    // Initialiser la carte
    map.value = L.map(mapContainer.value).setView([51.505, -0.09], 13);

    // Tuiles de la carte
    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
    }).addTo(map.value);
    
    // On charge le user et la voiture
    await getValet();
    await getCars();

    // Obtenir la localisation du user
    getLocation();

    // Fait couler le temps restant des véhicules stationnés
    setInterval(updateRemainingTime, 1000);

  });
</script>

<template>
  <AppLayout>
    <div class="relative overflow-x-hidden">
      <div ref="mapContainer" class="h-full z-[1] page-container"></div>

      <div class="absolute top-5 right-5 z-[1]  rounded-lg flex flex-col gap-4">
        <div class="flex items-center justify-end">
            <button @click="setView" class="bg-white px-4 py-2 rounded-lg h-fit
              transition ease-in-out delay-75 drop-shadow-lg
              hover:-translate-y-1 hover:scale-125 hover:bg-slate-100">
              <i class="zmdi zmdi-gps-dot text-red-600"></i>
            </button>
          </div>
        <div v-if="users" @mouseover="handleMouseEnter" @mouseleave="handleMouseLeave"
         class="flex flex-col gap-2 p-4 bg-white rounded-lg shadow-md max-h-[50vh] overflow-auto table-container" :class="{ 'table-hovered': isTableHovered }">
          <table class="table-auto">
            <thead class="">
              <tr class="">
                <th class="border-b p-2">Propriétaire</th>
                <th class="border-b p-2">Marque</th>
                <th class="border-b p-2">Modèle</th>
                <th class="border-b p-2">Immatriculation</th>
                <th class="border-b p-2">Couleur</th>
                <th class="border-b p-2">Temps restant</th>
                <th class="border-b p-2">Déplacer la voiture</th>
              </tr>
            </thead>
            <tbody>
              <tr class="font-thin text-center" v-for="(user, index) in users" :key="user._id">
                <td class=" p-4">{{ user.username }}</td>
                <td class=" p-4">{{ user.voiture.marque }}</td>
                <td class=" p-4">{{ user.voiture.modele }}</td>
                <td class=" p-4">{{ user.voiture.plaque }}</td>
                <td class=" p-4">{{ user.voiture.couleur }}</td>
                <td class=" p-4 max-w-[200px]">{{ timeRemaingPerUser[index] }}</td>
                <td class="p-2 flex gap-4">
                  <button @click="viewCar(user.voiture.latitude, user.voiture.longitude)" class="bg-white border px-4 py-2 rounded-lg h-fit hover:bg-slate-100">
                    <i class="zmdi zmdi-gps-dot text-blue-600"></i>
                  </button>
                  <button class="bg-green-400 hover:bg-green-300 px-4 py-2 rounded-md w-full">Déplacer</button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <div v-else class="flex gap-6">
          <div class="px-4 py-2 h-[25vh] w-[25vw] rounded-lg shadow-md img-carMoving flex justify-center items-end">
            <p class="font-thin text-center bg-white px-2 py-1 rounded-lg">Aucune voiture n'est stationnée pour le moment.</p>
          </div>
          <button @click="setView" class="bg-white px-4 py-2 rounded-lg h-fit
            transition ease-in-out delay-75 drop-shadow-lg
            hover:-translate-y-1 hover:scale-125 hover:bg-slate-100">
            <i class="zmdi zmdi-gps-dot"></i>
          </button>
        </div>
      </div>

      <!-- Model de confirmation de stationnement -->
      <div v-if="showConfirmationModal" class="modal-overlay z-[2]">
        <div class="modal bg-white w-[20vw] p-6 rounded-lg flex flex-col gap-8">
            <p class="text-center text-lg font-thin">Veuillez vérifier que votre voiture est bien stationnée à l'endroit indiqué sur la carte, ou déplacer le marqueur sur la position de votre voiture.</p>
            <div class="flex justify-between gap-8">
                <button @click="carParked" class="border py-2 w-full text-white bg-green-600 hover:bg-green-500 rounded-md flex items-center justify-center gap-2">Je confirme</button>
                <button @click="() => { showConfirmationModal = false }" class="border py-2 w-full  hover:bg-slate-200 rounded-md">Annuler</button>
            </div>
        </div>
      </div>
    </div>
  </AppLayout>
</template>

<style scoped>
  .img-carMoving{
    background-image: url("../assets/carMoving2.gif");
    background-size: cover;
    background-position: center;
  }

  .table-container {
    transition: margin-right 0.5s ease-out;
    margin-right: 0;
  }

  .table-hovered {
    margin-right: -40vw;
  }

  .table-container table {
    transition: opacity 0.5s ease-out;
    opacity: 1;
  }

  .table-hidden table {
    opacity: 0;
  }
</style>
