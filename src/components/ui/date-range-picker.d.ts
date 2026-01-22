import React from 'react';

interface DateRange {
  from?: Date;
  to?: Date;
}

interface DatePickerWithRangeProps {
  from?: Date;
  to?: Date;
  onSelect: (range: DateRange | undefined) => void;
  placeholder?: string;
  className?: string;
}

export declare const DatePickerWithRange: React.FC<DatePickerWithRangeProps>;