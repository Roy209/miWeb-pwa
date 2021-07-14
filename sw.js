const CACHE_NAME = "v1_cache_programador_fitness",
urlsToCache = [
    './',
    'app.css',
    'app.js',
    './img/favicon.png'
]
//durante la dase de instalacion, generealmente se alcena en cache todos los archivos estaticos del stio
self.addEventListener("install", e =>{
    e.waitUntil(
        caches.open(CACHE_NAME)
        .then(cache =>{
            return cache.addAll(urlsToCache)
            .then(()=> self.skipWaiting())
        })
        .catch(err=> console.log("Fallo registro de cache",err))
    )
})

//Una vez instalado el SW, se busca y activa los recursos para hacer que funcione sin internet
self.addEventListener("activate",e=>{
    const cacheWhitelist = [CACHE_NAME]
    e.waitUntil(
        caches.keys()
        .then(cachesNames =>{
            cachesNames.map(cacheName =>{
                if(cacheWhitelist.indexOf(cacheName) ===-1){
                    return caches.delete(cacheName)
                }
            })
        })
        .then(()=>self.clients.claim())
    )
})

//cuando el navegador recupera la url
self.addEventListener("fetch",e=>{
    //Responder ya sea con el objeto en cache o continuar y buscar la url real
    e.respondWith(
        caches.match(e.request)
        .then(res =>{
            if(res){
                //recuperar del cache
                return res;
            }
            //recuperar la peticion de la url
            return fetch(e.request)
        })
    )
})