import React from 'react';

interface ComparisonRow {
  method: string;
  dataset: string;
  performance: string;
  year: string;
}

interface ComparisonTableProps {
  data: ComparisonRow[];
}

export function ComparisonTable({ data }: ComparisonTableProps) {
  return (
    <div className="my-8 bg-gray-50 dark:bg-navy-800 rounded-lg overflow-hidden border border-gray-200 dark:border-navy-700">
      <div className="text-lg font-semibold text-gray-900 dark:text-gray-100 p-4 border-b border-gray-200 dark:border-navy-700 bg-white dark:bg-navy-900">
        Comparison Table
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-navy-700">
          <thead>
            <tr className="bg-gray-50 dark:bg-navy-900">
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900 dark:text-gray-100">Method</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900 dark:text-gray-100">Dataset</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900 dark:text-gray-100">Performance</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900 dark:text-gray-100">Year</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 dark:divide-navy-700 bg-white dark:bg-navy-800">
            {data.map((row, index) => (
              <tr 
                key={index} 
                className="hover:bg-gray-50 dark:hover:bg-navy-700 transition-colors"
              >
                <td className="px-6 py-4 text-sm text-gray-700 dark:text-gray-300 border-r border-gray-200 dark:border-navy-700">
                  <div className="font-medium">{row.method}</div>
                </td>
                <td className="px-6 py-4 text-sm text-gray-700 dark:text-gray-300 border-r border-gray-200 dark:border-navy-700">
                  {row.dataset}
                </td>
                <td className="px-6 py-4 text-sm text-gray-700 dark:text-gray-300 border-r border-gray-200 dark:border-navy-700">
                  <div className="font-mono">{row.performance}</div>
                </td>
                <td className="px-6 py-4 text-sm text-gray-700 dark:text-gray-300">
                  {row.year}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
} 