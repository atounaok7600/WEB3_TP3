<script>
export default {
    props: {
        label: String,
        name: String,
        placeholder: String,
        type: {
            type: String,
            default: 'text',
        },
    }
}
</script>

<template>
    <div class="flex flex-col gap-1">
        <label :for="name">{{ label }}</label>
        <input :type="type" :name="name" :id="name" :placeholder="placeholder" class="border py-1 px-2">
    </div>
</template>