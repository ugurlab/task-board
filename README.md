# Task Board — Desk & Bench

A download-only task board. No live web application is hosted here.

- Download page: https://ugurlab.github.io/task-board/
- ZIP package: https://github.com/ugurlab/task-board/releases/download/v1.2.1/task-board-1.2.1.zip
- Catalogue: https://ugurlab.github.io/desk-and-bench/

The download page uses the catalogue's shared stylesheet and rules: read https://github.com/ugurlab/desk-and-bench/blob/main/DESIGN.md before editing it.

## Use
Extract the ZIP and open `task-board.html` in Chrome, Edge or Firefox. No installation or internet connection is needed.
Tasks stay in this browser only and do not sync between devices. Clearing browser data can erase them, so download JSON backups regularly from the ⋯ menu. Keep using the same file and browser.

The app is in English only.

## Changes
- 1.2.1: removed the This week and Streak counters. Existing task completion, backups, focus, overdue tasks and section behavior are preserved.
- 1.2.0: opening a strip puts it first; at the configured or width-limited capacity, the rightmost open section folds. Remaining open sections keep their order. Manual dragging is respected, and old tasks/backups remain compatible. Added the catalogue link above the app title.
- 1.1.1: licence texts (Task Board and SortableJS) moved into a comment at the top of `task-board.html`; the ZIP no longer has a separate `LICENSE.txt`. The app itself is unchanged.
- 1.1: English only (the language switch was removed); overdue dates shown as "1 Jan 2026"; backups are named `task-board-backup-YYYY-MM-DD.json`.
- 1.0: First release.

## Credits
Task Board was designed by Ugur Comlekcioglu. The first version was built with Claude (Anthropic) and it was further developed with ChatGPT (OpenAI).

## Licence
Task Board is open source under the [MIT License](LICENSE). You are welcome to use, change and share it, including in your own projects, as long as you keep the copyright notice and the licence text, which credit the original author.

Includes SortableJS 1.15.2, also under the MIT License. Both licence texts are kept in a comment at the top of `task-board.html`, so every downloaded copy carries them.

## Verification
Run `node verify.mjs` to test the actual HTML inside `task-board.zip`. This uses Node built-ins only and checks opening order, capacity, persistence, legacy states, task preservation and script syntax.

## Contributing
Issues and pull requests are welcome. If you build on Task Board, a link back to this repository is appreciated.
