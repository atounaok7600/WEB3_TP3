<script>
import L from 'leaflet'

export default {
    mounted() {
        const map = L.map(this.$refs.map).setView([51.505, -0.09], 13);

        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '© OpenStreetMap contributors'
        }).addTo(map);

        L.marker([51.505, -0.09]).addTo(map)
            .bindPopup('A pretty css3 popup.<br> Easily customizable.')
            .openPopup();
    }
};
</script>

<template lang="">
    <div class="">
        
    </div>
</template>
