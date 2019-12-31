<style scoped>
</style>

<template>
    <div>
        <nf-tabs v-bind="config" v-model="current">
            <div slot="first">1111111111</div>
            <div slot="second">secondsecondsecondsecondsecond</div>
        </nf-tabs>
    </div>
</template>

<script>
export default {
    components:{},
    data(){
        return {
            current:'first'
        }
    },
    created(){},
    mounted(){},
    computed:{
        config(){
            return {
                type:'border-card',
                panes:[
                    {name:'first',label:'我的行程',icon:'el-icon-date'},
                    {name:'second',label:'第二卡'}
                ],
                handler:tab=>{
                    
                }
            }
        }
    },
    methods:{}
}
</script>