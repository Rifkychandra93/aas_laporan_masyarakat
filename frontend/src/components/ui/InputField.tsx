import { type InputHTMLAttributes, useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import type { LucideIcon } from "lucide-react";

interface InputFieldProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  icon?: LucideIcon;
  error?: string;
  id: string;
}

const InputField = ({
  label,
  icon: Icon,
  error,
  id,
  type = "text",
  ...props
}: InputFieldProps) => {
  const [showPassword, setShowPassword] = useState(false);

  const isPassword = type === "password";
  const inputType = isPassword ? (showPassword ? "text" : "password") : type;

  return (
    <div className="input-field-wrapper">
      <label htmlFor={id} className="input-label">
        {label}
      </label>
      <div className={`input-container ${error ? "input-error" : ""}`}>
        {Icon && (
          <span className="input-icon">
            <Icon size={18} />
          </span>
        )}
        <input
          id={id}
          type={inputType}
          className="input-element"
          {...props}
        />
        {isPassword && (
          <button
            type="button"
            className="input-password-toggle"
            onClick={() => setShowPassword((prev) => !prev)}
            aria-label={showPassword ? "Hide password" : "Show password"}
          >
            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        )}
      </div>
      {error && <p className="input-error-message">{error}</p>}
    </div>
  );
};

export default InputField;
