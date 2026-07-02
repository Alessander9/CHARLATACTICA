# Contexto del Proyecto - Charla Táctica Perú

Este documento proporciona una visión general técnica y funcional del proyecto **Charla Táctica Perú**. Su propósito es servir como referencia para desarrolladores y editores que trabajen en el mantenimiento o expansión del sitio web.

---

## ⚽ Propósito del Proyecto

**Charla Táctica Perú** es un canal y comunidad de análisis deportivo enfocado en la actualidad de **Universitario de Deportes**, la Liga 1 de fútbol peruano y la selección nacional. 

El sitio web funciona como un hub digital interactivo y de alta fidelidad estética, diseñado para consolidar:
1. **Identidad de marca:** Colores corporativos basados en Universitario (Crema/Granate) combinados con un verde táctico deportivo.
2. **Interactividad táctica:** Una pizarra táctica digital interactiva donde los usuarios y analistas pueden simular alineaciones.
3. **Consumo de contenidos:** Listado dinámico de los últimos videos y transmisiones en vivo del canal de YouTube.
4. **Comunidad y Alianzas:** Enlaces directos a redes sociales y espacios publicitarios para patrocinadores.

---

## 📂 Arquitectura de Archivos

El proyecto está estructurado de manera simple y eficiente en la raíz, utilizando tecnologías web estándar (HTML, CSS, JS vainilla y Motion para animaciones):

