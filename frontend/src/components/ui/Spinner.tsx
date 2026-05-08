interface SpinnerProps {
  size?: "sm" | "md" | "lg";
  text?: string;
}

const Spinner = ({ size = "md", text }: SpinnerProps) => {
  const sizeClass = {
    sm: "spinner-sm",
    md: "spinner-md",
    lg: "spinner-lg",
  }[size];

  return (
    <div className="spinner-wrapper">
      <div className={`spinner ${sizeClass}`} role="status" aria-label="Loading" />
      {text && <span className="spinner-text">{text}</span>}
    </div>
  );
};

export default Spinner;
