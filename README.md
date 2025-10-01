# Cocktails project

Este proyecto fue creado con el objetivo de cumplir las expectativas de un desafío técnico para Glofy, se trata de una web en el cual se puede buscar tragos con o sin alcohol y filtrarlos por categorías, ingredientes o por nombres, con la posibilidad de poder listarlos, visualizarlos e inspeccionarlos. Desde el listado se puede visualizar mediante interacciones el detalle de sus ingredientes y tambien brinda la opción de clicar sobre una categoría para ver tragos que contenga la categoría previamente seleccionada.

### Documentación técnica

Este es un proyecto creado en Angular 20 en la cual se integraron las siguientes tecnologías:

- [PrimeNG v20](https://v17.primeng.org/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Prettier](https://prettier.io/)
- [Eslint](https://eslint.org/)

El proyecto cuenta con una convensión de código y formato de tipeo tanto en los archivos
typescript como en los archivos configuradas con Prettier + Eslint.

### Requisitos

- Tener mínimo la versión de [Node 22](https://nodejs.org/en/blog/release/v22.20.0) para evitar errores de compilación.
- Tener Angular 20.
- Para colaboradores seguir los pasos de instalación mencionados en la siguiente sección.

### Instalación

#### 1. **Instalar dependencias**

```bash
npm install
```

#### 2. **Configurar VS Code**

**Instalar extensiones autómaticamente:**

```bash
code --install-extension dbaeumer.vscode-eslint
code --install-extension esbenp.prettier-vscode
code --install-extension angular.ng-template
code --install-extension ms-vscode.vscode-typescript-next
```

**O instalar manualmente extensiones para su IDE:**

- ESLint
- Prettier
- Angular Language Service
- TypeScript Importer

#### 3. **Configurar VS Code Settings**

Crear/actualizar `.vscode/settings.json`:

```json
{
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "editor.formatOnSave": true,
  "editor.formatOnPaste": true,
  "editor.codeActionsOnSave": {
    "source.fixAll": "explicit",
    "source.organizeImports": "explicit",
    "source.sortMembers": "explicit"
  },
  "typescript.tsdk": "node_modules/typescript/lib",
  "todo-tree.tree.scanMode": "workspace only",
  "todo-tree.general.tags": [
    "TODO",
    "@todo",
    "* @todo",
    "*@todo",
    "DOING",
    "@doing",
    "* @doing",
    "*@doing"
  ],
  "[html]": {
    "editor.defaultFormatter": "esbenp.prettier-vscode"
  }
}
```

#### 4. **Verificar configuración**

```bash
# Verificar que Angular CLI funciona
ng version

# Verificar que ESLint funciona
npm run lint

# Verificar que Prettier funciona
npx prettier --check .

# Correr el proyecto con el CLI de Angular
ng serve
# O con el script configurado en el package.json
npm start
```
