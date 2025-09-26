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

**O instalar manualmente desde VS Code:**

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
  "typescript.tsdk": "node_modules/typescript/lib"
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
```
