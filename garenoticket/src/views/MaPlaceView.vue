<script>
  import { useRouter } from 'vue-router';
  import { ref, onMounted } from 'vue';
  import AppLayout from '../layouts/AppLayout.vue'
  import leaflet, { L, marker } from 'leaflet'
  import mapMarkerRed from '../assets/map-marker-red.svg';

  export default {
    components: {
    AppLayout,
},
    setup() {
      let map;
      onMounted(() => {
        map = leaflet.map('map', {zoomAnimation: false}).setView([51.505, -0.09], 13);

        //tuiles
        leaflet.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
            maxZoom: 19,
            attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        }).addTo(map);

        getGeolocation();

        map.on('click', onMapClick);
      })

      const coords = ref(null);
      const fetchCoords = ref(null);
      const geoMarker = ref(null);

      const getGeolocation = () => {
        if(sessionStorage.getItem('coords')){
          coords.value = JSON.parse(sessionStorage.getItem('coords'));
          plotGeolocation(coords.value);
          return;
        }

        fetchCoords.value = true;
        navigator.geolocation.getCurrentPosition(setCoords, getLocError);
      };

      const onMapClick = (e) => {
        coords.value = {
          lat: e.latlng.lat,
          lng: e.latlng.lng,
        }

        if(geoMarker.value){
          map.removeLayer(geoMarker.value)
        }

        plotGeolocation(coords.value)

        return {
          coords,
        }
      }

      const setCoords = (pos) => {
        fetchCoords.value = null;
        
        const setSessionCoords = {
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
        };

        sessionStorage.setItem('coords', JSON.stringify(setSessionCoords));

        coords.value = setSessionCoords;

        plotGeolocation(coords.value);
      };

      const getLocError = (err) => {
        console.log(err);
      }

      const plotGeolocation = () => {
        if (map){
          //create custom marker
          const customMarker = leaflet.icon({
            iconUrl: mapMarkerRed,
            iconSize: [35, 35],
          });

          geoMarker.value = leaflet.marker([coords.value.lat, coords.value.lng], {icon: customMarker})
            .addTo(map);

          const currentZoom = map.getZoom();
          map.setView([coords.value.lat, coords.value.lng], currentZoom);
        }
      }

      return {
        coords,
        geoMarker
      };
    },
  }
</script>

<template>
  <AppLayout>
    <div class="h-screen relative">
      <div id="map" class="h-full z-[1]"></div>
    </div>
  </AppLayout>
</template>
