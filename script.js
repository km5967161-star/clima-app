// ==========================================
// CONFIGURACIÓN
// ==========================================

const API_KEY = 'cc71beb5d799484f7a35b7479548fb03';

const API_URL =
    'https://api.openweathermap.org/data/2.5/weather';

const FORECAST_URL =
    'https://api.openweathermap.org/data/2.5/forecast';


// ==========================================
// ELEMENTOS
// ==========================================

const formulario =
    document.getElementById('formulario');

const inputCiudad =
    document.getElementById('inputCiudad');

const resultado =
    document.getElementById('resultado');

const estado =
    document.getElementById('estado');

const historialDiv =
    document.getElementById('historial');

const pronosticoDiv =
    document.getElementById('pronostico');

const ubicacion =
    document.getElementById('ubicacion');

const tema =
    document.getElementById('tema');

const whatsapp =
    document.getElementById('whatsapp');


// Variables para WhatsApp

let ciudadActual = '';

let temperaturaActual = '';


// ==========================================
// CONSULTAR CLIMA
// ==========================================

async function consultarClima(ciudad) {

    estado.textContent =
        '⏳ Consultando el clima...';

    try {

        const ciudadCodificada =
            encodeURIComponent(ciudad);


        const url =
            `${API_URL}?q=${ciudadCodificada}&appid=${API_KEY}&units=metric&lang=es`;


        const respuesta =
            await fetch(url);


        if (!respuesta.ok) {

            if (respuesta.status === 404) {

                throw new Error(
                    'Ciudad no encontrada'
                );

            }

            if (respuesta.status === 401) {

                throw new Error(
                    'API Key inválida'
                );

            }

            throw new Error(
                'Error en la petición'
            );

        }


        const datos =
            await respuesta.json();


        mostrarClima(datos);


        // RETO 3

        guardarHistorial(ciudad);


        // RETO 2

        consultarPronostico(ciudad);


        estado.textContent =
            '✅ Datos actualizados correctamente.';

    }

    catch (error) {

        estado.textContent =
            '❌ ' + error.message;

    }

}


// ==========================================
// MOSTRAR CLIMA
// ==========================================

function mostrarClima(datos) {

    const ciudad =
        datos.name;

    const pais =
        datos.sys.country;

    const temperatura =
        Math.round(datos.main.temp);

    const sensacion =
        Math.round(datos.main.feels_like);

    const humedad =
        datos.main.humidity;

    const presion =
        datos.main.pressure;

    const viento =
        datos.wind.speed;

    const descripcion =
        datos.weather[0].description;

    const icono =
        datos.weather[0].icon;


    const iconoUrl =
        `https://openweathermap.org/img/wn/${icono}@2x.png`;


    ciudadActual = ciudad;

    temperaturaActual = temperatura;


    resultado.innerHTML = `

        <h2>${ciudad}</h2>

        <p>${pais}</p>

        <img
            src="${iconoUrl}"
            class="icono-clima"
        >

        <div class="temperatura">
            ${temperatura}°C
        </div>

        <div class="descripcion">
            ${descripcion}
        </div>

        <div class="detalles">

            <div class="detalle">
                <b>Sensación</b>
                <p>${sensacion}°C</p>
            </div>

            <div class="detalle">
                <b>Humedad</b>
                <p>${humedad}%</p>
            </div>

            <div class="detalle">
                <b>Presión</b>
                <p>${presion} hPa</p>
            </div>

            <div class="detalle">
                <b>Viento</b>
                <p>${viento} m/s</p>
            </div>

        </div>

    `;


    resultado.classList.add('visible');


    cambiarFondo(
        datos.weather[0].main
    );

}


// ==========================================
// CAMBIAR FONDO
// ==========================================

function cambiarFondo(clima) {

    document.body.classList.remove(
        'clima-soleado',
        'clima-nublado',
        'clima-lluvioso',
        'clima-nieve'
    );


    const climaLower =
        clima.toLowerCase();


    if (
        climaLower.includes('clear')
    ) {

        document.body.classList.add(
            'clima-soleado'
        );

    }

    else if (
        climaLower.includes('cloud')
    ) {

        document.body.classList.add(
            'clima-nublado'
        );

    }

    else if (
        climaLower.includes('rain') ||
        climaLower.includes('drizzle') ||
        climaLower.includes('thunderstorm')
    ) {

        document.body.classList.add(
            'clima-lluvioso'
        );

    }

    else if (
        climaLower.includes('snow')
    ) {

        document.body.classList.add(
            'clima-nieve'
        );

    }

}


// ==========================================
// EVENTO DEL FORMULARIO
// ==========================================

formulario.addEventListener(
    'submit',
    function(e) {

        e.preventDefault();


        const ciudad =
            inputCiudad.value.trim();


        if (!ciudad) {

            estado.textContent =
                'Escribe una ciudad.';

            return;

        }


        consultarClima(ciudad);

    }
);


// ==================================================
// RETO 1 - GEOLOCALIZACIÓN
// ==================================================

