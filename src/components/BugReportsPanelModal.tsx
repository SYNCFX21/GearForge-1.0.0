import React, { useState, useEffect } from 'react';
import { Bug, X, Clock, CheckCircle2, AlertTriangle, RefreshCw } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { BugReport } from '../types';
import { getBugReportsFromFirestore, updateBugReportStatusInFirestore } from '../lib/firestore';

interface BugReportsPanelModalProps {
  isOpen: boolean;
  onClose: () => void;
}

/**
 * BugReportsPanelModal Component
 * Admin management panel to view, filter, and triage incoming user bug reports
 * and status transitions ('open' -> 'in-progress' -> 'resolved').
 * 
 * @whereUsed
 * - `src/App.tsx` (opened when an Admin clicks the Bug Reports badge in the top bar)
 */
export default function BugReportsPanelModal({ isOpen, onClose }: BugReportsPanelModalProps) {
  const [reports, setReports] = useState<BugReport[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [filter, setFilter] = useState<'all' | 'open' | 'in-progress' | 'resolved'>('all');

  const loadReports = async () => {
    setIsRefreshing(true);
    try {
      const data = await getBugReportsFromFirestore();
      setReports(data);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      loadReports();
    }
  }, [isOpen]);

  const handleUpdateStatus = async (reportId: string, newStatus: 'open' | 'in-progress' | 'resolved') => {
    try {
      // Optimistic update
      setReports(prev => prev.map(r => r.id === reportId ? { ...r, status: newStatus } : r));
      await updateBugReportStatusInFirestore(reportId, newStatus);
    } catch (err) {
      console.error(err);
      // Revert on failure
      loadReports();
    }
  };

  if (!isOpen) return null;

  const filteredReports = reports.filter(r => filter === 'all' || r.status === filter);

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        />

        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative w-full max-w-4xl max-h-[85vh] flex flex-col bg-[var(--card-bg)] border border-red-500/20 rounded-[32px] shadow-2xl overflow-hidden"
        >
          {/* Header */}
          <div className="p-6 sm:p-8 border-b border-white/5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 bg-red-500/20 rounded-2xl flex items-center justify-center shrink-0 border border-red-500/30">
                <Bug className="w-7 h-7 text-red-500" />
              </div>
              <div>
                <h2 className="text-2xl font-black text-white tracking-tight">Bug Reports</h2>
                <p className="text-sm text-red-400/80 font-medium">Manage and resolve user issues</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={loadReports}
                disabled={isRefreshing}
                className="p-3 bg-white/5 hover:bg-white/10 rounded-xl transition-colors text-zinc-400 hover:text-white disabled:opacity-50"
                title="Refresh"
              >
                <RefreshCw className={`w-5 h-5 ${isRefreshing ? 'animate-spin text-red-400' : ''}`} />
              </button>
              <button
                onClick={onClose}
                className="p-3 bg-white/5 hover:bg-white/10 rounded-xl transition-colors cursor-pointer text-zinc-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Filter Bar */}
          <div className="px-6 sm:px-8 py-4 border-b border-white/5 flex items-center gap-2 overflow-x-auto scrollbar-hide">
            {(['all', 'open', 'in-progress', 'resolved'] as const).map(f => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-4 py-2 rounded-xl text-xs font-extrabold uppercase tracking-widest whitespace-nowrap transition-colors ${
                  filter === f
                    ? 'bg-red-500 text-white'
                    : 'bg-white/5 text-zinc-400 hover:bg-white/10'
                }`}
              >
                {f.replace('-', ' ')}
                <span className="ml-2 px-1.5 py-0.5 rounded-md bg-black/20 text-[10px]">
                  {f === 'all' ? reports.length : reports.filter(r => r.status === f).length}
                </span>
              </button>
            ))}
          </div>

          {/* List */}
          <div className="flex-1 overflow-y-auto p-6 sm:p-8 space-y-4">
            {isLoading ? (
              <div className="flex flex-col items-center justify-center py-12 text-zinc-500">
                <RefreshCw className="w-8 h-8 animate-spin mb-4 text-red-500/50" />
                <p>Loading reports...</p>
              </div>
            ) : filteredReports.length === 0 ? (
              <div className="text-center py-12 bg-white/5 rounded-3xl border border-white/10 border-dashed">
                <CheckCircle2 className="w-12 h-12 text-emerald-500 mx-auto mb-3 opacity-50" />
                <h3 className="text-lg font-bold text-white mb-1">No Bug Reports</h3>
                <p className="text-sm text-zinc-400">Everything looks good in this view.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {filteredReports.map(report => (
                  <div key={report.id} className="bg-[var(--app-bg)] border border-white/5 rounded-2xl p-5 hover:border-red-500/30 transition-colors group">
                    <div className="flex flex-col lg:flex-row gap-4 lg:items-start justify-between">
                      <div className="space-y-3 flex-1">
                        <div className="flex items-center gap-3">
                          <span className={`px-2.5 py-1 rounded-md text-[10px] font-extrabold uppercase tracking-wider flex items-center gap-1.5 ${
                            report.status === 'open' ? 'bg-red-500/20 text-red-400 border border-red-500/30' :
                            report.status === 'in-progress' ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30' :
                            'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                          }`}>
                            {report.status === 'open' && <AlertTriangle className="w-3 h-3" />}
                            {report.status === 'in-progress' && <Clock className="w-3 h-3" />}
                            {report.status === 'resolved' && <CheckCircle2 className="w-3 h-3" />}
                            {report.status.replace('-', ' ')}
                          </span>
                          <span className="text-xs text-zinc-500 font-mono">{new Date(report.createdAt).toLocaleString()}</span>
                        </div>
                        
                        <div>
                          <p className="text-sm text-white font-medium whitespace-pre-wrap">{report.description}</p>
                        </div>
                        
                        <div className="flex items-center gap-2 pt-2 text-xs text-zinc-400 bg-white/5 p-2.5 rounded-xl w-fit">
                          <span className="font-bold text-primary-400">{report.userName}</span>
                          <span className="text-zinc-600">•</span>
                          <span className="font-mono">{report.userEmail}</span>
                          <span className="text-zinc-600">•</span>
                          <span className="font-mono text-[10px] opacity-50">{report.userId}</span>
                        </div>
                      </div>

                      <div className="flex flex-row lg:flex-col gap-2 shrink-0">
                        <select
                          value={report.status}
                          onChange={(e) => handleUpdateStatus(report.id, e.target.value as any)}
                          className="bg-black/50 border border-white/10 rounded-xl px-4 py-2.5 text-xs font-bold text-white focus:outline-none focus:border-red-500 cursor-pointer"
                        >
                          <option value="open">Mark as Open</option>
                          <option value="in-progress">Mark as In Progress</option>
                          <option value="resolved">Mark as Resolved</option>
                        </select>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
