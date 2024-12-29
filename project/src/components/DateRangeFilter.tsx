import React, { useState } from 'react';
import { Popover } from '@headlessui/react';
import { CalendarIcon, XMarkIcon } from '@heroicons/react/24/outline';
import { format } from 'date-fns';

interface DateRange {
  startDate: Date | null;
  endDate: Date | null;
}

interface DateRangeFilterProps {
  onChange: (range: DateRange) => void;
  onClear: () => void;
  startDate: Date | null;
  endDate: Date | null;
}

const presetRanges = [
  { label: 'Last 7 days', days: 7 },
  { label: 'Last 30 days', days: 30 },
  { label: 'Last 90 days', days: 90 },
  { label: 'Last year', days: 365 },
];

export const DateRangeFilter: React.FC<DateRangeFilterProps> = ({
  onChange,
  onClear,
  startDate,
  endDate,
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const handlePresetClick = (days: number) => {
    const end = new Date();
    const start = new Date();
    start.setDate(end.getDate() - days);
    onChange({ startDate: start, endDate: end });
    setIsOpen(false);
  };

  const handleDateChange = (type: 'start' | 'end', date: string) => {
    const newDate = date ? new Date(date) : null;
    if (type === 'start') {
      onChange({ startDate: newDate, endDate });
    } else {
      onChange({ startDate, endDate: newDate });
    }
  };

  const formatDateForInput = (date: Date | null) => {
    return date ? format(date, 'yyyy-MM-dd') : '';
  };

  const hasActiveFilter = startDate || endDate;

  return (
    <div className="relative inline-block">
      <Popover>
        {({ open }) => (
          <>
            <div className="flex items-center space-x-2">
              <Popover.Button
                className={`inline-flex items-center px-3 py-2 border rounded-lg text-sm font-medium 
                  ${hasActiveFilter 
                    ? 'border-primary-500 text-primary-700 bg-primary-50 hover:bg-primary-100'
                    : 'border-gray-300 text-gray-700 bg-white hover:bg-gray-50'
                  } 
                  dark:bg-navy-800 dark:border-navy-600 dark:text-white
                  focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500`}
              >
                <CalendarIcon className="h-5 w-5 mr-2" />
                {hasActiveFilter ? (
                  <span>
                    {formatDateForInput(startDate)} - {formatDateForInput(endDate)}
                  </span>
                ) : (
                  'Filter by date'
                )}
              </Popover.Button>
              {hasActiveFilter && (
                <button
                  onClick={onClear}
                  className="p-1 rounded-full hover:bg-gray-200 dark:hover:bg-navy-700"
                  title="Clear date filter"
                >
                  <XMarkIcon className="h-5 w-5 text-gray-500 dark:text-gray-400" />
                </button>
              )}
            </div>

            <Popover.Panel
              className="absolute z-10 mt-2 bg-white dark:bg-navy-800 rounded-lg shadow-lg p-4 w-72"
            >
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Start Date
                    </label>
                    <input
                      type="date"
                      value={formatDateForInput(startDate)}
                      onChange={(e) => handleDateChange('start', e.target.value)}
                      className="w-full px-3 py-2 border rounded-md dark:bg-navy-900 dark:border-navy-600 dark:text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      End Date
                    </label>
                    <input
                      type="date"
                      value={formatDateForInput(endDate)}
                      onChange={(e) => handleDateChange('end', e.target.value)}
                      className="w-full px-3 py-2 border rounded-md dark:bg-navy-900 dark:border-navy-600 dark:text-white"
                    />
                  </div>
                </div>

                <div className="border-t dark:border-navy-600 pt-4">
                  <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Quick select
                  </h3>
                  <div className="grid grid-cols-2 gap-2">
                    {presetRanges.map((range) => (
                      <button
                        key={range.days}
                        onClick={() => handlePresetClick(range.days)}
                        className="px-3 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-navy-700 rounded-md transition-colors"
                      >
                        {range.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </Popover.Panel>
          </>
        )}
      </Popover>
    </div>
  );
};
