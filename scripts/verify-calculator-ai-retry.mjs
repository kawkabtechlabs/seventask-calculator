import assert from 'node:assert/strict';
import { handleCalculatorAI } from '../server/calculator-ai.mjs';

const request = () => new Request('https://seventaskcalculator.in/api/calculator-ai', {
  method: 'POST',
  headers: { Origin: 'https://seventaskcalculator.in', 'Content-Type': 'application/json', 'CF-Connecting-IP': 'test-retry' },
  body: JSON.stringify({ prompt: 'two plus two', fast: true }),
});
const env = { GEMINI_API_KEY: 'test-key' };
const valid = () => Response.json({ candidates: [{ content: { parts: [{ text: JSON.stringify({
  kind: 'expression', expression: '2+2', answer: 'Result', tool: '', fields: [],
}) }] } }] });

let calls = 0;
let response = await handleCalculatorAI(request(), env, async () => {
  calls++;
  return calls === 1 ? new Response('', { status: 503 }) : valid();
});
assert.equal(response.status, 200);
assert.equal((await response.json()).expression, '2+2');
assert.equal(calls, 2, 'transient provider error should retry once');

calls = 0;
response = await handleCalculatorAI(request(), env, async () => {
  calls++;
  return new Response('', { status: 400 });
});
assert.equal(response.status, 503);
assert.equal(calls, 1, 'invalid upstream request must not retry');

calls = 0;
response = await handleCalculatorAI(request(), env, async () => {
  calls++;
  throw new Error('temporary connection failure');
});
assert.equal(response.status, 503);
assert.equal(calls, 2, 'network error should retry only once');

console.log('Calculator AI retry checks passed.');
