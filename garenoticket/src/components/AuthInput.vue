<script>
export default {
    props: {
        iconName: String,
        name: String,
        placeholder: String,
        type: {
            type: String,
            default: 'text',
        },
        modelValue: String,
        required: {
            type: Boolean,
            default: false
        }
    },
    methods: {
        onInput(e){
            this.$emit('update:modelValue', e.target.value)
        }
    }
}
</script>

<template>
    <div class="flex items-center gap-1 border-b">
        <label :for="name">
            <i :class="iconName"></i>
        </label>
        <input 
            :type="type" 
            :name="name" 
            :id="name" 
            :value="modelValue" 
            :required="required" 
            :placeholder="placeholder" 
            class="px-3 py-2 rounded-md focus:outline-none font-thin" 
            @input="onInput">
    </div>
</template>