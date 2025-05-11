# Soccer App

Una aplicación web para gestionar partidos y equipos de fútbol amateur, desarrollada con Next.js, Tailwind CSS y Firebase.

## Características

- Gestión de jugadores y equipos
- Programación de partidos
- Sistema de tarjetas amarillas/rojas
- Feed de comentarios para jugadores
- Interfaz de arrastrar y soltar para organización
- Soporte multilingüe
- Diseño responsive y modo oscuro

## Tecnologías

- [Next.js 14](https://nextjs.org/)
- [React 18](https://reactjs.org/)
- [TypeScript](https://www.typescriptlang.org/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Firebase](https://firebase.google.com/)
- [Radix UI](https://www.radix-ui.com/)
- [DND Kit](https://dndkit.com/)
- [React Hook Form](https://react-hook-form.com/)
- [Next-Intl](https://next-intl-docs.vercel.app/)

## Requisitos

- Node.js 18.x o superior
- NPM o Yarn

## Instalación

1. Clona el repositorio:
```bash
git clone https://github.com/tuusuario/soccer-app.git
cd soccer-app
```

2. Instala las dependencias:
```bash
npm install
# o
yarn install
```

3. Configura las variables de entorno (crea un archivo `.env.local`):
```
NEXT_PUBLIC_FIREBASE_API_KEY=tu_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=tu_dominio.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=tu_proyecto_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=tu_bucket.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=tu_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=tu_app_id
```

## Desarrollo

Inicia el servidor de desarrollo:

```bash
npm run dev
# o
yarn dev
```

Abre [http://localhost:3000](http://localhost:3000) en tu navegador para ver la aplicación.

## Despliegue

La forma más sencilla de desplegar esta aplicación es utilizar [Vercel](https://vercel.com):

```bash
npm install -g vercel
vercel
```

## Licencia

MIT
