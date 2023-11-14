<script>
  import { useRouter } from 'vue-router';
  import { ref, onMounted } from 'vue';
  import AppLayout from '../layouts/AppLayout.vue'

  export default {
    components: {
      AppLayout
    },
    setup() {

    }
  }
</script>

<template>
  <AppLayout>
    <div class="page-container flex items-center justify-center">
      Home page
    </div>
  </AppLayout>
</template>
