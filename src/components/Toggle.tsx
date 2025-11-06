import { useState, type KeyboardEvent } from "react";

interface ToggleProps {
  option1: string;
  option2: string;
  onToggle?: (selected: string) => void;
}

const Toggle = ({ option1, option2, onToggle }: ToggleProps) => {
  const [selected, setSelected] = useState(option1);

  const select = (value: string) => {
    if (value === selected) return;
    setSelected(value);
    onToggle?.(value);
  };

  const onKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    if (e.key === "ArrowRight" || e.key === "ArrowLeft") {
      e.preventDefault();
      select(selected === option1 ? option2 : option1);
    }
  };

  const baseBtn =
    "rounded-lg transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-(--accent)";

  const btn1 =
    `${baseBtn} px-4 sm:px-6 py-2 text-sm sm:text-base ` +
    (selected === option1
      ? "bg-(--white-10) text-(--white)"
      : "text-(--text-light) hover:text-(--white)");

  const btn2 =
    `${baseBtn} px-4 sm:px-6 py-2 text-sm sm:text-base ` +
    (selected === option2
      ? "bg-(--white-10) text-(--white)"
      : "text-(--text-light) hover:text-(--white)");

  return (
    <div
      role="tablist"
      aria-label="Toggle"
      onKeyDown={onKeyDown}
      className="
        w-full sm:w-fit
        bg-(--white-5) border border-(--white-10) p-1 rounded-xl
        select-none
        flex
      "
    >
      {/* Make each button flex-1 on mobile so the control fills width */}
      <button
        type="button"
        role="tab"
        aria-selected={selected === option1}
        aria-pressed={selected === option1}
        className={`flex-1 sm:flex-none ${btn1}`}
        onClick={() => select(option1)}
      >
        {option1}
      </button>

      <button
        type="button"
        role="tab"
        aria-selected={selected === option2}
        aria-pressed={selected === option2}
        className={`flex-1 sm:flex-none ${btn2}`}
        onClick={() => select(option2)}
      >
        {option2}
      </button>
    </div>
  );
};

export default Toggle;
