importScripts('/js/sw-utils.js');

const STATIC_CAHE = 'static-v1';
const DINAMIC_CAHE = 'dinamic-v1';
const INMUTABLE_CAHE = 'inmutable-v1';

const APP_SHELL = [
    // '/',
    'index.html',
    'css/style.css',
    'img/favicon.ico',
    'img/avatars/spiderman.jpg',
    'img/avatars/ironman.jpg',
    'img/avatars/wolverine.jpg',
    'img/avatars/thor.jpg',
    'img/avatars/hulk.jpg',
    'js/app2.js',
    'js/sw-utils.js'
];

const APP_SHELL_INMUTABLE = [
    'js/libs/jquery.js',
    'css/animate.css',
    'css/all.min.css',
    'webfonts/fa-brands-400.eot',
    'webfonts/fa-regular-400.woff2',
    'webfonts/fa-regular-400.woff',
    'webfonts/fa-regular-400.ttf',
    'webfonts/fa-regular-400.svg',
    'webfonts/fa-brands-400.ttf',
    'webfonts/fa-brands-400.svg',
    'webfonts/fa-brands-400.woff',
    'webfonts/fa-brands-400.woff2',
    'webfonts/fa-solid-900.woff',
    'webfonts/fa-solid-900.woff2',
    'webfonts/fa-solid-900.ttf',
    'webfonts/fa-solid-900.svg',
    'webfonts/fa-solid-900.eot',
    'https://fonts.googleapis.com/css?family=Lato:400,300',
    'https://fonts.googleapis.com/css?family=Quicksand:300,400',
    'https://fonts.gstatic.com/s/quicksand/v30/6xKtdSZaM9iE8KbpRA_hK1QNYuDyPw.woff2',
    'https://fonts.gstatic.com/s/lato/v23/S6uyw4BMUTPHjx4wXiWtFCc.woff2'
];

self.addEventListener('install', e => {

    const cacheStatic = caches.open(STATIC_CAHE).then(cache => cache.addAll(APP_SHELL));

    const cacheInmutable = caches.open(INMUTABLE_CAHE).then(cache => cache.addAll(APP_SHELL_INMUTABLE));

    e.waitUntil(Promise.all([cacheStatic, cacheInmutable]));

});

self.addEventListener('activate', e => {


    const respuesta = caches.keys().then(keys => {

        keys.forEach(key => {

            if (key !== STATIC_CAHE && key.includes('static')) {
                return caches.delete(key);
            }

        });

    });


    e.waitUntil(respuesta);

});

self.addEventListener('fetch', e => {



    const respuesta = caches.match(e.request)
        .then(res => {

            if (res) {

                return res;

            } else {

                return fetch(e.request).then(newRes => {

                    uploadDinamicCache(DINAMIC_CAHE, e.request, newRes);

                })
            }

        });

    e.respondWith(respuesta);

});