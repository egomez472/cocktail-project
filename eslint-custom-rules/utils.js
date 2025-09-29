/**
 * Extrae solo el valor de la regla ('rule') de un objeto de reglas con metadatos.
 * Esto permite entregar a ESLint el formato esperado.
 *
 * @template T
 * @param {Record<string, {rule: T, meta?: object}>} rulesWithMeta
 * @returns {Record<string, T>} Objeto plano de reglas para ESLint
 *
 * Ejemplo de formato esperado por ESLint:
 * {
 *   "no-console": "warn",
 *   "eqeqeq": ["error", "always"]
 * }
 *
 * Fuente: https://eslint.org/docs/latest/use/configure/rules
 */
function extractRulesWithMeta(rulesWithMeta) {
  // Validar que rulesWithMeta sea un objeto válido
  if (!rulesWithMeta || typeof rulesWithMeta !== 'object') {
    console.warn(
      'extractRulesWithMeta: rulesWithMeta debe ser un objeto válido, recibido:',
      rulesWithMeta
    );
    return {};
  }

  return Object.fromEntries(
    Object.entries(rulesWithMeta).map(([k, v]) =>
      v && typeof v === 'object' && 'rule' in v ? [k, v.rule] : [k, v]
    )
  );
}

module.exports = {
  extractRulesWithMeta,
};
