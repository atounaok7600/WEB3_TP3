<script>
  import { useRouter } from 'vue-router';
  import { ref, onMounted } from 'vue';
  import AppLayout from '../layouts/AppLayout.vue'

  export default {
    components: {
      AppLayout
    },
    data() {
      return{
        time: new Date()
      }
    },
    setup() {
      
    }
  }
</script>

<template>
  <AppLayout>
    <div class="page-container flex items-center justify-center">
      {{ time.getHours() }}
    </div>
  </AppLayout>
</template>