*   **[index.html](file:///c:/Users/Alessander/Desktop/ORDENAR/CHARLATACTICA/index.html)**: Estructura HTML5 semántica que define las 10 secciones principales del sitio (Inicio, Qué Es, Enfoque, La Mesa, Formatos, Mundo Crema, Videos, Transmisiones, Comunidad, Aliados).
*   **[style.css](file:///c:/Users/Alessander/Desktop/ORDENAR/CHARLATACTICA/style.css)**: Sistema de diseño completo, variables CSS globales, animaciones clave, estilos de pizarra e interactividad, y adaptabilidad móvil.
*   **[script.js](file:///c:/Users/Alessander/Desktop/ORDENAR/CHARLATACTICA/script.js)**: Lógica cliente principal que maneja el menú móvil, scrollspy, consumo dinámico del feed de YouTube, reproductor modal de videos y la interactividad de la pizarra táctica (física de arrastre y cambio de formaciones).
*   **[hero-animation.js](file:///c:/Users/Alessander/Desktop/ORDENAR/CHARLATACTICA/hero-animation.js)**: Módulo JS encargado de las animaciones premium de entrada del Hero utilizando la biblioteca de animaciones Motion.
*   **[feed.xml](file:///c:/Users/Alessander/Desktop/ORDENAR/CHARLATACTICA/feed.xml)**: Respaldo local de datos en formato XML Atom que contiene la estructura de videos del canal de YouTube para usar como fallback offline.
*   **[yt.html](file:///c:/Users/Alessander/Desktop/ORDENAR/CHARLATACTICA/yt.html)**: Copia de caché local y de referencia del canal de YouTube (1.1 MB).
*   **`img/`**: Directorio de recursos multimedia que incluye logotipos del canal, fondos de pizarra y fotografías de los panelistas.

---

## 🛠️ Tecnologías y Características Clave

### 1. Sistema de Diseño (CSS)
El diseño se basa en un tema oscuro premium (`#111111`) con acentos en verde táctico (`#007A3D` / `#10B981`) y detalles en crema (`#F2EAD3`) y granate (`#7D162B`) en honor al club Universitario de Deportes.
*   **Tipografía:** *Barlow Condensed* para títulos y textos de acento deportivo, e *Inter* para el cuerpo de texto legible.
*   **Adaptabilidad:** Grid dinámico con breakpoints para móviles, tablets y pantallas de escritorio.
*   **Microinteracciones:** Efectos de brillo (*glow*), flotado de logotipos, transiciones suaves en hover y animaciones de escaneo táctico.

### 2. Animaciones Premium (Motion)
Ubicadas en `hero-animation.js`, utilizan la biblioteca **Motion** (importada mediante ES Modules de un CDN) para lograr una experiencia cinemática al cargar la página:
*   **Revelado de Título:** El título principal se divide en palabras individuales que se deslizan hacia arriba de manera secuencial (*staggered slide-up*).
*   **Trazado de Pizarra SVG:** Las líneas de jugadas tácticas simuladas en el Hero se dibujan dinámicamente controlando la propiedad `strokeDashoffset`.
*   **Física Spring:** Los nodos de jugadores se posicionan y "caen" en la pizarra con un rebote realista (*spring damping*).
*   **Prevención de FOUC:** Oculta mediante estilos temporales los elementos del Hero hasta que el script de animación está listo para ejecutarse, evitando el parpadeo de contenido no estilizado. Si el script falla, hay un callback de respaldo que los muestra a los 2.5 segundos.

### 3. Pizarra Táctica Interactiva
Es una de las características más avanzadas del sitio web:
*   **Formaciones Predefinidas:** Soporta cambios inmediatos entre formaciones clásicas: **3-5-2** (predeterminada de la U), **4-3-3** y **4-2-3-1**. Cada jugador se desliza suavemente a su posición correcta usando transiciones CSS.
*   **Drag & Drop Personalizado:** Implementa lógica matemática en `script.js` con soporte para mouse (`mousedown`/`mousemove`) y dispositivos móviles táctiles (`touchstart`/`touchmove`). Mantiene a los jugadores dentro de los límites visuales de la pizarra.
*   **Vectores SVG Dinámicos:** Dibuja flechas tácticas en un lienzo SVG superpuesto al campo de juego, las cuales se recalculan automáticamente al redimensionar la pantalla o al cambiar la formación del equipo.

### 4. Integración de Feed de YouTube Dinámico
El sitio web carga los videos directamente del canal oficial sin necesidad de una base de datos backend compleja.
*   **Capa Doble de Petición (CORS Failover):**
    1.  *Intento 1:* Solicita el feed RSS de YouTube convertido a JSON mediante la API pública de `rss2json.com`.
    2.  *Intento 2 (Fallback):* Si el anterior falla por cuotas o red, utiliza un proxy CORS (`api.allorigins.win`) para traer el XML directo de YouTube y procesarlo usando `DOMParser` en el navegador.
    3.  *Intento 3:* Si ambos fallan, el sitio muestra las tarjetas estáticas pre-renderizadas en el HTML como respaldo de diseño.
*   **Categorización por Título:** Analiza las palabras clave del título del video (ej. "Previa", "Post Partido", "Fichajes", "En Vivo") para asignarle etiquetas con estilos de color específicos de forma automática.
*   **Reproductor Modal:** Al hacer clic en cualquier tarjeta de video, se abre una ventana emergente en la propia página con un `iframe` de YouTube autoejecutable. Al cerrarse, vacía el `src` para detener la reproducción en segundo plano.

---

## 👥 Miembros de la Mesa (La Mesa)

El sitio presenta al equipo humano responsable del canal:
*   **Eduardo Jesús Buitrón:** Panelista / Moderador (Análisis táctico y debate).
*   **Julio de Feudis:** Panelista / Moderador (Análisis táctico y debate).
*   **Diego Cerván (@dcervan.30):** Panelista / Moderador (Análisis táctico y debate).
*   **Joaquín Ferradas:** CM / Productor (Soporte técnico y redes).

---

## 🚀 Posibles Mejoras de Desarrollo Futuras

Si se planea expandir el sitio, se sugieren las siguientes tareas:
1.  **LocalStorage para Pizarra:** Guardar las posiciones personalizadas de los jugadores cuando el usuario los arrastra para que no se pierdan al recargar la página.
2.  **Exportar Formación:** Permitir al usuario descargar una captura de pantalla de su pizarra táctica personalizada para compartirla en redes sociales.
3.  **Refactorizar a Módulos:** Migrar la lógica de la pizarra y de YouTube en `script.js` a módulos JS separados para mayor mantenibilidad a medida que crezca el código.
