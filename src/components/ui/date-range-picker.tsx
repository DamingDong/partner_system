import React from 'react';
import { Button } from './button';
import { Input } from './input';
import { Popover, PopoverContent, PopoverTrigger } from './popover';
import { Calendar, CalendarDays } from 'lucide-react';
import { cn } from '../../lib/utils';
import { formatDateTime } from '../../lib/utils';

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

export const DatePickerWithRange: React.FC<DatePickerWithRangeProps> = ({
  from,
  to,
  onSelect,
  placeholder = '选择日期范围',
  className
}) => {
  const [isOpen, setIsOpen] = React.useState(false);
  const [localFrom, setLocalFrom] = React.useState<string>(
    from ? formatDateTime(from, 'date') : ''
  );
  const [localTo, setLocalTo] = React.useState<string>(
    to ? formatDateTime(to, 'date') : ''
  );

  const handleApply = () => {
    const fromDate = localFrom ? new Date(localFrom) : undefined;
    const toDate = localTo ? new Date(localTo) : undefined;
    
    // 验证日期有效性
    if (fromDate && isNaN(fromDate.getTime())) {
      return;
    }
    if (toDate && isNaN(toDate.getTime())) {
      return;
    }
    
    // 确保开始日期不晚于结束日期
    if (fromDate && toDate && fromDate > toDate) {
      return;
    }
    
    onSelect({ from: fromDate, to: toDate });
    setIsOpen(false);
  };

  const handleClear = () => {
    setLocalFrom('');
    setLocalTo('');
    onSelect(undefined);
    setIsOpen(false);
  };

  const getDisplayText = () => {
    if (from && to) {
      return `${formatDateTime(from, 'date')} - ${formatDateTime(to, 'date')}`;
    } else if (from) {
      return `从 ${formatDateTime(from, 'date')}`;
    } else if (to) {
      return `至 ${formatDateTime(to, 'date')}`;
    }
    return placeholder;
  };

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className={cn(
            'w-full justify-start text-left font-normal',
            !from && !to && 'text-muted-foreground',
            className
          )}
        >
          <CalendarDays className="mr-2 h-4 w-4" />
          {getDisplayText()}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80" align="start">
        <div className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">开始日期</label>
            <Input
              type="date"
              value={localFrom}
              onChange={(e) => setLocalFrom(e.target.value)}
              placeholder="选择开始日期"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">结束日期</label>
            <Input
              type="date"
              value={localTo}
              onChange={(e) => setLocalTo(e.target.value)}
              placeholder="选择结束日期"
            />
          </div>
          <div className="flex justify-between">
            <Button variant="outline" size="sm" onClick={handleClear}>
              清空
            </Button>
            <Button size="sm" onClick={handleApply}>
              确定
            </Button>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
};

export type { DateRange, DatePickerWithRangeProps };
