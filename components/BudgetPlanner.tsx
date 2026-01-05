import React, { useState, useEffect } from 'react';
import { Wallet, Plus, Trash2, AlertCircle, Download, Info, DollarSign, User } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { budgetService, BudgetItem } from '../lib/budgetService';
import { useDebounce } from '../hooks/useDebounce';
import { exportToCSV } from '../lib/csvExport';
import SaveIndicator from './SaveIndicator';

const BudgetPlanner: React.FC = () => {
  const [items, setItems] = useState<BudgetItem[]>([]);
  const [totalBudget, setTotalBudget] = useState(0);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showGuide, setShowGuide] = useState(true);
  const { user } = useAuth();

  // Load budget data when user signs in
  useEffect(() => {
    const loadBudgetData = async () => {
      if (!user) {
        setItems([]);
        setTotalBudget(0);
        setLoading(false);
        return;
      }
      
      setLoading(true);
      try {
        const { data } = await budgetService.loadBudget(user);
        setItems(data.items);
        setTotalBudget(data.totalBudget);
        setError('');
      } catch (err) {
        console.error('Failed to load budget:', err);
        setError('Failed to load budget data.');
      } finally {
        setLoading(false);
      }
    };

    loadBudgetData();
  }, [user]);

  // Debounced save function
  const debouncedSave = useDebounce(async () => {
    if (!user) return;

    setSaving(true);
    try {
      await budgetService.saveBudget(user, {
        totalBudget,
        items,
        lastUpdated: new Date().toISOString()
      });
      setError('');
    } catch (err) {
      console.error('Save error:', err);
      setError('Failed to save budget data.');
    } finally {
      setSaving(false);
    }
  }, 1000);

  // Auto-save when data changes
  useEffect(() => {
    if (user && !loading) {
      debouncedSave();
    }
  }, [items, totalBudget, user, loading]);

  const handleAddItem = () => {
    const newItem: BudgetItem = {
      id: crypto.randomUUID(),
      category: '',
      item: '',
      recipient: '',
      estimated_cost: 0,
      created_at: new Date().toISOString()
    };
    setItems([...items, newItem]);
  };

  const handleUpdateItem = (id: string, updates: Partial<BudgetItem>) => {
    setItems(items.map(item => 
      item.id === id ? { ...item, ...updates } : item
    ));
  };

  const handleRemoveItem = (id: string) => {
    setItems(items.filter(item => item.id !== id));
  };

  const handleExport = () => {
    exportToCSV(items, totalBudget);
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto p-4 sm:p-6 bg-white rounded-xl shadow-lg">
        <div className="text-center text-gray-600">
          Loading budget data...
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-4 sm:p-6 bg-white rounded-xl shadow-lg">
      <div className="mb-6 sm:mb-8">
        <div className="flex justify-between items-start mb-4">
          <h2 className="text-xl sm:text-2xl font-bold text-gray-800 flex items-center gap-2">
            <Wallet className="w-5 h-5 sm:w-6 sm:h-6 text-emerald-600" />
            Christmas Budget Planner
          </h2>
          <button
            onClick={handleExport}
            className="flex items-center gap-2 px-3 py-2 text-sm bg-emerald-100 text-emerald-700 rounded-md hover:bg-emerald-200 transition-colors"
          >
            <Download className="w-4 h-4" />
            Export CSV
          </button>
        </div>
        
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Total Christmas Budget
          </label>
          <div className="flex items-center gap-2 max-w-[200px]">
            <span className="text-gray-500">$</span>
            <input
              type="number"
              value={totalBudget || ''}
              onChange={(e) => setTotalBudget(parseFloat(e.target.value) || 0)}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
              placeholder="0.00"
              min="0"
              step="0.01"
            />
          </div>
          <div className="mt-1">
            <SaveIndicator saving={saving} />
          </div>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-50 text-red-700 rounded-md flex items-center gap-2">
            <AlertCircle className="w-5 h-5" />
            {error}
          </div>
        )}
      </div>

      {showGuide && (
        <div className="mb-6 p-4 bg-emerald-50 rounded-lg border border-emerald-200">
          <div className="flex justify-between items-start">
            <div className="flex gap-2">
              <Info className="w-5 h-5 text-emerald-600 mt-0.5" />
              <div>
                <h3 className="font-medium text-emerald-800 mb-1">Quick Guide</h3>
                <ol className="list-decimal list-inside text-sm text-emerald-700 space-y-1">
                  <li>Set your total Christmas budget above</li>
                  <li>Add items using the form below</li>
                  <li>Track actual costs as you make purchases</li>
                  <li>Monitor your spending with the summary cards</li>
                </ol>
              </div>
            </div>
            <button
              onClick={() => setShowGuide(false)}
              className="text-emerald-600 hover:text-emerald-700 text-sm"
            >
              Dismiss
            </button>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div className="p-4 bg-emerald-50 rounded-lg">
          <h3 className="font-semibold text-emerald-800 mb-2">Total Planned</h3>
          <p className="text-2xl font-bold text-emerald-600">
            ${items.reduce((sum, item) => sum + item.estimated_cost, 0).toFixed(2)}
          </p>
          <p className="text-sm text-emerald-700">
            of ${totalBudget.toFixed(2)} budget
          </p>
        </div>
        <div className="p-4 bg-blue-50 rounded-lg">
          <h3 className="font-semibold text-blue-800 mb-2">Actual Spent</h3>
          <p className="text-2xl font-bold text-blue-600">
            ${items.reduce((sum, item) => sum + (item.actual_cost || 0), 0).toFixed(2)}
          </p>
        </div>
        <div className="p-4 bg-purple-50 rounded-lg">
          <h3 className="font-semibold text-purple-800 mb-2">Remaining Budget</h3>
          <p className="text-2xl font-bold text-purple-600">
            ${(totalBudget - items.reduce((sum, item) => sum + (item.actual_cost || 0), 0)).toFixed(2)}
          </p>
        </div>
      </div>

      <div className="space-y-4">
        {items.map((item) => (
          <div key={item.id} className="p-4 bg-gray-50 rounded-lg">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Category
                </label>
                <input
                  type="text"
                  value={item.category}
                  onChange={(e) => handleUpdateItem(item.id, { category: e.target.value })}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                  placeholder="e.g., Gifts, Food"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Item
                </label>
                <input
                  type="text"
                  value={item.item}
                  onChange={(e) => handleUpdateItem(item.id, { item: e.target.value })}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                  placeholder="Item description"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-1">
                  <User className="w-4 h-4" />
                  Recipient
                </label>
                <input
                  type="text"
                  value={item.recipient}
                  onChange={(e) => handleUpdateItem(item.id, { recipient: e.target.value })}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                  placeholder="Who is this for?"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Estimated Cost
                </label>
                <div className="flex items-center gap-2">
                  <span className="text-gray-500">$</span>
                  <input
                    type="number"
                    value={item.estimated_cost || ''}
                    onChange={(e) => handleUpdateItem(item.id, { estimated_cost: parseFloat(e.target.value) || 0 })}
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                    placeholder="0.00"
                    min="0"
                    step="0.01"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Actual Cost
                </label>
                <div className="flex items-center gap-2">
                  <span className="text-gray-500">$</span>
                  <input
                    type="number"
                    value={item.actual_cost || ''}
                    onChange={(e) => handleUpdateItem(item.id, { actual_cost: parseFloat(e.target.value) || 0 })}
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                    placeholder="0.00"
                    min="0"
                    step="0.01"
                  />
                </div>
              </div>
            </div>
            <div className="mt-2 flex justify-end">
              <button
                onClick={() => handleRemoveItem(item.id)}
                className="text-red-600 hover:text-red-700 transition-colors"
              >
                <Trash2 className="w-5 h-5" />
              </button>
            </div>
          </div>
        ))}

        <button
          onClick={handleAddItem}
          className="w-full py-3 border-2 border-dashed border-emerald-300 rounded-lg text-emerald-600 hover:border-emerald-400 hover:text-emerald-700 transition-colors flex items-center justify-center gap-2"
        >
          <Plus className="w-5 h-5" />
          Add Budget Item
        </button>
      </div>
    </div>
  );
};

export default BudgetPlanner;