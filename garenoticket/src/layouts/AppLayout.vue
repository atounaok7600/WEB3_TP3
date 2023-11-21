<script setup>
    import { RouterLink, RouterView } from 'vue-router'
    import Navbar from '../components/Navbar.vue';
    import FooterView from '../components/FooterView.vue'
    import { getUser } from '../utils/auth'
    import { ref, onMounted } from 'vue'

    let usersId = ''
    onMounted(async () =>  {
        const token = localStorage.getItem('token');
        try {
            const user = await getUser(token)
            usersId = user._id
        } catch (error) {
            console.log(error)
        }
    })

</script>

<template>
    <div class="min-w-screen min-h-screen flex flex-col">
        <Navbar/>

        <div>
            <slot></slot>
        </div>

        <FooterView/>
    </div>
</template>
