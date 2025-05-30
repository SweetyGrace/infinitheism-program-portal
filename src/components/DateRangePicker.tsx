
import React from 'react';
import { Calendar } from '@/components/ui/calendar';
import { Label } from '@/components/ui/label';
import { DateRange } from 'react-day-picker';
import { differenceInDays, format } from 'date-fns';

interface DateRangePickerProps {
  value: DateRange | undefined;
  onChange: (range: DateRange | undefined) => void;
  label: string;
  minDate?: Date;
  maxDate?: Date;
  disabled?: boolean;
}

export const DateRangePicker = ({ 
  value, 
  onChange, 
  label, 
  minDate, 
  maxDate, 
  disabled 
}: DateRangePickerProps) => {
  const dayCount = value?.from && value?.to 
    ? differenceInDays(value.to, value.from) + 1 
    : 0;

  return (
    <div className="space-y-3">
      <Label className="text-sm font-medium text-gray-700">{label}</Label>
      <div className="border border-gray-200 rounded-lg p-3 bg-white">
        <Calendar
          mode="range"
          selected={value}
          onSelect={onChange}
          disabled={disabled ? (date) => date < new Date() || (minDate && date < minDate) || (maxDate && date > maxDate) : undefined}
          className="rounded-md pointer-events-auto"
          numberOfMonths={2}
        />
        {value?.from && value?.to && (
          <div className="mt-3 p-3 bg-blue-50 rounded-md border-t">
            <div className="text-sm text-gray-600">
              <div className="flex justify-between items-center">
                <span>Start: {format(value.from, 'PPP')}</span>
                <span>End: {format(value.to, 'PPP')}</span>
              </div>
              <div className="text-center mt-2 font-medium text-blue-700">
                Duration: {dayCount} {dayCount === 1 ? 'day' : 'days'}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
