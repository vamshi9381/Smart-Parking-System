import { useState } from 'react';
import DailyRevenueReport from '../../components/reports/DailyRevenueReport';
import MonthlyRevenueReport from '../../components/reports/MonthlyRevenueReport';

function ReportsPage() {
  const [activeTab, setActiveTab] = useState('daily-revenue');

  return (
    <div className="reports-page">
      <div className="page-header">
        <h1>📊 Reports</h1>
        <p>View parking reports and statistics</p>
      </div>

      <div className="reports-tabs">
        <button 
          className={`tab-button ${activeTab === 'daily-revenue' ? 'active' : ''}`}
          onClick={() => setActiveTab('daily-revenue')}
          >
          📅 Daily Revenue
        </button>
        <button 
          className={`tab-button ${activeTab === 'monthly' ? 'active' : ''}`}
          onClick={() => setActiveTab('monthly')}
        >
          📊 Monthly Report
        </button>
      </div>

      <div className="reports-content">
        {activeTab === 'daily-revenue' && <DailyRevenueReport />}
        {activeTab === 'monthly' && <MonthlyRevenueReport />}
      </div>
    </div>
  );
}

export default ReportsPage;
