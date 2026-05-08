import { CheckCircle, XCircle, X } from "lucide-react";

type AlertType = "success" | "error";

interface AlertProps {
  type: AlertType;
  message: string;
  onClose?: () => void;
}

const Alert = ({ type, message, onClose }: AlertProps) => {
  const isSuccess = type === "success";

  return (
    <div className={`alert alert-${type}`} role="alert">
      <span className="alert-icon">
        {isSuccess ? <CheckCircle size={18} /> : <XCircle size={18} />}
      </span>
      <p className="alert-message">{message}</p>
      {onClose && (
        <button
          type="button"
          className="alert-close"
          onClick={onClose}
          aria-label="Tutup notifikasi"
        >
          <X size={16} />
        </button>
      )}
    </div>
  );
};

export default Alert;
