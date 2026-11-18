import { handleCalculatorAI } from '../../server/calculator-ai.mjs';

export function onRequest({ request, env }) {
  return handleCalculatorAI(request, env);
}
