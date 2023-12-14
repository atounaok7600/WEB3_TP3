<script setup>
import AppLayout from '../layouts/AppLayout.vue';
import { ref, onMounted } from 'vue'
import L from 'leaflet'
import mapMarkerRed from '../assets/map-marker-red.svg';
import mapMarkerBlue from '../assets/map-marker-blue.svg';
import { toast } from 'vue3-toastify';
import moment from 'moment-timezone'
import { useRoute } from 'vue-router';

  const coords = {
    lat: ref(0),
    lng: ref(0),
  }
  let marker;
  let carMarker;
  const map = ref()
  const route = useRoute();
  const mapContainer = ref()

  const valet = ref(null);
  const userId = ref(route.params.userId);
  const user = ref(null);
  const car = ref(null);
  const showConfirmationModal = ref(false);


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

        let isMoving = true;

        if (car.value){
        isMoving = car.value.isMoving;
        }

        if(!marker){

        marker = L.marker([coords.lat.value, coords.lng.value], { icon: redIcon, draggable: isMoving})
        .addTo(map.value)
        .bindPopup(`Ma position`)
        .on('dragend', (e) => {
            const newLatLng = e.target.getLatLng();
            coords.lat.value = newLatLng.lat;
            coords.lng.value = newLatLng.lng;
        });
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
    if(car.value && car.value.isParked && car.value.latitude && car.value.longitude){
        carMarker = L.marker([car.value.latitude, car.value.longitude], { icon: buleIcon })
        .addTo(map.value)
        .bindPopup(`Véhicule de ${user.value.username}`)
    }
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
  const getCar = async () => {
    try {
        const response = await fetch(`http://localhost:3000/user/${userId.value}`, {
            method: 'GET',
        });

      if(response.ok){
        const data = await response.json();
        user.value = data.user;
        car.value = user.value.voiture

        if(car.value.latitude && car.value.longitude){
            updateCarsMarkers();
        }

      }else{
        console.log("Erreur lors de la récupération de la voiture")
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

  // Fonction lorsque la voiture est stationnée. 
  const carParked = async () => {
    if(car.value){
      car.value.isParked = true;
      car.value.isMoving = false;
      car.value.latitude = coords.lat.value;
      car.value.longitude = coords.lng.value;
      car.value.timeToLeave = timeToLeaveCalc();
      console.log(timeToLeaveCalc())
      try {
        const response = await fetch(`http://localhost:3000/car/${userId.value}`, {
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
            await facturation();
            getLocation();
            updateCarsMarkers();

            setTimeout(() => {
                window.location.href = `/valet`
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
      toast.error("Aucune voiture au dossier.", {
          autoClose: 5000
      });
    }

  }

  // Fonction qui permet de facturer le trajet au user
  const facturation = async () => {
    const userId = user.value._id
    console.log("Voici user pour trajet: " + userId + " - " + user.value.username)

    try {
        const response = await fetch(`http://localhost:3000/historique`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + localStorage.getItem('token')
            },
            body: JSON.stringify({ carUserId: userId, valetPrice: valet.value.price }),
        });
  
        if(response.ok){

        } else {
            const errorData = await response.json();
            console.error(errorData);
            toast.error('Erreur lors de la mise à jours du véhicule.');
        }
      } catch (error) {
          console.error("Erreur lors de l'envoi des données", error);
      }
  }

  // Fonction lorsque la voiture est récupérée
  const carTaken = async () => {
    if(car.value){
      car.value.isParked = false;
      car.value.isMoving = true;
      car.value.valet = valet.value._id;
      car.value.latitude = null;
      car.value.longitude = null;
      car.value.timeToLeave = null;
      try {
        const response = await fetch(`http://localhost:3000/car/${userId.value}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + localStorage.getItem('token')
            },
            body: JSON.stringify(car.value),
        });
  
        if(response.ok){
            toast.success('Voiture récupérée.', {
                autoClose: 1000
            });
  
            const data = await response.json();
            car.value = data.voiture ? data.voiture : null;
            console.log('Data lat: ' + car.value.latitude)
            console.log('Data long: ' + car.value.longitude)
            
            // On affiche le marker sur la position du user.
            getLocation();
            updateCarsMarkers();

            setTimeout(() => {
              window.location.href = `/movecar/${userId.value}`
            }, 1000)

        } else {
            const errorData = await response.json();
            console.error(errorData);
            toast.error('Erreur lors de la mise à jours du véhicule.');
        }
      } catch (error) {
          console.error("Erreur lors de l'envoi des données", error);
      }
    } else{
      toast.error("Cette voiture n'existe pas au dossier.", {
          autoClose: 5000
      });
    }
  }

  // Calcul le temps restant avant de devoir changer de stationnement
  const timeToLeaveCalc = () => {
    const now = new Date();

    // Parking gratuit de 11h à 12h30
    const freeParkingStart1 = new Date(now);
    freeParkingStart1.setHours(11, 0, 0, 0);
    const freeParkingEnd1= new Date(now); 
    freeParkingEnd1.setHours(12, 30, 0, 0);

    // Parking gratuit de 17h à 9h le lendemain
    const freeParkingStart2 = new Date(now);
    freeParkingStart2.setHours(17, 0, 0, 0);
    const freeParkingEnd2 = new Date(now);
    freeParkingEnd2.setDate(freeParkingEnd2.getDate() + 1) 
    freeParkingEnd2.setHours(9, 0, 0, 0);

    const verite = now <= freeParkingEnd2;

    // Si la voiture est stationnée avant 9h
    if(now.getHours() < 9){
      const targetTime = new Date(now);
      targetTime.setHours(10, 0, 0, 0);
      return targetTime;
    }

    // Si la voiture est stationnée entre 11h et 12h30
    if(now >= freeParkingStart1 && now <= freeParkingEnd1){
      const targetTime = new Date(now)
      targetTime.setHours(13, 30, 0, 0);
      return targetTime;
    }

    // Si la voiture est stationnée après 16h
    if(now >= freeParkingStart2 && now <= freeParkingEnd2){
      const targetTime = new Date(now);
      targetTime.setDate(now.getDate() + 1);
      targetTime.setHours(9, 0, 0, 0);
      return targetTime;
    }

    // Sinon le temps de stationnement est limité à une heure
    const targetTime = new Date(now.getTime() + 60 * 60 * 1000);
    return targetTime;
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
    await getCar();

    // Obtenir la localisation du user
    getLocation();

    // Fait couler le temps restant des véhicules stationnés
    //setInterval(updateRemainingTime, 1000);

  });
</script>

<template>
  <AppLayout>
    <div class="relative">
      <div ref="mapContainer" class="h-full z-[1] page-container"></div>
      <div class="absolute top-5 right-5 z-[1]">
        <div v-if="car">
          <div class="flex gap-6">
            <button v-if="car.isParked" @click="carTaken" class="bg-white 
              hover:bg-slate-100 py-2 px-4 rounded-lg font-thin
              transition ease-in-out delay-75 drop-shadow-lg
              hover:-translate-y-1 hover:scale-110">
              Je déplace la voiture
            </button>

            <button v-else @click="() => { showConfirmationModal = true }" class="bg-white 
              hover:bg-slate-100 py-2 px-4 rounded-lg font-thin
              transition ease-in-out delay-75 drop-shadow-lg
              hover:-translate-y-1 hover:scale-125">
              Je laisse la voiture
            </button>

            <button @click="setView" class="bg-white px-4 py-2 rounded-lg 
              transition ease-in-out delay-75 drop-shadow-lg
              hover:-translate-y-1 hover:scale-125 hover:bg-slate-100">
              <i class="zmdi zmdi-gps-dot text-red-600"></i>
            </button>
          </div>
        </div>
      </div>

      <!-- Model de confirmation de stationnement -->
      <div v-if="showConfirmationModal" class="modal-overlay z-[2]">
        <div class="modal bg-white w-[20vw] p-6 rounded-lg flex flex-col gap-8">
            <p class="text-center text-lg font-thin">Veuillez vérifier que la voiture est bien stationnée à l'endroit indiqué sur la carte, ou déplacer le marqueur sur la position de votre voiture.</p>
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
    background-image: url("../assets/carMoving3.gif");
    background-size: cover;
    background-position: center;
  }
</style>