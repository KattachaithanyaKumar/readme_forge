export function buildReadmePrompt(
  meta: {
    repo: string;
    branch: string;
    description?: string | null;
  },
  trimmedContext: string
) {
  return `Write a concise, production-ready README.md for this repo.

Must include:
- Title + 1–2 line value prop
- Features
- Tech stack (auto-detect)
- Quickstart (install/run/test)
- Configuration
- Examples
- Contributing + License
Use realistic commands from files. If uncertain, add TODOs. Keep it tight.
IMPORTANT: End the README with: <!-- END_OF_README -->

Repo: ${meta.repo}
Branch: ${meta.branch}
Description: ${meta.description ?? "(none)"}

Context (trimmed):
---
${trimmedContext}
---
Return ONLY the README.md content and end with <!-- END_OF_README -->.`;
}
