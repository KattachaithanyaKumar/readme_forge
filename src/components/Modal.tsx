import React, { useEffect, useState } from "react";
import { IoMdClose, IoMdKey, IoLogoGithub } from "react-icons/io";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave?: (keys: { apiKey: string; githubToken: string }) => void;
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, onSave }) => {
  const [apiKey, setApiKey] = useState("");
  const [githubToken, setGithubToken] = useState("");

  // Close modal on ESC
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  if (!isOpen) return null;

  const handleSave = () => {
    onSave?.({ apiKey, githubToken });
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex justify-center items-center bg-black/40 backdrop-blur-sm px-4 sm:px-0"
      onClick={onClose}
    >
      {/* Modal box */}
      <div
        onClick={(e) => e.stopPropagation()}
        className="bg-(--purple) border border-(--white-10) rounded-xl w-full max-w-[600px] shadow-xl animate-[fadeIn_0.2s_ease,scaleIn_0.2s_ease]"
      >
        {/* Header */}
        <div className="border-b border-(--white-10) p-4 flex items-center justify-between">
          <div>
            <h2 className="text-(--white) text-xl font-semibold">Settings</h2>
            <p className="text-(--text-light) text-sm sm:text-md">
              Manage your keys securely
            </p>
          </div>
          <button
            onClick={onClose}
            aria-label="Close modal"
            className="p-2 rounded-lg hover:bg-(--white-10) transition-colors"
          >
            <IoMdClose size={22} color="#fff" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 text-(--white)">
          {/* API Key */}
          <label className="text-sm text-(--text-light)">Custom API Key</label>
          <div className="flex items-center border border-(--white-20) rounded-xl my-2 overflow-hidden bg-(--white-5)">
            <div className="p-3 bg-(--white-10)">
              <IoMdKey size={20} />
            </div>
            <input
              type="password"
              placeholder="Enter your API key"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              className="w-full h-full outline-none border-none bg-transparent text-(--white) placeholder:text-(--text-light) p-3 text-sm"
            />
          </div>

          {/* GitHub Token */}
          <label className="text-sm text-(--text-light)">GitHub Token</label>
          <div className="flex items-center border border-(--white-20) rounded-xl my-2 overflow-hidden bg-(--white-5)">
            <div className="p-3 bg-(--white-10)">
              <IoLogoGithub size={20} />
            </div>
            <input
              type="password"
              placeholder="Enter your GitHub token"
              value={githubToken}
              onChange={(e) => setGithubToken(e.target.value)}
              className="w-full h-full outline-none border-none bg-transparent text-(--white) placeholder:text-(--text-light) p-3 text-sm"
            />
          </div>
        </div>

        {/* Footer */}
        <div className="border-t border-(--white-10) p-4 flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-(--white-10) hover:bg-(--white-20) rounded-xl text-(--text-light) transition-colors cursor-pointer"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="px-4 py-2 bg-(--accent) hover:opacity-80 rounded-xl text-(--white) font-medium transition-all cursor-pointer"
          >
            Save Changes
          </button>
        </div>
      </div>

      {/* Animations */}
      <style>
        {`
          @keyframes fadeIn {
            from { opacity: 0 }
            to { opacity: 1 }
          }
          @keyframes scaleIn {
            from { transform: scale(0.95) }
            to { transform: scale(1) }
          }
        `}
      </style>
    </div>
  );
};

export default Modal;
