# SevenTask Calculator (STC) — New Plugin

This is a **new plugin package** for Kawkab Tech Labs. Its internal canonical plugin identifier is `seventask-calculator-stc`, distinct from the older `seventask-calculator` entry. The exact user-facing name is **SevenTask Calculator (STC)**. Do **not** upload this ZIP as a new version of the old plugin: ChatGPT will reject the canonical-name mismatch. Use the **New Plugin** upload flow.

- Display name: **SevenTask Calculator (STC)**
- Website: https://seventaskcalculator.in/
- MCP: https://mcp.seventaskcalculator.in/mcp
- Icon: `assets/seventask-icon.png` (1024 × 1024)
- Existing calculation engine: 136 calculators, 14 MCP tools
- UI: premium result card with Edit Inputs and Recalculate on compatible ChatGPT hosts
- Login to calculate: none

This package reuses the independently deployed calculation server. It does not change the original website or delete any old plugin listing. Public directory availability requires OpenAI's submission and approval separately.

## Install

1. Go to ChatGPT → Plugins → **Add** → **New Plugin**.
2. Upload the `SevenTask-Calculator-STC-New-Plugin.zip` archive.
3. Verify that the new entry is **SevenTask Calculator (STC)**.
4. Test `20% of 22 lakh` and `₹3 lakh at 8% for 3 years`.

If the custom domain is unreachable in the ChatGPT registration flow, stop and verify its public HTTPS/MCP routing. Do not silently change the server to a different domain.
