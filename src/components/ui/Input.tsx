import { forwardRef } from "react";
import { cn } from "@/lib/utils";

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

const inputBase =
  "flex w-full h-12 rounded-full px-5 text-base border border-neutral-200 bg-white text-ink placeholder:text-ink/40 " +
  "transition-[border-color,box-shadow] duration-200 " +
  "focus:border-brand focus:ring-2 focus:ring-brand/20 focus:outline-none " +
  "disabled:cursor-not-allowed disabled:opacity-50";

const textareaBase =
  "flex w-full rounded-3xl px-5 py-4 min-h-[120px] text-base border border-neutral-200 bg-white text-ink placeholder:text-ink/40 " +
  "transition-[border-color,box-shadow] duration-200 resize-y " +
  "focus:border-brand focus:ring-2 focus:ring-brand/20 focus:outline-none " +
  "disabled:cursor-not-allowed disabled:opacity-50";

const labelBase = "block text-sm font-semibold text-ink mb-2";
const errorBase = "border-brand focus:border-brand focus:ring-brand/30";
const errorText = "text-xs font-medium text-brand mt-1";

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, error, id, ...props }, ref) => {
    return (
      <div>
        {label && (
          <label htmlFor={id} className={labelBase}>
            {label}
          </label>
        )}
        <input
          id={id}
          className={cn(inputBase, error && errorBase, className)}
          ref={ref}
          {...props}
        />
        {error && <p className={errorText}>{error}</p>}
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
      <div>
        {label && (
          <label htmlFor={id} className={labelBase}>
            {label}
          </label>
        )}
        <textarea
          id={id}
          className={cn(textareaBase, error && errorBase, className)}
          ref={ref}
          {...props}
        />
        {error && <p className={errorText}>{error}</p>}
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
      <div>
        {label && (
          <label htmlFor={id} className={labelBase}>
            {label}
          </label>
        )}
        <select
          id={id}
          ref={ref}
          className={cn(
            inputBase,
            "appearance-none bg-[url('data:image/svg+xml;utf8,<svg xmlns=%22http://www.w3.org/2000/svg%22 width=%2212%22 height=%2212%22 viewBox=%220 0 12 12%22><path fill=%22none%22 stroke=%22%230A0A0A%22 stroke-width=%221.25%22 d=%22M2.5 4.5l3.5 3 3.5-3%22/></svg>')] bg-no-repeat bg-[right_1.1rem_center] pr-11",
            error && errorBase,
            className
          )}
          {...props}
        >
          {children}
        </select>
        {error && <p className={errorText}>{error}</p>}
      </div>
    );
  }
);
Select.displayName = "Select";

export { Input, Textarea, Select };