ubicacion.addEventListener(
    'click',
    function() {

        if (!navigator.geolocation) {

            estado.textContent =
                '❌ Tu navegador no permite geolocalización.';

            return;

        }


        estado.textContent =
            '📍 Obteniendo ubicación...';


        navigator.geolocation.getCurrentPosition(

            async function(posicion) {

                const lat =
                    posicion.coords.latitude;

                const lon =
                    posicion.coords.longitude;


                try {

                    const url =
                        `${API_URL}?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric&lang=es`;


                    const respuesta =
                        await fetch(url);


                    const datos =
                        await respuesta.json();


                    mostrarClima(datos);

                    guardarHistorial(
                        datos.name
                    );

                    consultarPronostico(
                        datos.name
                    );


                    estado.textContent =
                        '📍 Clima de tu ubicación.';

                }

                catch (error) {

                    estado.textContent =
                        '❌ No se pudo obtener el clima.';

                }

            },

            function() {

                estado.textContent =
                    '❌ No se pudo obtener tu ubicación.';

            }

        );

    }
);


// ==================================================
// RETO 2 - PRONÓSTICO DE 5 DÍAS
// ==================================================

async function consultarPronostico(ciudad) {

    try {

        const ciudadCodificada =
            encodeURIComponent(ciudad);


        const url =
            `${FORECAST_URL}?q=${ciudadCodificada}&appid=${API_KEY}&units=metric&lang=es`;


        const respuesta =
            await fetch(url);


        const datos =
            await respuesta.json();


        mostrarPronostico(datos);

    }

    catch (error) {

        pronosticoDiv.innerHTML =
            'No se pudo obtener el pronóstico.';

    }

}


function mostrarPronostico(datos) {

    pronosticoDiv.innerHTML = '';


    // Tomamos una predicción cada 8 registros
    // porque la API entrega datos cada 3 horas.

    for (
        let i = 0;
        i < datos.list.length;
        i += 8
    ) {

        const dia =
            datos.list[i];


        const fecha =
            new Date(
                dia.dt * 1000
            );


        const fechaTexto =
            fecha.toLocaleDateString(
                'es-MX',
                {
                    weekday: 'short',
                    day: 'numeric',
                    month: 'short'
                }
            );


        const temperatura =
            Math.round(
                dia.main.temp
            );


        const descripcion =
            dia.weather[0].description;


        const icono =
            dia.weather[0].icon;


        const iconoUrl =
            `https://openweathermap.org/img/wn/${icono}@2x.png`;


        pronosticoDiv.innerHTML += `

            <div class="dia">

                <h3>
                    ${fechaTexto}
                </h3>

                <img
                    src="${iconoUrl}"
                >

                <p>
                    ${temperatura}°C
                </p>

                <p>
                    ${descripcion}
                </p>

            </div>

        `;

    }

}


// ==================================================
// RETO 3 - HISTORIAL
// ==================================================

let historial =
    JSON.parse(
        localStorage.getItem(
            'historial'
        )
    ) || [];



function guardarHistorial(ciudad) {

    historial =
        historial.filter(
            function(item) {

                return item.toLowerCase()
                    !== ciudad.toLowerCase();

            }
        );


    historial.unshift(ciudad);


    // Máximo 5 ciudades

    historial =
        historial.slice(0, 5);


    localStorage.setItem(
        'historial',
        JSON.stringify(historial)
    );


    mostrarHistorial();

}



function mostrarHistorial() {

    historialDiv.innerHTML = '';


    historial.forEach(
        function(ciudad) {

            const boton =
                document.createElement(
                    'button'
                );


            boton.textContent =
                ciudad;


            boton.className =
                'boton-historial';


            boton.addEventListener(
                'click',
                function() {

                    consultarClima(
                        ciudad
                    );

                }
            );


            historialDiv.appendChild(
                boton
            );

        }
    );

}


mostrarHistorial();


// ==================================================
// RETO 4 - MODO CLARO / OSCURO
// ==================================================

tema.addEventListener(
    'click',
    function() {

        document.body.classList.toggle(
            'claro'
        );


        if (
            document.body.classList.contains(
                'claro'
            )
        ) {

            tema.textContent =
                '🌙 Modo oscuro';

        }

        else {

            tema.textContent =
                '☀️ Modo claro';

        }

    }
);


// ==================================================
// RETO 5 - WHATSAPP
// ==================================================

whatsapp.addEventListener(
    'click',
    function() {

        if (!ciudadActual) {

            alert(
                'Primero consulta una ciudad.'
            );

            return;

        }


        const mensaje =
            `El clima en ${ciudadActual} es de ${temperaturaActual}°C`;


        const url =
            `https://wa.me/?text=${encodeURIComponent(mensaje)}`;


        window.open(
            url,
            '_blank'
        );

    }
);


// ==================================================
// MENSAJE INICIAL
// ==================================================

estado.textContent =
    'Escribe una ciudad y presiona "Consultar".';