import { useState, useMemo } from 'react';
import {
  CheckCircle2, Clock, MapPin,
  ShieldAlert, RefreshCw, Layers, Sliders, ChevronRight,
  Database, Check, Filter, Play
} from 'lucide-react';
import {
  STORED_ML_DATASET,
  processStoredRecord,
  TABPFN_THRESHOLD_BENCHMARK,
  type StoredDatasetRecord,
} from '../../services/mlService';
import type { FullPipelineExecutionResult } from '../../types/bank';

export default function MLPipelineRunner() {
  // Pre-process all stored dataset records immediately on load
  const processedDataset = useMemo(() => {
    return STORED_ML_DATASET.map(rec => ({
      record: rec,
      result: processStoredRecord(rec),
    }));
  }, []);

  const [selectedRecordId, setSelectedRecordId] = useState<string>(STORED_ML_DATASET[0].id);
  const [activeTab, setActiveTab] = useState<'dataset' | 'thresholds' | 'features'>('dataset');
  const [filterSource, setFilterSource] = useState<'all' | 'model2' | 'fraud' | 'legit'>('all');
  const [isBatchRunning, setIsBatchRunning] = useState(false);
  const [actionDone, setActionDone] = useState<Record<string, boolean>>({});

  // Active selected record and result
  const activeItem = useMemo(() => {
    return processedDataset.find(p => p.record.id === selectedRecordId) || processedDataset[0];
  }, [processedDataset, selectedRecordId]);

  // Filtered dataset records
  const filteredItems = useMemo(() => {
    return processedDataset.filter(({ record, result }) => {
      if (filterSource === 'model2') return record.sourceDataset === 'model2_cashout_dataset.csv';
      if (filterSource === 'fraud') return result.combined.final_risk_level === 'CRITICAL' || result.combined.final_risk_level === 'HIGH';
      if (filterSource === 'legit') return result.combined.final_risk_level === 'LOW' || result.combined.final_risk_level === 'MEDIUM';
      return true;
    });
  }, [processedDataset, filterSource]);

  // Handle batch re-run animation
  const handleBatchRun = () => {
    setIsBatchRunning(true);
    setTimeout(() => {
      setIsBatchRunning(false);
    }, 600);
  };

  const handleAction = (key: string) => {
    setActionDone(prev => ({ ...prev, [key]: true }));
  };

  const selectedResult: FullPipelineExecutionResult = activeItem.result;
  const selectedRecord: StoredDatasetRecord = activeItem.record;

  return (
    <div className="p-4 sm:p-6 animate-fade-in space-y-6">
      {/* Header Banner - Sleek White & Black Gradient */}
      <div className="card p-6 bg-gradient-to-r from-black via-zinc-900 to-black text-white flex flex-col md:flex-row md:items-center justify-between gap-4 border border-zinc-800 shadow-2xl rounded-2xl">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="bg-white/10 text-white border border-white/20 text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider backdrop-blur-sm">
              Stored Dataset Ingestion Mode
            </span>
            <span className="text-xs text-zinc-400 font-mono">No Real-Time Typing Required</span>
          </div>
          <h1 className="text-2xl font-black text-white tracking-tight">
            Cyber Fraud & Cash-out ML Engine
          </h1>
          <p className="text-xs text-zinc-300 max-w-2xl mt-1.5 leading-relaxed">
            Directly ingesting stored datasets (<code className="text-white bg-zinc-800 px-1 py-0.5 rounded">model2_cashout_dataset.csv</code> and <code className="text-white bg-zinc-800 px-1 py-0.5 rounded">lead-ai-fraud-detection-dataset-v2</code>) into Model 1 (TabPFN) and Model 2 (Cash-out ATM Predictor).
          </p>
        </div>

        <div className="flex items-center gap-3 self-start md:self-center">
          <button
            type="button"
            onClick={handleBatchRun}
            disabled={isBatchRunning}
            className="text-xs px-4 py-2 font-bold flex items-center gap-2 bg-white text-black hover:bg-zinc-200 transition-colors rounded-xl shadow-lg border-0 cursor-pointer"
          >
            {isBatchRunning ? <RefreshCw size={14} className="animate-spin text-black" /> : <Play size={14} fill="currentColor" className="text-black" />}
            {isBatchRunning ? 'Processing Dataset…' : 'Re-Run All Dataset Records'}
          </button>
        </div>
      </div>

      {/* Dataset Summary KPI Badges */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="card p-4 bg-white border border-slate-200">
          <p className="text-[10px] uppercase font-bold text-slate-400">Total Stored Records</p>
          <p className="text-2xl font-black text-slate-800">{processedDataset.length}</p>
          <p className="text-[10px] text-slate-500 mt-0.5">Pre-loaded from dataset storage</p>
        </div>
        <div className="card p-4 bg-white border border-slate-200">
          <p className="text-[10px] uppercase font-bold text-red-500">Critical / High Fraud</p>
          <p className="text-2xl font-black text-red-600">
            {processedDataset.filter(p => p.result.combined.final_risk_level === 'CRITICAL' || p.result.combined.final_risk_level === 'HIGH').length}
          </p>
          <p className="text-[10px] text-red-600 mt-0.5">Flagged for Immediate Action</p>
        </div>
        <div className="card p-4 bg-white border border-slate-200">
          <p className="text-[10px] uppercase font-bold text-orange-500">Model 2 Cash-out Targets</p>
          <p className="text-2xl font-black text-orange-600">
            {processedDataset.filter(p => p.result.model2).length}
          </p>
          <p className="text-[10px] text-orange-600 mt-0.5">With Predicted ATM Coordinates</p>
        </div>
        <div className="card p-4 bg-white border border-slate-200">
          <p className="text-[10px] uppercase font-bold text-green-600">Legitimate Verified</p>
          <p className="text-2xl font-black text-green-700">
            {processedDataset.filter(p => p.result.combined.final_risk_level === 'LOW').length}
          </p>
          <p className="text-[10px] text-green-600 mt-0.5">Allowed with zero delay</p>
        </div>
      </div>

      {/* Navigation tabs - White & Black Theme */}
      <div className="flex gap-2 border-b border-zinc-200 pb-2">
        <button
          type="button"
          onClick={() => setActiveTab('dataset')}
          className={`px-3.5 py-2 text-xs font-bold rounded-xl transition-all flex items-center gap-1.5 cursor-pointer ${
            activeTab === 'dataset' ? 'bg-black text-white shadow-md' : 'text-zinc-600 hover:bg-zinc-100'
          }`}
        >
          <Database size={13} /> Stored Dataset Ingestion & Deep-Dive
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('thresholds')}
          className={`px-3.5 py-2 text-xs font-bold rounded-xl transition-all flex items-center gap-1.5 cursor-pointer ${
            activeTab === 'thresholds' ? 'bg-black text-white shadow-md' : 'text-zinc-600 hover:bg-zinc-100'
          }`}
        >
          <Sliders size={13} /> TabPFN Optimal Threshold Tuning (0.10 - 0.90)
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('features')}
          className={`px-3.5 py-2 text-xs font-bold rounded-xl transition-all flex items-center gap-1.5 cursor-pointer ${
            activeTab === 'features' ? 'bg-black text-white shadow-md' : 'text-zinc-600 hover:bg-zinc-100'
          }`}
        >
          <Layers size={13} /> 18-Feature Vector Breakdown (Selected Record)
        </button>
      </div>

      {activeTab === 'dataset' && (
        <div className="space-y-6">
          {/* Section 1: Stored Dataset Records Table */}
          <div className="card p-5 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h3 className="font-bold text-slate-800 text-sm flex items-center gap-2">
                  <Database size={16} color="#1e3a6e" /> Stored Dataset Transactions (Select any row to view full ML inference)
                </h3>
                <p className="text-xs text-slate-500">
                  Click any transaction below to load its TabPFN probability, velocity risk engine score, and Model 2 cash-out prediction.
                </p>
              </div>

              {/* Filter Buttons */}
              <div className="flex items-center gap-1.5">
                <Filter size={13} className="text-slate-400" />
                <button
                  type="button"
                  onClick={() => setFilterSource('all')}
                  className={`px-2.5 py-1 text-[11px] rounded font-semibold ${filterSource === 'all' ? 'bg-slate-800 text-white' : 'bg-slate-100 text-slate-600'}`}
                >
                  All ({processedDataset.length})
                </button>
                <button
                  type="button"
                  onClick={() => setFilterSource('model2')}
                  className={`px-2.5 py-1 text-[11px] rounded font-semibold ${filterSource === 'model2' ? 'bg-orange-600 text-white' : 'bg-orange-50 text-orange-700'}`}
                >
                  Model 2 CSV ({processedDataset.filter(p => p.record.sourceDataset === 'model2_cashout_dataset.csv').length})
                </button>
                <button
                  type="button"
                  onClick={() => setFilterSource('fraud')}
                  className={`px-2.5 py-1 text-[11px] rounded font-semibold ${filterSource === 'fraud' ? 'bg-red-600 text-white' : 'bg-red-50 text-red-700'}`}
                >
                  Critical/High ({processedDataset.filter(p => p.result.combined.final_risk_level === 'CRITICAL' || p.result.combined.final_risk_level === 'HIGH').length})
                </button>
                <button
                  type="button"
                  onClick={() => setFilterSource('legit')}
                  className={`px-2.5 py-1 text-[11px] rounded font-semibold ${filterSource === 'legit' ? 'bg-green-700 text-white' : 'bg-green-50 text-green-700'}`}
                >
                  Legitimate ({processedDataset.filter(p => p.result.combined.final_risk_level === 'LOW').length})
                </button>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Record ID</th>
                    <th>Transaction ID</th>
                    <th>Customer ID</th>
                    <th>Amount (₹)</th>
                    <th>Time</th>
                    <th>Velocity (1h / 24h)</th>
                    <th>TabPFN Prob</th>
                    <th>Final Risk Score</th>
                    <th>Risk Level</th>
                    <th>Action</th>
                    <th>Inspect</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredItems.map(({ record, result }) => {
                    const isSelected = record.id === selectedRecordId;
                    return (
                      <tr
                        key={record.id}
                        onClick={() => setSelectedRecordId(record.id)}
                        className={`cursor-pointer transition-colors ${isSelected ? 'bg-zinc-100 font-semibold border-l-4 border-l-black' : 'hover:bg-zinc-50'}`}
                      >
                        <td className="font-mono text-xs text-slate-500 font-bold">{record.id}</td>
                        <td className="font-mono text-xs text-blue-700 font-bold">{record.transaction.transaction_id}</td>
                        <td className="font-mono text-xs text-slate-600">{record.transaction.customer_id}</td>
                        <td className="font-semibold text-sm">₹{record.transaction.transaction_amount.toLocaleString()}</td>
                        <td className="font-mono text-xs text-slate-600">
                          {String(record.transaction.transaction_hour).padStart(2, '0')}:{String(record.transaction.transaction_minute).padStart(2, '0')}
                        </td>
                        <td className="text-xs">
                          <span className="font-bold text-slate-800">{record.transaction.transaction_velocity_1h}</span> / {record.transaction.transaction_velocity_24h}
                        </td>
                        <td className="font-mono text-xs font-bold text-blue-800">
                          {(result.model1.fraud_probability * 100).toFixed(1)}%
                        </td>
                        <td className="font-mono text-xs font-black text-red-600">
                          {result.combined.final_risk_score.toFixed(1)}/100
                        </td>
                        <td>
                          <span className={`badge risk-${result.combined.final_risk_level.toLowerCase()} text-[10px]`}>
                            {result.combined.final_risk_level}
                          </span>
                        </td>
                        <td className="text-xs font-bold">
                          <span className={result.combined.final_action === 'IMMEDIATE ALERT' ? 'text-red-600' : result.combined.final_action === 'URGENT ALERT' ? 'text-orange-600' : 'text-green-700'}>
                            {result.combined.final_action}
                          </span>
                        </td>
                        <td>
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedRecordId(record.id);
                            }}
                            className={`text-xs px-2.5 py-1 rounded-lg font-bold transition-all cursor-pointer ${isSelected ? 'bg-black text-white shadow-sm' : 'bg-zinc-100 text-zinc-700 hover:bg-zinc-200'}`}
                          >
                            {isSelected ? 'Active ✓' : 'Inspect →'}
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* Section 2: Full ML Pipeline Deep-Dive for Selected Record */}
          <div className="card p-6 space-y-5 bg-gradient-to-b from-white via-zinc-50 to-white border border-zinc-200 shadow-sm rounded-2xl">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200 pb-4">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="badge badge-submitted text-xs font-bold">
                    Active Inspection: {selectedRecord.id}
                  </span>
                  <span className="text-xs text-slate-500 font-mono">
                    Source: <strong>{selectedRecord.sourceDataset}</strong>
                  </span>
                </div>
                <h2 className="text-xl font-black text-slate-900">
                  ML Pipeline Execution Breakdown — {selectedRecord.transaction.transaction_id}
                </h2>
              </div>

              <div className="flex items-center gap-2">
                <span className={`badge risk-${selectedResult.combined.final_risk_level.toLowerCase()} text-sm font-bold px-3 py-1`}>
                  {selectedResult.combined.final_risk_level} — {selectedResult.combined.final_action}
                </span>
              </div>
            </div>

            <div className="grid md:grid-cols-3 gap-4">
              {/* Stage 1: TabPFN Model 1 */}
              <div className="card p-4 border border-blue-200 bg-white" style={{ borderTop: '4px solid #2563b0' }}>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold text-blue-900 uppercase tracking-wide">1. TabPFN Model 1</span>
                  <span className="badge badge-submitted text-[10px]">Optimal Threshold: 0.30</span>
                </div>
                <div className="space-y-2 text-xs">
                  <div className="flex justify-between py-1 border-b border-slate-100">
                    <span className="text-slate-500">Fraud Probability:</span>
                    <span className="font-mono font-bold text-slate-800">{(selectedResult.model1.fraud_probability * 100).toFixed(1)}%</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-slate-100">
                    <span className="text-slate-500">ML Risk Score:</span>
                    <span className="font-mono font-bold text-blue-700">{selectedResult.model1.ml_risk_score.toFixed(1)} / 100</span>
                  </div>
                  <div className="flex justify-between py-1">
                    <span className="text-slate-500">Decision Class:</span>
                    <span className={`font-bold ${selectedResult.model1.predicted_class === 1 ? 'text-red-600' : 'text-green-700'}`}>
                      {selectedResult.model1.predicted_class === 1 ? 'Class 1 (FRAUD)' : 'Class 0 (LEGITIMATE)'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Stage 2: Transaction Velocity Engine */}
              <div className="card p-4 border border-amber-200 bg-white" style={{ borderTop: '4px solid #d97706' }}>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold text-amber-900 uppercase tracking-wide">2. Velocity Risk Engine</span>
                  <span className={`badge risk-${selectedResult.velocity.velocity_risk_level.toLowerCase()} text-[10px]`}>
                    {selectedResult.velocity.velocity_risk_level}
                  </span>
                </div>
                <div className="space-y-2 text-xs">
                  <div className="flex justify-between py-1 border-b border-slate-100">
                    <span className="text-slate-500">1-Hour Velocity (70% wt):</span>
                    <span className="font-bold text-slate-800">{selectedResult.velocity.velocity_1h} txns (Score: {selectedResult.velocity.velocity_1h_score})</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-slate-100">
                    <span className="text-slate-500">24-Hour Velocity (30% wt):</span>
                    <span className="font-bold text-slate-800">{selectedResult.velocity.velocity_24h} txns (Score: {selectedResult.velocity.velocity_24h_score})</span>
                  </div>
                  <div className="flex justify-between py-1">
                    <span className="text-slate-500">Velocity Risk Score:</span>
                    <span className="font-mono font-bold text-amber-700">{selectedResult.velocity.velocity_risk_score.toFixed(1)} / 100</span>
                  </div>
                </div>
              </div>

              {/* Stage 3: Combined Risk Engine */}
              <div className="card p-4 border border-red-200 bg-white" style={{ borderTop: '4px solid #dc2626' }}>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold text-red-900 uppercase tracking-wide">3. Combined Engine</span>
                  <span className="text-[10px] font-mono text-slate-400">70% ML + 30% Vel</span>
                </div>
                <div className="space-y-2 text-xs">
                  <div className="flex justify-between py-1 border-b border-slate-100">
                    <span className="text-slate-500">Combined Formula:</span>
                    <span className="font-mono text-[11px] text-slate-700">
                      ({selectedResult.model1.ml_risk_score.toFixed(1)}×0.7)+({selectedResult.velocity.velocity_risk_score.toFixed(1)}×0.3)
                    </span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-slate-100">
                    <span className="text-slate-500">Final Risk Score:</span>
                    <span className="font-mono font-black text-red-600 text-sm">
                      {selectedResult.combined.final_risk_score.toFixed(1)} / 100
                    </span>
                  </div>
                  <div className="flex justify-between py-1">
                    <span className="text-slate-500">Final Action Decision:</span>
                    <span className="font-bold text-red-600">{selectedResult.combined.final_action}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Stage 4: Model 2 Cash-out Intelligence (if HIGH or CRITICAL) */}
            {selectedResult.model2 ? (
              <div className="card p-5 bg-orange-50/70 border border-orange-200 space-y-4" style={{ borderLeft: '5px solid #ea580c' }}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <ShieldAlert size={20} color="#ea580c" />
                    <div>
                      <h4 className="font-bold text-orange-950 text-sm">
                        Model 2 — Cash-out Intelligence Target (From Stored Dataset)
                      </h4>
                      <p className="text-xs text-orange-800">
                        Triggered by {selectedResult.combined.final_risk_level} risk level. Cash-out withdrawal window and ATM location predicted.
                      </p>
                    </div>
                  </div>
                  <span className="badge badge-submitted bg-orange-100 text-orange-900 font-bold text-xs">
                    Target Verified
                  </span>
                </div>

                <div className="grid sm:grid-cols-4 gap-3">
                  <div className="p-3 rounded-xl bg-white border border-orange-200">
                    <p className="text-[10px] uppercase font-bold text-orange-600 flex items-center gap-1">
                      <Clock size={11} /> Est. Withdrawal Delay
                    </p>
                    <p className="text-xl font-black text-orange-950 font-mono">
                      {selectedResult.model2.minutes_until_cashout.toFixed(1)} min
                    </p>
                  </div>
                  <div className="p-3 rounded-xl bg-white border border-orange-200">
                    <p className="text-[10px] uppercase font-bold text-orange-600">Predicted Cash-out Time</p>
                    <p className="text-xl font-black text-orange-950 font-mono">
                      {selectedResult.model2.predicted_cashout_time}
                    </p>
                  </div>
                  <div className="p-3 rounded-xl bg-white border border-orange-200 sm:col-span-2">
                    <p className="text-[10px] uppercase font-bold text-orange-600 flex items-center gap-1">
                      <MapPin size={11} /> Predicted ATM GPS Coordinates
                    </p>
                    <p className="text-xs font-mono font-bold text-orange-950">
                      Lat: {selectedResult.model2.atm_latitude.toFixed(6)}, Lon: {selectedResult.model2.atm_longitude.toFixed(6)}
                    </p>
                    <p className="text-[11px] text-orange-900 font-medium truncate mt-0.5">
                      {selectedResult.model2.atm_branch}
                    </p>
                    <p className="text-[10px] text-orange-700 truncate">{selectedResult.model2.atm_address}</p>
                  </div>
                </div>

                {/* Actionable Responses */}
                <div className="p-4 rounded-xl bg-white border border-orange-200 space-y-2">
                  <p className="text-xs font-bold text-slate-800 uppercase tracking-wide">
                    🚨 Automated Actionable Responses (Click to execute):
                  </p>
                  <div className="grid sm:grid-cols-2 gap-2">
                    {selectedResult.model2.recommended_responses.map((resp, i) => {
                      const key = `${selectedRecord.id}_action_${i}`;
                      const isDone = actionDone[key];
                      return (
                        <button
                          key={i}
                          type="button"
                          onClick={() => handleAction(key)}
                          className={`p-2.5 rounded-lg text-left text-xs font-medium transition-all flex items-start justify-between gap-2 border ${
                            isDone
                              ? 'bg-green-50 border-green-200 text-green-800'
                              : 'bg-slate-50 hover:bg-orange-50/60 border-slate-200 text-slate-700'
                          }`}
                        >
                          <span>{resp}</span>
                          {isDone ? (
                            <Check size={14} className="text-green-600 flex-shrink-0 mt-0.5" />
                          ) : (
                            <ChevronRight size={14} className="text-slate-400 flex-shrink-0 mt-0.5" />
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            ) : (
              <div className="card p-4 bg-green-50 border border-green-200 flex items-center gap-3">
                <CheckCircle2 size={20} className="text-green-700 flex-shrink-0" />
                <div>
                  <p className="text-xs font-bold text-green-900">Model 2 Cash-out Not Triggered</p>
                  <p className="text-xs text-green-700">
                    This stored transaction is classified as <strong>{selectedResult.combined.final_risk_level}</strong> risk.
                    Cash-out ATM prediction triggers only for HIGH or CRITICAL risk scores (≥60/100).
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Threshold Matrix View */}
      {activeTab === 'thresholds' && (
        <div className="card p-6 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <h3 className="font-bold text-slate-900 text-base flex items-center gap-2">
                <Sliders size={18} color="#1e3a6e" /> TabPFN Threshold Benchmark Matrix
              </h3>
              <p className="text-slate-500 text-xs">
                Performance across decision thresholds evaluated on 20,000 unseen test transactions from <code>lead-ai-fraud-detection-dataset-v2</code>.
              </p>
            </div>
            <span className="badge badge-resolved text-xs font-bold px-3 py-1">
              Best Threshold: 0.30 (F1: 85.56%)
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Threshold</th>
                  <th>Precision</th>
                  <th>Recall</th>
                  <th>F1-Score</th>
                  <th>Accuracy</th>
                  <th>Operating Trade-off</th>
                </tr>
              </thead>
              <tbody>
                {TABPFN_THRESHOLD_BENCHMARK.map(row => (
                  <tr key={row.threshold} className={row.isBest ? 'bg-blue-50/80 font-semibold' : ''}>
                    <td className="font-mono font-bold text-blue-800">
                      {row.threshold.toFixed(2)}
                      {row.isBest && (
                        <span className="ml-2 text-[10px] bg-blue-700 text-white font-sans px-2 py-0.5 rounded-full">
                          Selected Best
                        </span>
                      )}
                    </td>
                    <td className="font-mono">{(row.precision * 100).toFixed(2)}%</td>
                    <td className="font-mono">{(row.recall * 100).toFixed(2)}%</td>
                    <td className="font-mono text-blue-700 font-bold">{(row.f1 * 100).toFixed(2)}%</td>
                    <td className="font-mono">{(row.accuracy * 100).toFixed(2)}%</td>
                    <td className="text-xs">
                      {row.threshold < 0.30 && <span className="text-amber-700">Higher false alarms (Low precision)</span>}
                      {row.isBest && <span className="text-green-700 font-bold">Optimal trade-off: Max F1-Score (0.8556)</span>}
                      {row.threshold > 0.30 && <span className="text-slate-500">Missed frauds (Low recall)</span>}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 18-Features View */}
      {activeTab === 'features' && (
        <div className="card p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-bold text-slate-900 text-base flex items-center gap-2">
                <Database size={18} color="#1e3a6e" /> TabPFN 18-Feature Vector: {selectedRecord.transaction.transaction_id}
              </h3>
              <p className="text-slate-500 text-xs">
                Pre-stored feature values from dataset passed into Model 1 TabPFN Classifier.
              </p>
            </div>
            <span className="text-xs text-slate-400 font-mono">18 Features</span>
          </div>

          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-3">
            {[
              { name: 'transaction_hour', desc: 'Hour of transaction (0-23)', type: 'Numeric', value: selectedRecord.transaction.transaction_hour },
              { name: 'transaction_day_of_week', desc: 'Day of week (Monday=0)', type: 'Numeric', value: selectedRecord.transaction.transaction_day_of_week ?? 0 },
              { name: 'account_age_days', desc: 'Account age in days', type: 'Numeric', value: selectedRecord.transaction.account_age_days },
              { name: 'previous_chargebacks', desc: 'Prior chargebacks count', type: 'Numeric', value: selectedRecord.transaction.previous_chargebacks },
              { name: 'merchant_category', desc: 'Industry MCC mapping', type: 'Categorical (Encoded)', value: selectedRecord.transaction.merchant_category },
              { name: 'transaction_country', desc: 'Transaction origin country', type: 'Categorical (Encoded)', value: selectedRecord.transaction.transaction_country },
              { name: 'device_type', desc: 'Mobile / Web / POS / ATM', type: 'Categorical (Encoded)', value: selectedRecord.transaction.device_type },
              { name: 'transaction_type', desc: 'Transfer / Withdrawal / Payment', type: 'Categorical (Encoded)', value: selectedRecord.transaction.transaction_type },
              { name: 'geo_location_region', desc: 'Administrative state/region', type: 'Categorical (Encoded)', value: selectedRecord.transaction.geo_location_region },
              { name: 'is_international', desc: 'Cross-border transaction indicator', type: 'Binary (0/1)', value: selectedRecord.transaction.is_international },
              { name: 'is_high_risk_merchant_category', desc: 'Electronics/crypto/luxury', type: 'Binary (0/1)', value: selectedRecord.transaction.is_high_risk_merchant_category },
              { name: 'is_weekend', desc: 'Saturday or Sunday', type: 'Binary (0/1)', value: selectedRecord.transaction.is_weekend },
              { name: 'customer_total_transactions_30d', desc: '30-day cumulative volume', type: 'Numeric', value: selectedRecord.transaction.customer_total_transactions_30d },
              { name: 'customer_risk_score', desc: 'Historical customer risk rating', type: 'Numeric (0-100)', value: selectedRecord.transaction.customer_risk_score },
              { name: 'transaction_amount', desc: 'Transaction amount in INR', type: 'Numeric (₹)', value: `₹${selectedRecord.transaction.transaction_amount.toLocaleString()}` },
              { name: 'avg_transaction_amount_30d_customer', desc: 'Baseline average volume', type: 'Numeric (₹)', value: `₹${selectedRecord.transaction.avg_transaction_amount_30d_customer.toLocaleString()}` },
              { name: 'transaction_velocity_1h', desc: 'Transactions in preceding 1 hour', type: 'Numeric', value: selectedRecord.transaction.transaction_velocity_1h },
              { name: 'transaction_velocity_24h', desc: 'Transactions in preceding 24 hours', type: 'Numeric', value: selectedRecord.transaction.transaction_velocity_24h },
            ].map(f => (
              <div key={f.name} className="p-3 rounded-xl border border-slate-100 bg-slate-50/70">
                <div className="flex items-center justify-between mb-1">
                  <span className="font-mono text-xs font-bold text-blue-800">{f.name}</span>
                  <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-200 text-slate-700 font-semibold">{f.type}</span>
                </div>
                <p className="text-[11px] text-slate-500 mb-2">{f.desc}</p>
                <div className="text-xs font-mono font-bold text-slate-900 bg-white p-1.5 rounded border border-slate-200">
                  Value: {String(f.value)}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
