# Refactorización del 'Stack game' de [@midudev](https://github.com/midudev)

## Visualización del juego [StackTower](https://codesthenos.github.io/StackTower-React/)

## Referencias al original:

- [Video de referencia](https://www.youtube.com/watch?v=IEwL-TZBeqQ)
- [Código de referencia](https://github.com/midudev/javascript-100-proyectos/blob/main/10-stack-game/index.html)

## Descripción del proyecto

Buscando seguir aprendiendo React despues de seguir todos los proyectos/videos del [curso de React](https://github.com/midudev/aprendiendo-react/tree/master/projects) de **midudev** vi en directo como hacía el juego usando _vanilla JavaScript_ y se me ocurrió intentar implementarlo pero usando react, creía que sabía cómo enfocarlo, pero he necesitado muchas horas para llegar a este resultado, y ni si quiera estoy seguro de si es 'lo más óptimo', pero al menos, evito el uso de let, y me acostumbro bastante al uso del useRef.

El proyecto ha sido creado usando un [template original](https://github.com/codesthenos/codesthenos-vite-react-typescript-eslint-custom) basado en el template obtenido usando el comando `npm create vite@latest`

## Carpetas y documentos

### public

El logo de vite usado como favicon, lo dejo para dar creditos a vite y porque esta chulo

### src:

- Dentro de esta carpeta, están los documentos:

  - **App.tsx**, documento que carga la el _Game.tsx_
  - **constants.ts**, constantes usadas para el juego
  - **Game.tsx**, componente Game que renderiza dos etiquetas span y una canvas, usa el custom hook _useGame.ts_
  - **gameLogic.ts**, lógica del juego que no necesita usar los useRef()
  - **index.css**, estilos basicos usados en la web
  - **main.tsx**, documento que es cargado por el _index.html_ y que carga el _App.tsx_ y el _index.css_
  - **types.d.ts**, interfaces de ts
  - **useGame.ts**, custom hook principal del que sale toda la lógica que depende de las constantes obtenidas de los useRef()
  - **vite-env.d.ts**, vite ts config

### documentos:

- **.gitignore**, para evitar subir cositas como el node_modules etc
- **README.md**, explicando el contenido y sentido del repo
- **eslint.config.js**, configuracion del linter
- **index.html**, punto de entrada de la web desde donde se carga el main.tsx
- **package.json**, configuracion de las dependencias y el proyecto
- **tsconfig.app.json, tsconfig.json, tsconfig.node.json**, configuracion de typescript
- **vite.config.ts**, configuracion vite

## Posible uso

Puedes clonar el repo instalar las dependencias usando `npm i` y usando `npm run dev` ver el juego en tu ordenador
