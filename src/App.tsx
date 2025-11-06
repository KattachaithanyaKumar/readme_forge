/* eslint-disable @typescript-eslint/no-explicit-any */
// App.tsx
import Navbar from "./components/Navbar";
import Toggle from "./components/Toggle";
import { IoMdLink } from "react-icons/io";
import { FaRegCopy } from "react-icons/fa6";
import { FiDownload } from "react-icons/fi";
import { GoGear } from "react-icons/go";
import Footer from "./components/Footer";
import { useEffect, useMemo, useRef, useState } from "react";
import MarkdownPreview from "@uiw/react-markdown-preview";
import Spinner from "./components/Spinner";
import { SkeletonMd } from "./components/SkeletonMd";
import Modal from "./components/Modal";
import toast from "react-hot-toast";
import { fetchRepoSnapshot, parseRepoUrl } from "./scripts/github";
import { buildReadmePrompt } from "./scripts/prompt";
import { streamReadmeWithContinuation } from "./scripts/ai";

const END_MARK = "<!-- END_OF_README -->";
const GH_TOKEN_KEY = "gh_token";

const App = () => {
  const [repoUrl, setRepoUrl] = useState<string>("");
  const [result, setResult] = useState<string>("");
  const [preview, setPreview] = useState<boolean>(true);
  const [loading, setLoading] = useState<boolean>(false);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  // Abort streaming safely when user navigates away/remounts
  const abortRef = useRef<{ aborted: boolean }>({ aborted: false });
  useEffect(() => {
    console.log(import.meta.env.VITE_GEMINI_API_KEY);
    return () => {
      abortRef.current.aborted = true;
    };
  }, []);

  const repoIdPretty = useMemo(() => {
    const id = parseRepoUrl(repoUrl);
    return id ? `${id.owner}/${id.name}` : "";
  }, [repoUrl]);

  const onGenerate = async () => {
    if (loading) return;

    const parsed = parseRepoUrl(repoUrl.trim());
    if (!parsed) {
      toast.error(
        "Enter a valid GitHub URL like https://github.com/owner/repo"
      );
      return;
    }

    setResult("");
    setLoading(true);
    abortRef.current.aborted = false;

    const run = async () => {
      try {
        // 1) Fetch repo snapshot (tree + selected textual files)
        const token =
          (localStorage.getItem(GH_TOKEN_KEY) || "").trim() || undefined;
        const snapshot = await fetchRepoSnapshot(repoUrl.trim(), token);

        // 2) Prepare trimmed context from snapshot files
        const context = snapshot.files
          .map((f) => `# ${f.path}\n\`\`\`\n${f.content ?? ""}\n\`\`\``)
          .join("\n\n");

        // 3) Build prompt
        const prompt = buildReadmePrompt(
          {
            repo: `${snapshot.id.owner}/${snapshot.id.name}`,
            branch: snapshot.defaultBranch,
            description: snapshot.repoDescription ?? null,
          },
          context
        );

        // 4) Stream README
        setResult(""); // clear
        for await (const chunk of streamReadmeWithContinuation(prompt)) {
          if (abortRef.current.aborted) throw new Error("aborted");
          setResult((prev) => prev + chunk); // append-only
        }

        // 5) Normalize: keep only one END mark at the end
        setResult((prev) => {
          const idx = prev.indexOf(END_MARK);
          if (idx === -1) return prev;
          return prev.slice(0, idx + END_MARK.length);
        });

        return "ok";
      } catch (e: any) {
        if (e?.message === "aborted") throw e;
        // Common GitHub rate-limit hint
        if (String(e).includes("403")) {
          throw new Error(
            "GitHub API rate limit hit. Add a personal access token (classic, repo:read) in settings."
          );
        } else {
          throw new Error("Enter a valid Gemini API key");
        }
        throw e;
      }
    };

    const p = run();
    toast.promise(p, {
      loading: `Generating README for ${repoIdPretty || "repo"}…`,
      success: "README generated!",
      error: (err) => err?.message || "Failed to generate README",
    });

    try {
      await p;
    } catch {
      // swallow; toast already shown
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = async () => {
    if (!result || loading) return;
    await navigator.clipboard.writeText(result);
    toast.success("Copied README to clipboard");
  };

  const downloadMd = () => {
    if (!result || loading) return;
    const blob = new Blob([result], { type: "text/markdown;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "README.md";
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <main className="bg-(--purple) w-full min-h-screen">
      <Navbar onClick={() => setIsModalOpen(true)} />

      <div className="w-[90%] md:w-[80%] lg:w-[70%] mx-auto">
        {/* hero */}
        <section
          id="hero"
          className="mt-12 sm:mt-16 lg:mt-20 flex flex-col items-center justify-center text-center"
        >
          <h1 className="text-(--white) text-3xl sm:text-4xl lg:text-5xl font-bold leading-tight max-w-[1000px] mx-auto">
            Generate a Perfect README from Your GitHub Repo
          </h1>
          <p className="text-(--text-light) text-base sm:text-lg mt-3 max-w-[650px] mx-auto">
            Enter your GitHub repository link and let AI write your README.md
            automatically.
          </p>

          <div className="mt-8 sm:mt-10 w-full max-w-[650px] mx-auto">
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-0 h-auto sm:h-14">
              {/* Link icon */}
              <div className="hidden sm:flex bg-(--white-5) border border-(--white-20) sm:rounded-l-xl rounded-xl sm:rounded-r-none px-4 sm:px-5 h-12 sm:h-full items-center justify-center">
                <IoMdLink color="#9ca3af" size={20} />
              </div>

              <input
                type="text"
                className="bg-(--black-20) w-full border border-(--white-20) sm:border-l-transparent outline-none h-12 sm:h-full placeholder:text-(--white-20) text-(--white) px-4 sm:px-5 rounded-xl sm:rounded-none disabled:opacity-60"
                placeholder="Enter GitHub repo URL (e.g. vercel/next.js)"
                aria-label="GitHub repository URL"
                disabled={loading}
                value={repoUrl}
                onChange={(e) => setRepoUrl(e.target.value)}
              />

              <button
                onClick={onGenerate}
                disabled={loading || !repoUrl.trim()}
                className="bg-(--accent) text-(--white) h-12 sm:h-full px-4 sm:px-5 rounded-xl sm:rounded-r-xl sm:rounded-l-none hover:opacity-90 whitespace-nowrap cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
                aria-live="polite"
              >
                {loading ? (
                  <span className="inline-flex items-center gap-2">
                    <Spinner />
                    <span>Generating…</span>
                  </span>
                ) : (
                  "Generate README"
                )}
              </button>
            </div>

            {/* Subtext about token */}
            <p className="text-(--white-20) text-xs mt-2">
              Tip: add a GitHub token in settings to avoid rate limits (stored
              as <code>gh_token</code>).
            </p>
          </div>
        </section>

        {/* Result */}
        <section id="result" className="mt-12 sm:mt-16">
          <div className="max-w-[1000px] mx-auto text-left px-0 sm:px-2 flex items-center justify-between gap-20 sm:gap-10">
            <Toggle
              option1="Preview"
              option2="Markdown"
              onToggle={() => !loading && setPreview((p) => !p)}
            />
            <div className="flex items-center gap-3">
              {/* Copy */}
              <button
                onClick={copyToClipboard}
                disabled={!result || loading}
                className="flex items-center justify-center gap-2 bg-(--white-5) hover:bg-(--white-10)
                 p-3 sm:px-5 sm:py-3 rounded-xl text-white text-[14px]
                 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed
                 w-12 h-12 sm:w-auto sm:h-auto"
                aria-label="Copy"
                title="Copy Markdown"
              >
                <FaRegCopy color="#fff" />
              </button>

              {/* Download */}
              <button
                onClick={downloadMd}
                disabled={!result || loading}
                className="flex items-center justify-center gap-2 bg-(--white-5) hover:bg-(--white-10)
                 p-3 sm:px-5 sm:py-3 rounded-xl text-white text-[14px]
                 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed
                 w-12 h-12 sm:w-auto sm:h-auto"
                title="Download README.md"
              >
                <FiDownload />
                <span className="hidden sm:inline">Download</span>
              </button>
            </div>
          </div>

          <div className="relative max-w-[1000px] bg-(--white-5) mx-auto mt-10 rounded-2xl p-6">
            {loading && (
              <div className="absolute inset-0 rounded-2xl bg-black/20 pointer-events-none" />
            )}

            <div className="border border-dashed border-(--white-20) rounded-xl p-4 overflow-auto">
              {loading ? (
                <div className="p-2">
                  <SkeletonMd />
                </div>
              ) : result ? (
                preview ? (
                  <div className="p-2">
                    <MarkdownPreview
                      source={result}
                      style={{ padding: 16, background: "transparent" }}
                    />
                  </div>
                ) : (
                  <pre className="text-(--white) whitespace-pre-wrap font-mono text-sm p-2">
                    {result}
                  </pre>
                )
              ) : (
                <div className="flex justify-center items-center flex-col h-[226px]">
                  <h2 className="text-(--white) font-black text-center">
                    Your generated README will appear here...
                  </h2>
                  <p className="text-(--text-light) w-[60%] text-center">
                    Once you enter a GitHub repository link and click generate,
                    the preview will be displayed in this panel.
                  </p>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* How It Works */}
        <section id="info" className="mt-30 pb-40 max-w-[1000px] mx-auto">
          <div className="text-center">
            <h1 className="text-white text-[36px] font-bold">How it works</h1>
            <p className="text-(--text-light) text-[16px]">
              Generate a professional README in three simple steps.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-10">
            <div className="bg-(--white-5) border border-(--white-10) rounded-xl p-8">
              <div className="p-2.5 bg-(--accent-10) size-10 rounded-full mb-5">
                <IoMdLink size={20} color="#8C2BEE" />
              </div>
              <h2 className="text-(--white)">Paste Your Repo Link</h2>
              <p className="text-(--text-light)">
                Simply provide the URL to your public GitHub repository.
              </p>
            </div>
            <div className="bg-(--white-5) border border-(--white-10) rounded-xl p-8">
              <div className="p-2.5 bg-(--accent-10) size-10 rounded-full mb-5">
                <GoGear size={20} color="#8C2BEE" />
              </div>
              <h2 className="text-(--white)">AI Analyzes Your Code</h2>
              <p className="text-(--text-light)">
                Our AI scans your codebase to identify the language, framework,
                and key features.
              </p>
            </div>
            <div className="bg-(--white-5) border border-(--white-10) rounded-xl p-8">
              <div className="p-2.5 bg-(--accent-10) size-10 rounded-full mb-5">
                <FiDownload size={20} color="#8C2BEE" />
              </div>
              <h2 className="text-(--white)">Get Your README</h2>
              <p className="text-(--text-light)">
                Download or copy the generated Markdown file to use in your
                project.
              </p>
            </div>
          </div>
        </section>
      </div>

      <Footer />

      <Modal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
        }}
      />
    </main>
  );
};

export default App;
