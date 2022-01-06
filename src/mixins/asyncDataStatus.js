// permet d'exporter les même donné ou methods etc sur plsr components, ne pas se repeter
export default {
    data(){
        return {
            asyncDataStatus_ready : false // on utilise cette variable pour afficher la page si tout est chargé avec les await de firebase et du store
        }
    },
    methods:{
        asyncDataStatus_fetched () {
            this.asyncDataStatus_ready = true
            this.$emit('ready')
        }
    }
}