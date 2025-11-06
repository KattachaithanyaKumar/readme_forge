import { useState, type KeyboardEvent } from "react";
import { FaMarkdown } from "react-icons/fa";
import { FaEye } from "react-icons/fa";

interface ToggleProps {
  option1: string;
  option2: string;
  onToggle?: (selected: string) => void;
}

const Toggle = ({ option1, option2, onToggle }: ToggleProps) => {
  const [selected, setSelected] = useState(option1);

  const toggle = () => {
    const next = selected === option1 ? option2 : option1;
    setSelected(next);
    onToggle?.(next);
  };

  const onKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    if (e.key === "ArrowRight" || e.key === "ArrowLeft") {
      e.preventDefault();
      toggle();
    }
  };

  const baseBtn =
    "rounded-lg transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-(--accent)";

  const btn1 =
    `${baseBtn} px-3 sm:px-6 py-2 text-sm sm:text-base flex items-center justify-center gap-2 ` +
    (selected === option1
      ? "bg-(--white-10) text-(--white)"
      : "text-(--text-light) hover:text-(--white)");

  const btn2 =
    `${baseBtn} px-3 sm:px-6 py-2 text-sm sm:text-base flex items-center justify-center gap-2 ` +
    (selected === option2
      ? "bg-(--white-10) text-(--white)"
      : "text-(--text-light) hover:text-(--white)");

  return (
    <div
      role="tablist"
      aria-label="Toggle"
      onKeyDown={onKeyDown}
      className="w-full sm:w-fit bg-(--white-5) border border-(--white-10) p-1 rounded-xl select-none flex"
    >
      {/* Markdown view button */}
      <button
        type="button"
        role="tab"
        aria-selected={selected === option1}
        aria-pressed={selected === option1}
        className={`flex-1 sm:flex-none ${btn1}`}
        onClick={toggle}
      >
        {/* Icon on mobile */}
        <FaMarkdown className="inline sm:hidden text-lg" />
        {/* Text on larger screens */}
        <span className="hidden sm:inline">{option1}</span>
      </button>

      {/* Preview view button */}
      <button
        type="button"
        role="tab"
        aria-selected={selected === option2}
        aria-pressed={selected === option2}
        className={`flex-1 sm:flex-none ${btn2}`}
        onClick={toggle}
      >
        {/* Icon on mobile */}
        <FaEye className="inline sm:hidden text-lg" />
        {/* Text on larger screens */}
        <span className="hidden sm:inline">{option2}</span>
      </button>
    </div>
  );
};

export default Toggle;
