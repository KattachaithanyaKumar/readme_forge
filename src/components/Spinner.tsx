import React from "react";

interface SpinnerProps {
  size?: number; // pixel size
  color?: string; // hex or tailwind var
  thickness?: number; // border width
}

const Spinner: React.FC<SpinnerProps> = ({
  size = 20,
  color = "#fff",
  thickness = 3,
}) => {
  return (
    <span
      role="status"
      aria-label="Loading"
      style={{
        width: size,
        height: size,
        borderWidth: thickness,
        borderTopColor: "transparent",
        borderRightColor: color,
        borderBottomColor: color,
        borderLeftColor: color,
      }}
      className="inline-block rounded-full animate-spin"
    />
  );
};

export default Spinner;
