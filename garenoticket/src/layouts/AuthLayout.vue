<script setup>
    import { RouterLink, RouterView } from 'vue-router'
</script>

<template>
    <head>
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/material-design-iconic-font/2.2.0/css/material-design-iconic-font.min.css"> 
    </head>
    <body class="min-w-screen min-h-screen flex flex-col">

        <div>
            <slot></slot>
        </div>

    </body>
</template>