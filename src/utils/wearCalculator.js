/**
 * utils/wearCalculator.js
 * Funções para cálculo de desgaste de peças por km rodado.
 */

/**
 * Calcula o percentual de desgaste de uma peça.
 * @param {number} kmAtual     - Km atual do veículo
 * @param {number} kmUltimaTroca - Km em que a peça foi trocada
 * @param {number} vidaUtilKm  - Vida útil da peça em km
 * @returns {number} percentual (0–N, onde > 1 = vencida)
 */
export function calcDesgaste(kmAtual, kmUltimaTroca, vidaUtilKm) {
  if (!vidaUtilKm || vidaUtilKm <= 0) return 0;
  return (kmAtual - kmUltimaTroca) / vidaUtilKm;
}

/**
 * Retorna um label e cor semântica com base no percentual de desgaste.
 * @param {number} pct
 * @returns {{ label: string, severity: 'success'|'warning'|'error' }}
 */
export function wearSeverity(pct) {
  if (pct >= 1) return { label: 'Vencida', severity: 'error' };
  if (pct >= 0.8) return { label: 'Em alerta', severity: 'warning' };
  return { label: 'Normal', severity: 'success' };
}

/**
 * Calcula o total de custo de uma lista de peças de manutenção.
 * @param {Array<{quantidade: number, custoUnitario: number}>} pecas
 * @returns {number}
 */
export function calcTotalCost(pecas = []) {
  return pecas.reduce((acc, p) => acc + p.quantidade * p.custoUnitario, 0);
}

/**
 * Formata número como BRL.
 * @param {number} value
 */
export function formatBRL(value) {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(value);
}

/**
 * Formata km com separador de milhar.
 * @param {number} km
 */
export function formatKm(km) {
  return new Intl.NumberFormat('pt-BR').format(km) + ' km';
}
