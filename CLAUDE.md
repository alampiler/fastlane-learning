# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Learning plan

At the start of every session, read [`rn-cicd-learning-plan.md`](rn-cicd-learning-plan.md) first — it defines which session/phase we're on and what this repo should have by the end of it. Log breakages and fixes in [`STORIES.md`](STORIES.md) as work happens (what broke → how the cause was found → what was done → numbers).

## Basic RN commands

```sh
yarn start           # Metro dev server
yarn android         # build + run on Android
yarn ios             # build + run on iOS
yarn lint            # eslint
yarn tsc --noEmit    # typecheck
yarn jest            # run tests
```

iOS native deps go through Bundler, not `pod` directly:

```sh
bundle install
cd ios && bundle exec pod install
```

Use `yarn`, not `npm` — the lockfile and Yarn Berry linker mode depend on it.

## Safeguards

- Never commit secrets: keystores, `.p8`/`.p12` files, service-account JSON, `.env` (only `.env.example` is tracked once it exists). These belong in GitHub Secrets, not the repo.
- Never disable code signing or app verification as a way to "fix" a build error — find the real cause instead.
- Don't force-push or rewrite history on `main`.
- Don't touch branch protection rules or repo visibility without asking first.
- GitHub access is read-only: fetching info (e.g. `gh issue view`, `gh pr view`, `gh repo view`) is fine, but never push, open/edit/close PRs or issues, comment, merge, or otherwise write to GitHub from this project.
