'use client';

import React from 'react';
import { ShieldCheck, Award, RotateCcw } from 'lucide-react';

interface RelianceStripProps {
  warranty?: string;
  replacementPolicy?: string;
  authenticityGuarantee?: string;
  compact?: boolean;
}

export const RelianceStrip: React.FC<RelianceStripProps> = ({
  warranty = '18 Months Official Brand Warranty',
  replacementPolicy = '7-Day Instant Defect Replacement',
  authenticityGuarantee = '100% Original & Serial Verified',
  compact = false,
}) => {
  return (
    <div className={`my-5 rounded-xl border border-slate-200 bg-slate-50/60 p-4 ${compact ? 'text-xs' : ''}`}>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 divide-y sm:divide-y-0 sm:divide-x divide-slate-200">
        
        {/* Point 1: Authenticity */}
        <div className="flex items-start gap-3 sm:pr-3">
          <ShieldCheck className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
          <div>
            <h4 className="text-xs font-semibold text-slate-900 leading-tight">
              100% Genuine
            </h4>
            <p className="text-[11px] text-slate-500 mt-0.5 leading-snug">
              {authenticityGuarantee}
            </p>
          </div>
        </div>

        {/* Point 2: Official Warranty */}
        <div className="flex items-start gap-3 sm:px-3 pt-3 sm:pt-0">
          <Award className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
          <div>
            <h4 className="text-xs font-semibold text-slate-900 leading-tight">
              Official Warranty
            </h4>
            <p className="text-[11px] text-slate-500 mt-0.5 leading-snug">
              {warranty}
            </p>
          </div>
        </div>

        {/* Point 3: Replacement Reliance */}
        <div className="flex items-start gap-3 sm:pl-3 pt-3 sm:pt-0">
          <RotateCcw className="w-5 h-5 text-indigo-600 flex-shrink-0 mt-0.5" />
          <div>
            <h4 className="text-xs font-semibold text-slate-900 leading-tight">
              7-Day Replacement
            </h4>
            <p className="text-[11px] text-slate-500 mt-0.5 leading-snug">
              {replacementPolicy}
            </p>
          </div>
        </div>

      </div>
    </div>
  );
};
