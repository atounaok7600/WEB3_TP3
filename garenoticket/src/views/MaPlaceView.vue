<script setup>
import AppLayout from '../layouts/AppLayout.vue';
import { ref, onMounted } from 'vue'
import L from 'leaflet'
import mapMarkerRed from '../assets/map-marker-red.svg';
import { toast } from 'vue3-toastify';

  const coords = {
    lat: ref(0),
    lng: ref(0),
  }
  let marker;
  const map = ref()
  const mapContainer = ref()

  const user = ref(null);
  const car = ref(null);
  const showConfirmationModal = ref(false);

  // Permet de demander la localisation du user.
  const getLocation = () => {
    if(navigator.geolocation){
      navigator.geolocation.watchPosition((pos) => {

        // On vérifie si la voiture est stationnée
        if(car && car.value && car.value.isParked){
          coords.lat.value = car.value.latitude;
          coords.lng.value = car.value.longitude;
        } else {
          coords.lat.value = pos.coords.latitude
          coords.lng.value = pos.coords.longitude
        }

        // On met le marker au centre
        setView();
      })
    }
  }

  // On ajoute le marker
  const updateMarkerPosition = () => {
    const redIcon = new L.Icon({
      iconUrl: mapMarkerRed,
      iconSize: [35, 35]
    })

    let isParked = true;

    if (car.value){
      isParked = car.value.isParked;
    }

    console.log('isParked: ' + isParked)

    if(!marker){

      marker = L.marker([coords.lat.value, coords.lng.value], { icon: redIcon, draggable: !isParked })
      .addTo(map.value)
      .bindPopup(car.value ? 'Ma voiture' : 'Ma position')
      .on('dragend', (e) => {
        const newLatLng = e.target.getLatLng();
        coords.lat.value = newLatLng.lat;
        coords.lng.value = newLatLng.lng;
      });
    } else {
      marker.setLatLng([coords.lat.value, coords.lng.value], { icon: redIcon, draggable: !isParked });
    }
  }

  // On cherche le user et sa voiture
  const getUserCar = async () => {
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
          if(data.user.voiture){
            car.value = data.user.voiture;
          }
      }else{
          window.location.href = '/login'
      }
    } catch (error) {
      console.log(error)
    }
  }

  // Fonction lorsque la voiture est laissée. 
  const carParked = async () => {
    if(car.value){
      car.value.isParked = true;
      car.value.latitude = coords.lat.value;
      car.value.longitude = coords.lng.value;
      car.value.timeToLeave = new Date();
      try {
        const response = await fetch(`http://localhost:3000/car/${user.value._id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + localStorage.getItem('token')
            },
            body: JSON.stringify(car.value),
        });
  
        if(response.ok){
            toast.success('Voiture parquée.', {
                autoClose: 2000
            });
  
            const data = await response.json();
            car.value = data.voiture ? data.voiture : null;
            showConfirmationModal.value = false;

            // On met le marker au centre
            getLocation();

            setTimeout(() => {
              window.location.href = '/maplace'
            }, 2000)

        } else {
            const errorData = await response.json();
            console.error(errorData);
            toast.error('Erreur lors de la mise à jours du véhicule.');
        }
      } catch (error) {
          console.error("Erreur lors de l'envoi des données", error);
      }
    } else{
      toast.error("Vous n'avez pas de voiture lier à votre compte. Ajoutez-en une pour continuer.", {
          autoClose: 5000
      });
    }

  }

  // Fonction lorsque la voiture est récupérée
  const carTaken = async () => {
    if(car.value){
      car.value.isParked = false;
      car.value.latitude = null;
      car.value.longitude = null;
      car.value.timeToLeave = null;
      try {
        const response = await fetch(`http://localhost:3000/car/${user.value._id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + localStorage.getItem('token')
            },
            body: JSON.stringify(car.value),
        });
  
        if(response.ok){
            toast.success('Voiture récupérée.', {
                autoClose: 2000
            });
  
            const data = await response.json();
            car.value = data.voiture ? data.voiture : null;

            // On affiche le marker sur la position du user.
            getLocation();

            setTimeout(() => {
              window.location.href = '/maplace'
            }, 2000)

        } else {
            const errorData = await response.json();
            console.error(errorData);
            toast.error('Erreur lors de la mise à jours du véhicule.');
        }
      } catch (error) {
          console.error("Erreur lors de l'envoi des données", error);
      }
    } else{
      toast.error("Vous n'avez pas de voiture lier à votre compte. Ajoutez-en une pour continuer.", {
          autoClose: 5000
      });
    }
  }

  // Focus sur la position actuelle
  const setView = () => {
    map.value.setView([coords.lat.value, coords.lng.value]);
    updateMarkerPosition();
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
    await getUserCar();

    // Obtenir la localisation du user
    getLocation();

  });
</script>

<template>
  <AppLayout>
    <div class="relative">
      <div ref="mapContainer" class="h-full z-[1] page-container"></div>
      <div class="absolute top-5 right-5 z-[1]">
        <div v-if="car" class="">
          <div v-if="car.isMoving" class="px-4 py-2 h-[15vh] rounded-lg shadow-md img-carMoving flex justify-center items-center">
            <p class="font-thin text-center bg-white px-2 py-1 rounded-lg">Votre voiture est en cours de déplacement</p>
          </div>
          <div v-else class=" flex gap-6">
            <button v-if="car.isParked" @click="carTaken" class="bg-white 
              hover:bg-slate-100 py-2 px-4 rounded-lg font-thin
              transition ease-in-out delay-75 drop-shadow-lg
              hover:-translate-y-1 hover:scale-110">
              J'ai récupéré ma voiture
            </button>
            <button v-else @click="() => { showConfirmationModal = true }" class="bg-white 
              hover:bg-slate-100 py-2 px-4 rounded-lg font-thin
              transition ease-in-out delay-75 drop-shadow-lg
              hover:-translate-y-1 hover:scale-125">
              Je laisse ma voiture
            </button>
            <button @click="setView" class="bg-white px-4 py-2 rounded-lg 
              transition ease-in-out delay-75 drop-shadow-lg
              hover:-translate-y-1 hover:scale-125 hover:bg-slate-100">
              <i class="zmdi zmdi-gps-dot"></i>
            </button>
          </div>
        </div>

        <div v-else class="flex gap-6">
          <a href="/profil"  class="bg-white 
            hover:bg-slate-100 py-2 px-4 rounded-lg font-thin
            transition ease-in-out delay-75 drop-shadow-lg
            hover:-translate-y-1 hover:scale-125">
            <i class="zmdi zmdi-plus me-2"></i>
            Ajouter une voiture
          </a>
          <button @click="setView" class="bg-white px-4 py-2 rounded-lg 
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
    background-image: url("../assets/carMoving.gif");
    background-size: cover;
    background-position: center;
  }
</style>