import React from 'react';
import { useRailSync } from '../../context/RailSyncContext';
import { UserRole } from '../../types/railway';
import { CATEGORIES_CONFIG, CATEGORY_EXCLUSIVE_FEATURES } from '../../services/categoryPermissions';
import { ShieldAlert, Lock, AlertTriangle, ArrowRight, X, CheckCircle2, ShieldCheck } from 'lucide-react';

export const CategoryAccessGuardModal: React.FC = () => {
  const {
    currentRole,
    setCurrentRole,
    accessGuardState,
    closeAccessGuard
  } = useRailSync();

  if (!accessGuardState.isOpen) return null;

  const currentCategoryInfo = CATEGORIES_CONFIG[currentRole];
  const requiredCategoryInfo = accessGuardState.requiredRole ? CATEGORIES_CONFIG[accessGuardState.requiredRole] : null;

  const handleSwitchCategory = () => {
    if (accessGuardState.requiredRole) {
      setCurrentRole(accessGuardState.requiredRole);
      closeAccessGuard();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md animate-in fade-in duration-200">
      <div className="w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-rose-200 overflow-hidden">
        {/* Top Warning Banner */}
        <div className="bg-gradient-to-r from-rose-600 via-rose-700 to-red-800 px-6 py-4 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-white/15 border border-white/20">
              <ShieldAlert className="w-6 h-6 text-white" />
            </div>
            <div>
              <span className="text-[10px] font-mono tracking-wider px-2 py-0.5 rounded bg-rose-950/60 border border-rose-400/40 uppercase font-bold text-rose-200">
                RBAC Security Barrier
              </span>
              <h2 className="text-lg font-bold text-white mt-0.5">
                Category Access Restricted
              </h2>
            </div>
          </div>
          <button
            onClick={closeAccessGuard}
            className="p-1.5 rounded-lg hover:bg-white/10 text-white/80 hover:text-white transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 space-y-5">
          {/* Attempted Feature Card */}
          <div className="bg-rose-50/70 border border-rose-200/80 rounded-xl p-4">
            <div className="flex items-center gap-2 text-rose-800 text-xs font-bold uppercase tracking-wider">
              <Lock className="w-4 h-4 text-rose-600" />
              <span>Restricted Feature Attempted</span>
            </div>
            <div className="mt-1 text-base font-bold text-slate-900">
              {accessGuardState.targetFeatureName || 'Operational Feature'}
            </div>
            <p className="text-xs text-slate-600 mt-1 leading-relaxed">
              {accessGuardState.reason || 'This feature is compartmentalized and cannot be accessed from your active category.'}
            </p>
          </div>

          {/* Clearance Level Comparison */}
          <div className="grid grid-cols-2 gap-3 text-xs">
            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
              <span className="text-[10px] font-mono font-semibold text-slate-400 block uppercase">
                Your Current Category
              </span>
              <div className="font-bold text-slate-800 mt-1 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-blue-500" />
                <span>{currentCategoryInfo.title}</span>
              </div>
              <span className="inline-block mt-1.5 text-[10px] font-mono font-semibold px-2 py-0.5 rounded bg-blue-50 text-blue-700 border border-blue-200">
                {currentCategoryInfo.clearanceLevel}
              </span>
            </div>

            <div className="p-3.5 rounded-xl bg-amber-50/80 border border-amber-200">
              <span className="text-[10px] font-mono font-semibold text-amber-700 block uppercase">
                Required Authorization
              </span>
              <div className="font-bold text-amber-900 mt-1 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-amber-500" />
                <span>{requiredCategoryInfo?.title || 'Higher Clearance'}</span>
              </div>
              <span className="inline-block mt-1.5 text-[10px] font-mono font-semibold px-2 py-0.5 rounded bg-amber-100 text-amber-800 border border-amber-300">
                {requiredCategoryInfo?.clearanceLevel || 'RESTRICTED'}
              </span>
            </div>
          </div>

          {/* Regulatory Notice & Audit Status */}
          <div className="p-3 rounded-xl bg-slate-100/80 border border-slate-200 flex items-start gap-2.5 text-xs text-slate-600">
            <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
            <div className="space-y-1 text-[11px]">
              <span className="font-semibold text-slate-800 block">
                Security Policy Compliance
              </span>
              <p>
                Each operational category operates on isolated data and controls to prevent unauthorized railway dispatch commands or passenger data leakage. This access attempt has been logged in the System Audit Ledger for governance review.
              </p>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              onClick={closeAccessGuard}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition"
            >
              Stay in Current Category
            </button>

            {accessGuardState.requiredRole && (
              <button
                onClick={handleSwitchCategory}
                className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition flex items-center gap-1.5 shadow-md shadow-blue-500/20"
              >
                <span>Switch to {requiredCategoryInfo?.title}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
