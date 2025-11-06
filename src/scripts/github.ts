/* eslint-disable @typescript-eslint/no-explicit-any */
import { getKeysFromStore } from "../scripts/keys";

export type RepoId = { owner: string; name: string };
export type RepoFile = { path: string; size: number; content?: string };
export type RepoSnapshot = {
  id: RepoId;
  defaultBranch: string;
  files: RepoFile[];
  repoDescription?: string;
};

const GITHUB_API = "https://api.github.com";

async function j<T>(url: string, token?: string): Promise<T> {
  const headers: Record<string, string> = {
    Accept: "application/vnd.github+json",
  };
  if (token) headers.Authorization = `Bearer ${token}`;
  const res = await fetch(url, { headers });
  if (!res.ok) throw new Error(`${res.status} ${res.statusText}: ${url}`);
  return res.json();
}

export function parseRepoUrl(input: string): RepoId | null {
  try {
    const url = new URL(input.trim());
    if (url.hostname !== "github.com") return null;
    const [, owner, name] = url.pathname.split("/");
    if (!owner || !name) return null;
    return { owner, name };
  } catch {
    const parts = input.trim().split("/");
    if (parts.length === 2 && parts[0] && parts[1])
      return { owner: parts[0], name: parts[1] };
    return null;
  }
}

export async function getRepoMeta(
  id: RepoId,
  token = getKeysFromStore().githubToken
) {
  const data = await j<any>(
    `${GITHUB_API}/repos/${id.owner}/${id.name}`,
    token
  );
  return {
    defaultBranch: data.default_branch as string,
    description: data.description as string | undefined,
  };
}

type TreeItem = { path: string; type: "blob" | "tree"; size?: number };
type TreeResp = { tree: TreeItem[] };

export async function getTree(
  id: RepoId,
  branch: string,
  token = getKeysFromStore().githubToken
): Promise<TreeResp> {
  return j<TreeResp>(
    `${GITHUB_API}/repos/${id.owner}/${id.name}/git/trees/${encodeURIComponent(
      branch
    )}?recursive=1`,
    token
  );
}

function looksTextual(p: string) {
  const l = p.toLowerCase();
  if (l.endsWith(".min.js")) return false;
  const ext = l.split(".").pop() || "";
  const allow = new Set([
    "md",
    "mdx",
    "txt",
    "js",
    "jsx",
    "ts",
    "tsx",
    "json",
    "yml",
    "yaml",
    "toml",
    "xml",
    "html",
    "css",
    "scss",
    "less",
    "py",
    "rb",
    "go",
    "java",
    "kt",
    "rs",
    "c",
    "cpp",
    "h",
    "cs",
    "php",
    "sh",
    "env",
    "dockerfile",
    "gradle",
    "properties",
  ]);
  return allow.has(ext) || l === "dockerfile" || l === "makefile";
}

function importance(p: string): number {
  const l = p.toLowerCase();
  let s = 0;
  if (l.endsWith("/readme.md") || l === "readme.md") s += 100;
  if (l === "package.json") s += 95;
  if (l.includes("contributing")) s += 70;
  if (l.includes("docs/")) s += 70;
  if (l.endsWith("requirements.txt") || l.endsWith("pyproject.toml")) s += 70;
  if (l.endsWith("pom.xml") || l.endsWith("build.gradle")) s += 60;
  if (l.endsWith("go.mod")) s += 60;
  if (l.startsWith("src/") && l.split("/").length <= 3) s += 40;
  if (l.includes("example") || l.includes("sample")) s += 35;
  if (l.includes("license")) s += 20;
  return s;
}

export async function fetchRepoSnapshot(
  input: string,
  token = getKeysFromStore().githubToken
): Promise<RepoSnapshot> {
  const id = parseRepoUrl(input);
  if (!id)
    throw new Error(
      "Enter a valid GitHub URL like https://github.com/owner/repo or owner/repo"
    );

  const { defaultBranch, description } = await getRepoMeta(id, token);
  const treeResp = await getTree(id, defaultBranch, token);
  const tree = treeResp.tree;

  const candidates = tree
    .filter((t) => t.type === "blob" && looksTextual(t.path))
    .sort((a, b) => importance(b.path) - importance(a.path))
    .slice(0, 12);

  const files: RepoFile[] = [];
  let used = 0;
  const BUDGET = 60000;
  const PER_FILE = 16000;

  for (const f of candidates) {
    const raw = `https://raw.githubusercontent.com/${id.owner}/${id.name}/${defaultBranch}/${f.path}`;
    try {
      const res = await fetch(raw, {
        headers: token ? { Authorization: `Bearer ${token}` } : undefined,
      });
      if (!res.ok) continue;
      let text = await res.text();
      if (text.length > PER_FILE)
        text = text.slice(0, PER_FILE) + "\n/* …truncated… */";
      if (used + text.length > BUDGET) break;
      used += text.length;
      files.push({ path: f.path, size: text.length, content: text });
    } catch (err) {
      console.error(err);
    }
  }

  return { id, defaultBranch, repoDescription: description, files };
}
