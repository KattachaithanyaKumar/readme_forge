export function buildReadmePrompt(
  meta: {
    repo: string;
    branch: string;
    description?: string | null;
  },
  trimmedContext: string
) {
  return `Generate a concise, well-structured README.md for this repo.

### Must Include
- Project title + 1–2 line tagline  
- Short overview  
- Features (bulleted)  
- Tech stack (detect from code)  
- Quickstart (install, run, test)  
- Configuration / Env vars  
- License  
- End with <!-- END_OF_README -->

### Rules
- Use clean Markdown.  
- Be realistic — use real commands from files.  
- Add TODO if something is missing.  
- Keep it brief and developer-friendly.  
- No extra commentary outside the README.  

Repo: ${meta.repo}  
Branch: ${meta.branch}  
Description: ${meta.description ?? "(none)"}  

### Context
\`\`\`
${trimmedContext}
\`\`\`

Return only the README content and end with <!-- END_OF_README -->.`;
}
