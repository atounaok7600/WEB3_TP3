import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'

export const checkAuth = () => {
    const router = useRouter();
    const isLogged = ref(false);
    const user = ref(null)

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
            user.value = await response.json();
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
        isLogged,
        user
    }
}