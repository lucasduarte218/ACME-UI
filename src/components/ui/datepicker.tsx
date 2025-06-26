import * as React from "react";
import { cn } from "@/lib/utils";

export interface DatePickerProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  mode?: 'date' | 'datetime';
}

export const DatePicker = React.forwardRef<HTMLInputElement, DatePickerProps>(
  ({ className, label, mode = 'datetime', value, onChange, ...props }, ref) => (
    <div className="flex flex-col gap-1 w-full">
      {label && <label className="text-sm font-medium text-gray-700 mb-1">{label}</label>}
      <input
        type={mode === 'date' ? 'date' : 'datetime-local'}
        ref={ref}
        className={cn(
          "flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-base shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
          className
        )}
        value={value}
        onChange={onChange}
        {...props}
      />
    </div>
  )
);
DatePicker.displayName = "DatePicker";
