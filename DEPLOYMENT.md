# Existing Solfortes site: Vercel handoff

Base c0c2857e966de3f4efd3e7f83b9c3797b0d8b0b0. Static HTML/CSS/JS; framework Other, no build, output repository root. Existing home and /lp/solar-residencial/ retained. vercel.json translates preview security headers and keeps noindex, capture OFF. No deployment, DNS, payment or plan change performed. Commercial deployment requires an appropriate plan.

Área da equipe on the home preserves the primary sales CTA. Técnico, Consultor and Operacional are disabled preparation labels. team-entry.config.json is a handoff template, not a runtime resolver. Activate only with verified destination URLs and actual profile permissions; reuse the existing applications. This change creates no accounts, permissions or SSO.

Palette matches the five provided official colors. Existing logo remains unchanged; separate visual comparison with the approved master is pending. Existing WebGL/Canvas2D/static fallbacks and reduced-motion code are retained. GPU/rendering, responsive layout and Vercel live route/header behavior still require browser acceptance.

Form validation stays local. CSP blocks connections and form actions; no lead is submitted, no tracker is installed. Tests are structural checks, not browser/network verification.

Run python3 tests/test_deployment.py, node tests/test_frontend.cjs, and node --check on the five JS files. Renderer lifecycle tests use mocks; they do not certify real WebGL/GPU behavior.

QA update 2026-10-17: team-entry labels now use the existing official sand color against the dark header (contrast 12.34:1). Existing logo, imagery, geometry, disabled role destinations and capture-OFF behavior remain unchanged. Browser QA of the existing public baseline confirms Canvas2D fallback movement/pause and form validation at desktop and narrow CSS width; the new local header still requires visual acceptance.

QA increment 2026-10-20: see SITE_LP_QA.md for the complete offline test commands, 48 source/contract tests, capture-OFF simulated states, and remaining browser/publication gates. The existing page still calls preview(), never the simulated adapter. No remote CI or deployment is claimed.
