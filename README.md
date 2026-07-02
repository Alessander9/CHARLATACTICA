# Charla Táctica Perú ⚽

Sitio web oficial e interactivo de **Charla Táctica Perú**, una comunidad y canal de análisis deportivo enfocado en Universitario de Deportes, la Liga 1 de fútbol peruano y la actualidad de la selección nacional.

El sitio está diseñado como una plataforma interactiva moderna de alto nivel estético que integra feeds en tiempo real de YouTube y una pizarra táctica completamente funcional para debatir tácticas y alineaciones.

---

## 🚀 Características Principales

### 1. Pizarra Táctica Interactiva 📋
*   **Alineaciones Dinámicas:** Permite alternar instantáneamente entre los sistemas de juego más utilizados por Universitario de Deportes (**3-5-2**, **4-3-3** y **4-2-3-1**).
*   **Arrastrar y Soltar (Drag & Drop):** Sistema responsivo nativo en JavaScript que admite dispositivos táctiles (móviles/tablets) y de escritorio (mouse).
*   **Líneas Tácticas SVG:** Dibujo dinámico en tiempo real de flechas de pase y carrera que se recalculan automáticamente en función de la posición de los jugadores y el tamaño de la pantalla.

### 2. Integración de Videos en Vivo y Grabados (YouTube API Proxy) 📺
*   **Consumo sin Backend:** Conexión directa mediante llamadas dinámicas HTTP al canal oficial.
*   **Estrategia Dual de Failover:**
    1.  Intenta procesar el feed convertido a JSON usando el servicio de `rss2json.com`.
    2.  Si falla, utiliza un proxy CORS a través de `api.allorigins.win` para parsear el XML nativo en el cliente.
    3.  En caso de desconexión absoluta, recurre a tarjetas fijas de respaldo integradas en el HTML.
*   **Etiquetado Inteligente:** Asignación automática de estilos y badges (Previa, Post Partido, Debate, Mercado) en base al análisis de texto del título del video.
*   **Modal de Reproducción:** Permite ver los videos directamente en una ventana modal emergente sin abandonar la web.

### 3. Animaciones de Entrada Cinemáticas 🎬
*   Desarrollado con la biblioteca **Motion** (importada como módulo ES nativo).
*   Efecto de revelado de título palabra por palabra (*staggered text reveal*).
*   Caída física simulada de los jugadores y dibujo animado de las jugadas con retrasos calculados.
*   Prevención activa de parpadeos de contenido sin estilar (FOUC).

### 4. Sistema de Diseño a Medida 🎨
*   Variables CSS nativas configuradas bajo un tema oscuro premium.
*   Identidad cromática balanceada entre el verde táctico deportivo y los colores institucionales crema y granate.
*   Efectos visuales modernos como filtros de desenfoque, degradados, sombras resplandecientes (*glow*) y animaciones continuas de escaneo.

---

## 📂 Estructura del Proyecto

El proyecto está compuesto por los siguientes archivos clave en la raíz:

```bash
CHARLATACTICA/
├── img/                       # Recursos gráficos y fotografías de panelistas
│   ├── LOGO.png               # Logotipo principal
│   ├── chalkboard_bg.png      # Fondo de textura de pizarra
│   └── *.jpg                  # Avatares del equipo
├── index.html                 # Estructura e interfaz principal del sitio
├── style.css                  # Hoja de estilos globales y diseño visual adaptativo
├── script.js                  # Lógica interactiva cliente y pizarra táctica
├── hero-animation.js          # Control de animaciones de entrada premium
├── feed.xml                   # Respaldo XML del feed RSS del canal de YouTube
├── yt.html                    # Copia local de caché del canal de YouTube
└── README.md                  # Documentación del proyecto (este archivo)
```

---

## 🛠️ Tecnologías Utilizadas

*   **HTML5** (Semántica estructurada y SEO optimizado).
*   **CSS3** (Variables de entorno, CSS Grid, Flexbox y animaciones nativas).
*   **JavaScript (ES6+)** (Event listeners avanzados, DOM parser, Fetch API y Drag & Drop).
*   **Motion.js** (Biblioteca de animaciones ultra fluida).

---

## 💻 Configuración y Ejecución Local

Para visualizar y trabajar en el proyecto de manera local, no se requiere ningún servidor backend complejo ni compiladores:

1.  **Clonar o Descargar** los archivos del proyecto en una carpeta local.
2.  **Ejecutar mediante un Servidor Local (Recomendado):**
    Para asegurar que las llamadas externas del feed de YouTube y las animaciones de módulos ES nativos carguen correctamente, se recomienda abrir el directorio con un servidor estático local (como la extensión *Live Server* en VS Code, o usando herramientas de consola):
    ```bash
    # Usando Python
    python -m http.server 8000

    # Usando NodeJS
    npx serve .
    ```
3.  Abrir el navegador en `http://localhost:8000` (o la dirección que provea el servidor).

---

## ⚙️ Integración del Canal de YouTube

Si necesitas apuntar a un canal diferente, abre el archivo `script.js` y modifica la constante de inicialización con el identificador del nuevo canal:

```javascript
// Localizar en script.js, aproximadamente línea 220
const channelId = 'UC-AlnHuvjACQM8SkPwQ9JQQ'; // Reemplazar con el nuevo ID del canal de YouTube
```

---

## 🔒 Descargo de Responsabilidad

Este sitio web y la comunidad de **Charla Táctica Perú** son un proyecto totalmente independiente dedicado al análisis futbolístico. No cuenta con afiliación oficial, patrocinio ni representación formal del Club Universitario de Deportes.
