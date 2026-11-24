# Web release workflow

Source repository: https://github.com/kawkabtechlabs/seventask-calculator

Production Cloudflare Pages project: `seventaskcalculator`
Production domain: https://seventaskcalculator.in

The similarly named `seventask-calculator` and `kawkabtechlabs` Pages projects
are not this production domain. Always check the project/domain mapping first.

Push a feature branch, open a pull request, require the Web checks job, and
verify a preview before merging. Production should deploy the reviewed commit.
For an authorized direct release use:

    npx wrangler pages deploy . --project-name=seventaskcalculator --branch=main

Verify `/terms-of-use` contains its own title and rights notice, `/calculator`
loads, security headers appear, and `/api/calculator-ai` responds. A 200 response
alone does not prove that the correct page was served. Keep Android releases
and `mobile-update.json` independent from web releases.
