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
        value: String,
        disabled: {
            type: Boolean,
            default: true,
        }
    }
}
</script>

<template>
    <div class="flex items-center gap-1">
        <label :for="name" class="w-1/12 font-thin text-lg">{{ label }}</label>
        <input 
            :type="type" 
            :name="name" 
            :id="name" 
            :value="value"
            :placeholder="placeholder" 
            :disabled="disabled"
            class="border-b py-1 px-2 w-6/12">
    </div>
</template>