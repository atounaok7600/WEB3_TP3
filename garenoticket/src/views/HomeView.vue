<script>
  import { useRouter } from 'vue-router';
import AppLayout from '../layouts/AppLayout.vue'

  export default {
    components: {
      AppLayout
    },
    setup() {
      const router = useRouter();
      const isLogged = false;

      if(!isLogged){
        router.push('/login');
      }

      return {
        isLogged
      }
    }
  }
</script>

<template>
  <AppLayout>
    <div>
      Home page
    </div>
  </AppLayout>
</template>
