<style scoped>
</style>

<template>
    <div>
        <nf-form v-bind="formConfig" v-model="model"></nf-form>
    </div>
</template>

<script>
import { datetimeFields as fields } from "./config";
export default {
    components:{},
    data(){
        return {
            model:{},
            formConfig:{
                span:2,
                labelPosition:'top',
                fields
            }
        }
    },
    created(){},
    mounted(){},
    computed:{},
    methods:{}
}
</script>