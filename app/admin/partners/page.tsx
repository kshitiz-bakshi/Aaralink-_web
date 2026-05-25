'use client';
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';

type Partner = {
  id: string;
  full_name: string;
  email: string | null;
  phone: string | null;
  payment_method: string;
  etransfer_id: string | null;
  bank_transit: string | null;
  bank_routing: string | null;
  bank_account: string | null;
  created_at: string;
  referral_count?: number;
};

type Referral = {
  id: string;
  property_address: string;
  landlord_name: string;
  landlord_phone: string | null;
  landlord_email: string | null;
  status: 'pending' | 'approved' | 'rejected';
  subscription_fee: number | null;
  created_at: string;
  commission_rules: { commission_percent: number; start_date: string; end_date: string | null }[];
};

const STATUS_COLORS: Record<string, string> = {
  approved: 'bg-green-100 text-green-700',
  pending:  'bg-yellow-100 text-yellow-700',
  rejected: 'bg-red-100 text-red-700',
};

export default function PartnersPage() {
  const [partners, setPartners] = useState<Partner[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<Partner | null>(null);

  // Referrals modal
  const [referralsPartner, setReferralsPartner] = useState<Partner | null>(null);
  const [referrals, setReferrals] = useState<Referral[]>([]);
  const [loadingReferrals, setLoadingReferrals] = useState(false);

  const load = async () => {
    setLoading(true);
    const { data } = await supabase
      .from('ara_partners')
      .select('*')
      .order('created_at', { ascending: false });

    if (data) {
      const withCounts = await Promise.all(
        data.map(async (p) => {
          const { count } = await supabase
            .from('referrals')
            .select('*', { count: 'exact', head: true })
            .eq('ara_partner_id', p.id);
          return { ...p, referral_count: count || 0 };
        })
      );
      setPartners(withCounts);
    }
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const openReferrals = async (partner: Partner) => {
    setReferralsPartner(partner);
    setReferrals([]);
    setLoadingReferrals(true);
    const { data } = await supabase
      .from('referrals')
      .select('*, commission_rules(commission_percent, start_date, end_date)')
      .eq('ara_partner_id', partner.id)
      .order('created_at', { ascending: false });
    setReferrals((data as any[]) || []);
    setLoadingReferrals(false);
  };

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">AaraPartners</h1>

      {loading ? (
        <div className="text-center py-20 text-gray-400">Loading...</div>
      ) : (
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="text-left px-4 py-3 font-semibold text-gray-600">Name</th>
                <th className="text-left px-4 py-3 font-semibold text-gray-600">Phone</th>
                <th className="text-left px-4 py-3 font-semibold text-gray-600">Payout Method</th>
                <th className="text-left px-4 py-3 font-semibold text-gray-600">Referrals</th>
                <th className="text-left px-4 py-3 font-semibold text-gray-600">Joined</th>
                <th className="px-4 py-3"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {partners.map((p) => (
                <tr key={p.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3">
                    <div className="font-medium text-gray-900">{p.full_name}</div>
                    <div className="text-xs text-gray-400">{p.email || '—'}</div>
                  </td>
                  <td className="px-4 py-3 text-gray-600">{p.phone || '—'}</td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-1 rounded-full text-xs font-semibold ${p.payment_method === 'etransfer' ? 'bg-blue-100 text-blue-700' : 'bg-purple-100 text-purple-700'}`}>
                      {p.payment_method === 'etransfer' ? 'e-Transfer' : 'Bank'}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    {(p.referral_count ?? 0) > 0 ? (
                      <button
                        onClick={() => openReferrals(p)}
                        className="inline-flex items-center gap-1 bg-blue-50 text-blue-600 border border-blue-200 rounded-full px-3 py-0.5 text-xs font-semibold hover:bg-blue-100 transition-colors"
                      >
                        {p.referral_count} referral{p.referral_count !== 1 ? 's' : ''} →
                      </button>
                    ) : (
                      <span className="text-gray-400 text-xs">0</span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-gray-400 text-xs">{new Date(p.created_at).toLocaleDateString('en-CA')}</td>
                  <td className="px-4 py-3">
                    <button onClick={() => setSelected(p)} className="text-blue-600 hover:underline text-xs font-medium">
                      Details
                    </button>
                  </td>
                </tr>
              ))}
              {partners.length === 0 && (
                <tr><td colSpan={6} className="px-4 py-12 text-center text-gray-400">No partners yet</td></tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* Referrals Modal */}
      {referralsPartner && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[85vh] flex flex-col">
            <div className="p-6 border-b border-gray-100 flex items-center justify-between flex-shrink-0">
              <div>
                <h2 className="text-lg font-bold text-gray-900">{referralsPartner.full_name}&apos;s Referrals</h2>
                <p className="text-sm text-gray-400 mt-0.5">{referrals.length} propert{referrals.length !== 1 ? 'ies' : 'y'} referred</p>
              </div>
              <button onClick={() => setReferralsPartner(null)} className="text-gray-400 hover:text-gray-600 text-xl">✕</button>
            </div>

            <div className="overflow-y-auto p-6 flex flex-col gap-3">
              {loadingReferrals ? (
                <div className="text-center py-12 text-gray-400">Loading...</div>
              ) : referrals.length === 0 ? (
                <div className="text-center py-12 text-gray-400">No referrals found.</div>
              ) : (
                referrals.map((r) => {
                  const activeRule = r.commission_rules?.find((c) => !c.end_date);
                  return (
                    <div key={r.id} className="border border-gray-200 rounded-xl p-4 hover:border-blue-200 hover:bg-blue-50/30 transition-colors">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="font-semibold text-gray-900 text-sm">{r.property_address}</span>
                            <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${STATUS_COLORS[r.status]}`}>
                              {r.status.charAt(0).toUpperCase() + r.status.slice(1)}
                            </span>
                          </div>
                          <p className="text-sm text-gray-500 mt-1">{r.landlord_name}</p>
                          <div className="flex gap-4 mt-2 text-xs text-gray-400">
                            {r.landlord_phone && <span>📞 {r.landlord_phone}</span>}
                            {r.landlord_email && <span>✉️ {r.landlord_email}</span>}
                          </div>
                        </div>
                        <div className="text-right flex-shrink-0">
                          {r.subscription_fee && (
                            <div className="text-sm font-semibold text-gray-700">${r.subscription_fee}/mo</div>
                          )}
                          {activeRule && (
                            <div className="text-xs text-blue-600 font-medium mt-0.5">{activeRule.commission_percent}% commission</div>
                          )}
                          <div className="text-xs text-gray-400 mt-1">
                            {new Date(r.created_at).toLocaleDateString('en-CA', { month: 'short', day: 'numeric', year: 'numeric' })}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>
      )}

      {/* Partner Detail Modal */}
      {selected && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md">
            <div className="p-6 border-b border-gray-100 flex items-center justify-between">
              <h2 className="text-lg font-bold text-gray-900">{selected.full_name}</h2>
              <button onClick={() => setSelected(null)} className="text-gray-400 hover:text-gray-600 text-xl">✕</button>
            </div>
            <div className="p-6 space-y-3 text-sm">
              <Row label="Email" value={selected.email || '—'} />
              <Row label="Phone" value={selected.phone || '—'} />
              <Row label="Payout Method" value={selected.payment_method === 'etransfer' ? 'e-Transfer' : 'Bank Account'} />
              {selected.payment_method === 'etransfer' && (
                <Row label="e-Transfer ID" value={selected.etransfer_id || '—'} />
              )}
              {selected.payment_method === 'bank' && (
                <>
                  <Row label="Transit #" value={selected.bank_transit || '—'} />
                  <Row label="Institution #" value={selected.bank_routing || '—'} />
                  <Row label="Account #" value={selected.bank_account || '—'} />
                </>
              )}
              <Row label="Joined" value={new Date(selected.created_at).toLocaleDateString('en-CA')} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between">
      <span className="font-semibold text-gray-500">{label}</span>
      <span className="text-gray-800">{value}</span>
    </div>
  );
}
