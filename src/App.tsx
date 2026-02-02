import { useState, useEffect } from 'react';
import './App.css';

interface Expense {
  id: string;
  description: string;
  amount: number;
  category: string;
  date: string;
}

const categories = [
  { name: 'Food & Dining', icon: '◆', color: '#D4AF37' },
  { name: 'Transport', icon: '▲', color: '#C0C0C0' },
  { name: 'Shopping', icon: '■', color: '#B76E79' },
  { name: 'Entertainment', icon: '●', color: '#7B8D8E' },
  { name: 'Bills & Utilities', icon: '◈', color: '#8B7355' },
  { name: 'Other', icon: '○', color: '#A9A9A9' },
];

const initialExpenses: Expense[] = [
  { id: '1', description: 'Dinner at Nobu', amount: 245.00, category: 'Food & Dining', date: '2024-01-15' },
  { id: '2', description: 'Uber Premium', amount: 67.50, category: 'Transport', date: '2024-01-14' },
  { id: '3', description: 'Electric Bill', amount: 142.30, category: 'Bills & Utilities', date: '2024-01-13' },
  { id: '4', description: 'Vintage Watch', amount: 1250.00, category: 'Shopping', date: '2024-01-12' },
  { id: '5', description: 'Opera Tickets', amount: 380.00, category: 'Entertainment', date: '2024-01-10' },
];

function App() {
  const [expenses, setExpenses] = useState<Expense[]>(initialExpenses);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [newExpense, setNewExpense] = useState({ description: '', amount: '', category: 'Food & Dining' });
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const totalSpent = expenses.reduce((sum, exp) => sum + exp.amount, 0);
  const categoryTotals = categories.map(cat => ({
    ...cat,
    total: expenses.filter(e => e.category === cat.name).reduce((sum, e) => sum + e.amount, 0)
  }));
  const maxCategoryTotal = Math.max(...categoryTotals.map(c => c.total));

  const addExpense = () => {
    if (!newExpense.description || !newExpense.amount) return;
    const expense: Expense = {
      id: Date.now().toString(),
      description: newExpense.description,
      amount: parseFloat(newExpense.amount),
      category: newExpense.category,
      date: new Date().toISOString().split('T')[0],
    };
    setExpenses([expense, ...expenses]);
    setNewExpense({ description: '', amount: '', category: 'Food & Dining' });
    setIsFormOpen(false);
  };

  const deleteExpense = (id: string) => {
    setExpenses(expenses.filter(e => e.id !== id));
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount);
  };

  const getCategoryData = (categoryName: string) => {
    return categories.find(c => c.name === categoryName) || categories[5];
  };

  return (
    <div className="app">
      <div className="noise-overlay"></div>

      <header className={`header ${mounted ? 'mounted' : ''}`}>
        <div className="header-accent"></div>
        <div className="header-content">
          <div className="brand">
            <span className="brand-mark">◇</span>
            <div className="brand-text">
              <h1>LEDGER</h1>
              <span className="brand-sub">Personal Finance</span>
            </div>
          </div>
          <div className="header-stats">
            <span className="stat-label">Total Expenditure</span>
            <span className="stat-value">{formatCurrency(totalSpent)}</span>
          </div>
        </div>
      </header>

      <main className="main">
        <section className={`overview-section ${mounted ? 'mounted' : ''}`}>
          <div className="section-header">
            <h2>Portfolio Overview</h2>
            <span className="section-date">January 2024</span>
          </div>

          <div className="category-breakdown">
            {categoryTotals.map((cat, index) => (
              <div
                key={cat.name}
                className="category-row"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="category-info">
                  <span className="category-icon" style={{ color: cat.color }}>{cat.icon}</span>
                  <span className="category-name">{cat.name}</span>
                </div>
                <div className="category-bar-container">
                  <div
                    className="category-bar"
                    style={{
                      width: `${maxCategoryTotal > 0 ? (cat.total / maxCategoryTotal) * 100 : 0}%`,
                      backgroundColor: cat.color,
                      animationDelay: `${0.5 + index * 0.1}s`
                    }}
                  ></div>
                </div>
                <span className="category-amount">{formatCurrency(cat.total)}</span>
              </div>
            ))}
          </div>
        </section>

        <section className={`transactions-section ${mounted ? 'mounted' : ''}`}>
          <div className="section-header">
            <h2>Recent Transactions</h2>
            <button className="add-btn" onClick={() => setIsFormOpen(!isFormOpen)}>
              <span className="add-icon">{isFormOpen ? '×' : '+'}</span>
              <span className="add-text">{isFormOpen ? 'Cancel' : 'New Entry'}</span>
            </button>
          </div>

          {isFormOpen && (
            <div className="expense-form">
              <div className="form-row">
                <div className="form-group">
                  <label>Description</label>
                  <input
                    type="text"
                    value={newExpense.description}
                    onChange={e => setNewExpense({ ...newExpense, description: e.target.value })}
                    placeholder="Enter description..."
                  />
                </div>
                <div className="form-group form-group-small">
                  <label>Amount</label>
                  <input
                    type="number"
                    value={newExpense.amount}
                    onChange={e => setNewExpense({ ...newExpense, amount: e.target.value })}
                    placeholder="0.00"
                    step="0.01"
                  />
                </div>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Category</label>
                  <select
                    value={newExpense.category}
                    onChange={e => setNewExpense({ ...newExpense, category: e.target.value })}
                  >
                    {categories.map(cat => (
                      <option key={cat.name} value={cat.name}>{cat.icon} {cat.name}</option>
                    ))}
                  </select>
                </div>
                <button className="submit-btn" onClick={addExpense}>
                  Record Transaction
                </button>
              </div>
            </div>
          )}

          <div className="transactions-list">
            {expenses.map((expense, index) => {
              const catData = getCategoryData(expense.category);
              return (
                <div
                  key={expense.id}
                  className="transaction-item"
                  style={{ animationDelay: `${0.3 + index * 0.05}s` }}
                >
                  <div className="transaction-left">
                    <span className="transaction-icon" style={{ borderColor: catData.color }}>
                      {catData.icon}
                    </span>
                    <div className="transaction-details">
                      <span className="transaction-desc">{expense.description}</span>
                      <span className="transaction-category">{expense.category}</span>
                    </div>
                  </div>
                  <div className="transaction-right">
                    <div className="transaction-meta">
                      <span className="transaction-amount">−{formatCurrency(expense.amount)}</span>
                      <span className="transaction-date">{new Date(expense.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
                    </div>
                    <button className="delete-btn" onClick={() => deleteExpense(expense.id)}>
                      ×
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      </main>

      <footer className="footer">
        <p>Requested by @wenxora · Built by @clonkbot</p>
      </footer>
    </div>
  );
}

export default App;
