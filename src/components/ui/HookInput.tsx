import { InputHTMLAttributes, forwardRef } from 'react';
import { FieldError, FieldErrorsImpl, Merge } from 'react-hook-form';

type ErrorType = FieldError | Merge<FieldError, FieldErrorsImpl<any>> | undefined;

interface HookInputProps extends InputHTMLAttributes<HTMLInputElement> {
  title: string;
  error?: ErrorType;
  border?: boolean;
}

const HookInput = forwardRef<HTMLInputElement, HookInputProps>(
  ({ title, error, border = true, className = '', ...props }, ref) => {
    const borderClass = border ? 'border-b-2 border-neutral-300' : '';
    const errorMessage = error && 'message' in error ? (error as FieldError).message : null;
    
    return (
      <div>
        <label className="text-sm md:text-md px-1 font-semibold select-none text-neutral-950 block">
          {title}
        </label>
        <input
          ref={ref}
          className={`w-full rounded-xl bg-neutral-50 px-4 py-3 text-sm md:text-md text-neutral-800 border border-neutral-200 ${borderClass} mb-3 ${className}`}
          {...props}
        />
        {errorMessage && (
          <p className="text-red-600 text-xs mt-1">{errorMessage}</p>
        )}
      </div>
    );
  }
);

HookInput.displayName = 'HookInput';

export default HookInput;
