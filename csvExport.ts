import { BudgetItem } from './budgetService';

export const exportToCSV = (items: BudgetItem[], totalBudget: number): void => {
  // Prepare the CSV data
  const headers = ['Category', 'Item', 'Recipient', 'Estimated Cost', 'Actual Cost'];
  
  const rows = items.map(item => [
    item.category,
    item.item,
    item.recipient || '',
    item.estimated_cost.toFixed(2),
    item.actual_cost ? item.actual_cost.toFixed(2) : ''
  ]);

  // Add summary rows
  const totalEstimated = items.reduce((sum, item) => sum + item.estimated_cost, 0);
  const totalActual = items.reduce((sum, item) => sum + (item.actual_cost || 0), 0);

  rows.push([]);  // Empty row for spacing
  rows.push(['Summary']);
  rows.push(['Total Budget', totalBudget.toFixed(2)]);
  rows.push(['Total Estimated', totalEstimated.toFixed(2)]);
  rows.push(['Total Spent', totalActual.toFixed(2)]);
  rows.push(['Remaining Budget', (totalBudget - totalActual).toFixed(2)]);

  // Convert to CSV string
  const csvContent = [
    headers.join(','),
    ...rows.map(row => row.map(cell => `"${cell}"`).join(','))
  ].join('\n');

  // Create and trigger download
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  
  link.setAttribute('href', url);
  link.setAttribute('download', `christmas_budget_${new Date().toISOString().split('T')[0]}.csv`);
  link.style.visibility = 'hidden';
  
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};