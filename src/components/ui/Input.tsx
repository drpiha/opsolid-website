import { forwardRef } from "react";
import { cn } from "@/lib/utils";

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

const fieldBase =
  "flex w-full border border-ink/15 bg-paper-warm px-4 text-sm text-ink placeholder:text-ink/35 " +
  "transition-[border-color,box-shadow] duration-200 rounded-md " +
  "focus:border-ink focus:outline-none focus:ring-2 focus:ring-amber/50 " +
  "disabled:cursor-not-allowed disabled:opacity-50";

const labelBase = "mono-label block text-ink/80";
const errorBase = "border-amber-600 focus:border-amber-700 focus:ring-amber/40";

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, error, id, ...props }, ref) => {
    return (
      <div className="space-y-2">
        {label && (
          <label htmlFor={id} className={labelBase}>
            {label}
          </label>
        )}
        <input
          id={id}
          className={cn(fieldBase, "h-11 py-2", error && errorBase, className)}
          ref={ref}
          {...props}
        />
        {error && <p className="mono-label text-amber-700">{error}</p>}
      </div>
    );
  }
);
Input.displayName = "Input";

export interface TextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
}

const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, label, error, id, ...props }, ref) => {
    return (
      <div className="space-y-2">
        {label && (
          <label htmlFor={id} className={labelBase}>
            {label}
          </label>
        )}
        <textarea
          id={id}
          className={cn(
            fieldBase,
            "min-h-[120px] py-3 resize-y",
            error && errorBase,
            className
          )}
          ref={ref}
          {...props}
        />
        {error && <p className="mono-label text-amber-700">{error}</p>}
      </div>
    );
  }
);
Textarea.displayName = "Textarea";

export interface SelectFieldProps
  extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
}

const Select = forwardRef<HTMLSelectElement, SelectFieldProps>(
  ({ className, label, error, id, children, ...props }, ref) => {
    return (
      <div className="space-y-2">
        {label && (
          <label htmlFor={id} className={labelBase}>
            {label}
          </label>
        )}
        <select
          id={id}
          ref={ref}
          className={cn(
            fieldBase,
            "h-11 py-2 appearance-none bg-[url('data:image/svg+xml;utf8,<svg xmlns=%22http://www.w3.org/2000/svg%22 width=%2212%22 height=%2212%22 viewBox=%220 0 12 12%22><path fill=%22none%22 stroke=%22%2315120F%22 stroke-width=%221.25%22 d=%22M2.5 4.5l3.5 3 3.5-3%22/></svg>')] bg-no-repeat bg-[right_0.9rem_center] pr-10",
            error && errorBase,
            className
          )}
          {...props}
        >
          {children}
        </select>
        {error && <p className="mono-label text-amber-700">{error}</p>}
      </div>
    );
  }
);
Select.displayName = "Select";

export { Input, Textarea, Select };
