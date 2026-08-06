import "./Logo.scss";

/**
 * props:
 * - variant: "navy" (para fondos claros) | "white" (para fondos oscuros, ej: footer)
 * - size: "sm" | "md" | "lg"
 */
export function Logo({ variant = "navy", size = "md" }) {
  return (
    <div className={`tc-logo tc-logo--${variant} tc-logo--${size}`}>
      <span className="tc-logo__mark" aria-hidden="true">
        {"</>"}
      </span>
      <span className="tc-logo__text">
        Tin<strong>Code</strong>
      </span>
    </div>
  );
}
