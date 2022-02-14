export const findById = (resources , id)=>{
    if(!resources) return null
    return resources.find( r => r.id === id)
}

export const upsert = ( resources , param ) => {
    // fonction qui creer ou ajoute un post o uthread ou autres selon le parametre post donné
    // si post ou thread ou autres vien du formulaire ...Edit , il vien avec un id et donc index aura uen valeur 
    // ce qui metra à jour le post existant

    const index = resources.findIndex( p => p.id === param.id)
    if(param.id && index !== -1){ // permet de metre a jour un post ou autres existant
        resources[index] = param
    }else{
        resources.push(param) // permet de creer un nouveau post ou autres
    }
}

export const docToResource = (doc) => {
    if(typeof doc?.data !== 'function') return doc
    return { ...doc.data(), id: doc.id}
}
