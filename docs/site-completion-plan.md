# CHENGDU 80 — 网站功能与内容完善阶段

## Baseline and boundary
- Prerequisite complete: particle hold + reversible spread + side interaction + lower globe, `6dc516c2011888550f2bf21db03e2a0bb74b27a9`.
- Started from a clean worktree on `codex/scroll-particle-story`; this phase is isolated on `codex/site-completion`.
- Canonical isolated preview only. No production publication, remote force push, DNS, other repository, particle physics, globe shader or dependency changes.
- Actual delivery is Vite MPA → `out/particle-preview`, via `qa/particle80.vite.config.ts` and `scripts/finalize-particle-preview.mjs`. `app/` contains CSS, not deployed routes.

## Route audit before work
| Page | Actual status at baseline |
|---|---|
| Home | Working particle/scroll introduction and embedded university network |
| Global Network | Working route `/global-network/`; search/filter/language enhancements outstanding |
| About | Navigation href only; no page |
| Competition | Navigation href only; no page |
| History | Navigation href only; no page |
| Winners | Navigation href only; no page |
| Partners | Navigation href only; no page; 2026 roles unconfirmed |
| FAQ / resources | Absent; no approved current documents/contact |

## Execution queue
1. **Batch 1 — complete locally:** unified 2025/2026 config, shared chrome, Competition and accessible FAQ, static output routes. Lint/typecheck, existing 35 tests and build passed. Desktop/mobile screenshot; native menu Escape and focus restoration verified. Other nav destinations remain Batch 2/3 work, not claimed complete.
2. **Batch 2 — in progress:** evidence-backed History / Winners lists and details, URL filters, share links, source associations.
3. **Batch 3 — queued:** About / Partners, network directory, CN/EN, available downloads, global search last.
4. **Batch 4 — queued:** route, accessibility, responsive, particle/globe regression, screenshots/recording/build report.

Each batch receives real checks and a local commit. Missing noncritical information is recorded without fabricating it. No public deployment is authorized by this phase.
