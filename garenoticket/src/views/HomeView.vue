<script>
  import { useRouter } from 'vue-router';
  import { ref, onMounted } from 'vue';
  import AppLayout from '../layouts/AppLayout.vue'

  export default {
    components: {
      AppLayout
    },
    setup() {
      const router = useRouter();
      const isLogged = ref(false);

      const checkAuth = async () => {
        try {
          const response = await fetch('http://localhost:3000/auth/isAuth', {
            method: 'GET',
            headers: {
              'Authorization': 'Bearer ' + localStorage.getItem('token')
            }
          });

          if (response.ok) {
            isLogged.value = true;
          } else {
            if (response.status === 401) {
              router.push('/login');
            }
          }
        } catch (error) {
          console.error('Erreur lors de la vérification de l\'authentification', error);
          router.push('/login');
        }
      }

      onMounted(() => {
        checkAuth();
      });

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
