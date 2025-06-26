import React from "react";
import ReactDatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import "./datepicker-visual.css";

export interface DatePickerVisualProps {
  value: Date | null;
  onChange: (date: Date | null) => void;
  showTimeSelect?: boolean;
  dateFormat?: string;
  placeholder?: string;
  minDate?: Date;
  maxDate?: Date;
  id?: string;
}

export const DatePickerVisual: React.FC<DatePickerVisualProps> = ({
  value,
  onChange,
  showTimeSelect = false,
  dateFormat = showTimeSelect ? "dd/MM/yyyy HH:mm" : "dd/MM/yyyy",
  placeholder,
  minDate,
  maxDate,
  id,
}) => (
  <ReactDatePicker
    id={id}
    selected={value}
    onChange={onChange}
    showTimeSelect={showTimeSelect}
    timeFormat="HH:mm"
    timeIntervals={15}
    dateFormat={dateFormat}
    placeholderText={placeholder}
    minDate={minDate}
    maxDate={maxDate}
    className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-base shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
    autoFocus={false}
    onFocus={e => e.target.blur()}
  />
);
