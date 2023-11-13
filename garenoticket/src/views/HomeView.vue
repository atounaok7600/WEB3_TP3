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
    <div>
      Home page
    </div>
  </AppLayout>
</template>
