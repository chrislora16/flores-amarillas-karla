# 🌻 Flores amarillas para Karla

Un pequeño detalle de Cristopher para Karla, por el **Día de las Flores
Amarillas, 21 de septiembre**. No es una landing romántica — es un gesto
amistoso: "soy tu amigo y quise tener un detalle bonito contigo hoy".

## Cómo ejecutarla

```bash
npm install
npm run dev
```

Y abrir la dirección que aparece en la terminal (por defecto
<http://localhost:5173>). Nada más: no hay APIs externas, ni claves, ni
imágenes con copyright — la flor es un SVG propio.

Otros comandos:

| Comando             | Qué hace                                     |
| -------------------- | --------------------------------------------- |
| `npm run dev`         | Servidor de desarrollo                        |
| `npm run build`       | Compila a `dist/` para publicar               |
| `npm run preview`     | Sirve la versión compilada, para comprobarla  |
| `npm run typecheck`   | Revisa los tipos de TypeScript                |

## El recorrido

1. **Intro** — "Karla 🌻" escribiéndose, "Hoy es 21 de septiembre…", "Así
   que aquí tienes tus flores amarillas." y el botón `🌻 Recibir mis flores`.
2. **Un pequeño detalle para ti** — flores entrando desde abajo y el porqué
   de las flores amarillas entre amigos.
3. **Frase grande** — "Feliz día de las flores amarillas, Karla. 🌻"
4. **Toca la flor** — una flor interactiva suelta una de 5 frases al azar
   cada vez que la toca.
5. **Cierre** — un ramo pequeño, "Para Karla 🌻 · De parte de Cristopher."

Paleta propia: crema, amarillo cálido, blanco y un toque de rosado pastel.
Animación ligera (pensada para recorrerse en 30-45 segundos): sin música,
sin galería de fotos, sin cursor personalizado ni partículas en canvas.

## Publicarla

`npm run build` genera `dist/`, un sitio estático que sirve tal cual en
Netlify, Vercel o cualquier hosting estático. El `netlify.toml` ya trae la
configuración necesaria (build command, carpeta de salida y la redirección
para que recargar la página no dé 404).

## Cómo está hecho

Vite + React + TypeScript, Tailwind CSS v4 y GSAP/ScrollTrigger para las
animaciones de scroll. Framer Motion solo en la tarjeta de mensajes. Todo
mobile-first, probado sin scroll horizontal en 393×852 y 430×932, y
respeta `prefers-reduced-motion`.

```
src/
├── main.tsx
├── App.tsx                     toda la página
├── index.css                   paleta, tipografías, keyframes
├── components/
│   ├── Flower.tsx               la flor (SVG)
│   ├── Reveal.tsx               revelados de texto y máquina de escribir
│   └── shared/
│       ├── FloatingPetals.tsx    pétalos ambientales en CSS
│       ├── MessageCard.tsx       tarjeta que revela un mensaje al tocar
│       └── MiniBouquet.tsx       el ramo pequeño del cierre
└── lib/                         contexto, gsap, utilidades
```

Hecho con cariño. 🌻
