<script setup>
import AppLayout from '../layouts/AppLayout.vue';
import { ref, onMounted } from 'vue'
import L from 'leaflet'

  const coords = {
    lat: ref(0),
    lng: ref(0),
  }
  const map = ref()
  const mapContainer = ref()

  onMounted(() => {
    // Obtenir la localisation du user
    getLocation();

    // Initialiser la carte
    map.value = L.map(mapContainer.value).setView([51.505, -0.09], 13);

    // Tuiles de la carte
    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
    }).addTo(map.value);

  });

  // Permet de demander la localisation du user.
  const getLocation = () => {
    if(navigator.geolocation){
      navigator.geolocation.watchPosition((pos) => {
        coords.lat.value = pos.coords.latitude
        coords.lng.value = pos.coords.longitude
        map.value.setView([coords.lat.value, coords.lng.value, 13]);

        // Ajour du marqueur
        L.marker([coords.lat.value, coords.lng.value], { draggable: true })
        .addTo(map.value)
        .on('dragend', (e) => {
          console.log(e);
        });
      })
    }
  }
</script>

<template>
  <AppLayout>
    <div class="h-screen relative">
      <div ref="mapContainer" class="h-full z-[1]"></div>
    </div>
  </AppLayout>
</template>