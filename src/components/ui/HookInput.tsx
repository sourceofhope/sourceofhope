import { InputHTMLAttributes, forwardRef, useId } from 'react';
import { FieldError, FieldErrorsImpl, FieldValues, Merge } from 'react-hook-form';

type ErrorType = FieldError | Merge<FieldError, FieldErrorsImpl<FieldValues>> | undefined;

interface HookInputProps extends InputHTMLAttributes<HTMLInputElement> {
  title: string;
  error?: ErrorType;
  border?: boolean;
}

const HookInput = forwardRef<HTMLInputElement, HookInputProps>(
  ({ title, error, border = true, className = '', id, ...props }, ref) => {
    const borderClass = border ? 'border-b-2 border-neutral-300' : '';
    const errorMessage = error && 'message' in error ? (error as FieldError).message : null;
    const generatedId = useId();
    const inputId = id ?? generatedId;
    const errorId = `${inputId}-error`;

    return (
      <div>
        <label
          htmlFor={inputId}
          className="text-sm md:text-md px-1 font-semibold select-none text-neutral-950 block">
          {title}
        </label>
        <input
          ref={ref}
          id={inputId}
          aria-invalid={errorMessage ? true : undefined}
          aria-describedby={errorMessage ? errorId : undefined}
          className={`w-full rounded-xl bg-neutral-50 px-4 py-3 text-sm md:text-md text-neutral-800 border border-neutral-200 ${borderClass} mb-3 ${className}`}
          {...props}
        />
        {errorMessage && (
          <p id={errorId} className="text-red-600 text-xs mt-1">{errorMessage}</p>
        )}
      </div>
    );
  }
);

HookInput.displayName = 'HookInput';

export default HookInput;
