<script>
  import { useRouter } from 'vue-router';
  import { ref, onMounted } from 'vue';
  import AppLayout from '../layouts/AppLayout.vue'
  import { checkAuth } from '../utils/checkAuth';

  export default {
    components: {
      AppLayout
    },
    setup() {
      const { isLogged } = checkAuth();

      return {
        isLogged
      }
    }
  }
</script>

<template>
  <AppLayout>
    <div>
      Ma place
    </div>
  </AppLayout>
</template>
