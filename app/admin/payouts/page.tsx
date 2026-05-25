'use client';
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';

type Payout = {
  id: string;
  payout_month: string;
  amount: number;
  subscription_fee_snapshot: number;
  commission_percent_snapshot: number;
  payment_method_snapshot: string;
  etransfer_id_snapshot: string | null;
  bank_details_snapshot: Record<string, string> | null;
  status: 'pending' | 'approved' | 'paid' | 'cancelled';
  paid_at: string | null;
  ara_partners: { full_name: string } | null;
  referrals: { property_address: string; landlord_name: string } | null;
};

type Partner = { id: string; full_name: string };
type Referral = { id: string; property_address: string; landlord_name: string; subscription_fee: number | null };

const STATUS_COLORS: Record<string, string> = {
  pending: 'bg-yellow-100 text-yellow-800',
  approved: 'bg-blue-100 text-blue-700',
  paid: 'bg-green-100 text-green-800',
  cancelled: 'bg-red-100 text-red-800',
};

export default function PayoutsPage() {
  const [payouts, setPayouts] = useState<Payout[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'pending' | 'approved' | 'paid' | 'cancelled'>('all');
  const [saving, setSaving] = useState<string | null>(null);

  // Generate payout modal state
  const [showModal, setShowModal] = useState(false);
  const [partners, setPartners] = useState<Partner[]>([]);
  const [selectedPartner, setSelectedPartner] = useState<string>('');
  const [referrals, setReferrals] = useState<Referral[]>([]);
  const [selectedReferrals, setSelectedReferrals] = useState<string[]>([]);
  const [loadingReferrals, setLoadingReferrals] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [generateMsg, setGenerateMsg] = useState('');

  const load = async () => {
    setLoading(true);
    const { data } = await supabase
      .from('payout_records')
      .select('*, ara_partners(full_name), referrals(property_address, landlord_name)')
      .order('payout_month', { ascending: false });
    setPayouts((data as any[]) || []);
    setLoading(false);
  };

  const loadPartners = async () => {
    const { data } = await supabase.from('ara_partners').select('id, full_name').order('full_name');
    setPartners(data || []);
  };

  useEffect(() => { load(); }, []);

  const openModal = async () => {
    setGenerateMsg('');
    setSelectedPartner('');
    setReferrals([]);
    setSelectedReferrals([]);
    await loadPartners();
    setShowModal(true);
  };

  const handlePartnerChange = async (partnerId: string) => {
    setSelectedPartner(partnerId);
    setSelectedReferrals([]);
    if (!partnerId) { setReferrals([]); return; }

    setLoadingReferrals(true);
    const { data } = await supabase
      .from('referrals')
      .select('id, property_address, landlord_name, subscription_fee')
      .eq('ara_partner_id', partnerId)
      .eq('status', 'approved');
    setReferrals(data || []);
    setSelectedReferrals((data || []).map((r: Referral) => r.id)); // select all by default
    setLoadingReferrals(false);
  };

  const toggleReferral = (id: string) => {
    setSelectedReferrals((prev) =>
      prev.includes(id) ? prev.filter((r) => r !== id) : [...prev, id]
    );
  };

  const handleGenerate = async () => {
    if (!selectedPartner || selectedReferrals.length === 0) return;
    setGenerating(true);
    setGenerateMsg('');
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_SUPABASE_URL}/functions/v1/generate-monthly-payouts`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ referral_ids: selectedReferrals }),
        }
      );
      const json = await res.json();
      if (json.success) {
        // Parse date parts directly to avoid UTC→local timezone shift
        const [y, m] = json.payout_month.split('-');
        const month = new Date(Number(y), Number(m) - 1, 1).toLocaleDateString('en-CA', { month: 'long', year: 'numeric' });
        const parts = [];
        if (json.generated > 0) parts.push(`✓ ${json.generated} payout(s) generated for ${month}.`);
        if (json.skipped > 0) parts.push(`${json.skipped} skipped (already exist for this month).`);
        setGenerateMsg(parts.join(' ') || `Nothing to generate for ${month}.`);
        load();
        setShowModal(false);
      } else {
        setGenerateMsg(`Error: ${json.error}`);
      }
    } catch (e: any) {
      setGenerateMsg(`Error: ${e.message}`);
    }
    setGenerating(false);
  };

  const updateStatus = async (id: string, status: Payout['status']) => {
    setSaving(id);
    await supabase
      .from('payout_records')
      .update({ status, paid_at: status === 'paid' ? new Date().toISOString() : null })
      .eq('id', id);
    await supabase.from('audit_log').insert({
      entity_type: 'payout_records',
      entity_id: id,
      action: `status_changed_to_${status}`,
    });
    setSaving(null);
    load();
  };

  const totalPaid = payouts.filter((p) => p.status === 'paid').reduce((s, p) => s + p.amount, 0);
  const totalPending = payouts.filter((p) => p.status === 'pending' || p.status === 'approved').reduce((s, p) => s + p.amount, 0);
  const filtered = filter === 'all' ? payouts : payouts.filter((p) => p.status === filter);

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-bold text-gray-900">Payouts</h1>
        <div className="flex items-center gap-3 text-sm">
          <div className="bg-green-50 border border-green-200 rounded-lg px-4 py-2 text-green-700 font-semibold">
            Paid: ${totalPaid.toFixed(2)}
          </div>
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg px-4 py-2 text-yellow-700 font-semibold">
            Pending: ${totalPending.toFixed(2)}
          </div>
          <button
            onClick={openModal}
            className="bg-blue-600 text-white rounded-lg px-4 py-2 font-semibold hover:bg-blue-700 transition-colors"
          >
            ⚡ Generate Payouts
          </button>
        </div>
      </div>

      {generateMsg && (
        <div className={`mb-4 px-4 py-3 rounded-lg text-sm font-medium ${generateMsg.startsWith('Error') ? 'bg-red-50 text-red-700 border border-red-200' : 'bg-green-50 text-green-700 border border-green-200'}`}>
          {generateMsg}
        </div>
      )}

      <div className="flex gap-2 mb-4">
        {(['all', 'pending', 'approved', 'paid', 'cancelled'] as const).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-4 py-2 rounded-lg text-sm font-medium border transition-colors ${filter === f ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50'}`}
          >
            {f.charAt(0).toUpperCase() + f.slice(1)}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="text-center py-20 text-gray-400">Loading...</div>
      ) : (
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="text-left px-4 py-3 font-semibold text-gray-600">Month</th>
                <th className="text-left px-4 py-3 font-semibold text-gray-600">AaraPartner</th>
                <th className="text-left px-4 py-3 font-semibold text-gray-600">Property</th>
                <th className="text-left px-4 py-3 font-semibold text-gray-600">Calculation</th>
                <th className="text-left px-4 py-3 font-semibold text-gray-600">Amount</th>
                <th className="text-left px-4 py-3 font-semibold text-gray-600">Payout To</th>
                <th className="text-left px-4 py-3 font-semibold text-gray-600">Status</th>
                <th className="px-4 py-3">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filtered.map((p) => (
                <tr key={p.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 text-gray-700 font-medium">
                    {new Date(p.payout_month).toLocaleDateString('en-CA', { month: 'long', year: 'numeric' })}
                  </td>
                  <td className="px-4 py-3 text-gray-600">{p.ara_partners?.full_name || '—'}</td>
                  <td className="px-4 py-3 text-gray-600 max-w-xs">
                    <div className="truncate">{p.referrals?.property_address || '—'}</div>
                    <div className="text-xs text-gray-400">{p.referrals?.landlord_name}</div>
                  </td>
                  <td className="px-4 py-3 text-gray-500 text-xs">
                    ${p.subscription_fee_snapshot} × {p.commission_percent_snapshot}%
                  </td>
                  <td className="px-4 py-3 font-bold text-gray-900">${p.amount.toFixed(2)}</td>
                  <td className="px-4 py-3 text-gray-600 text-xs">
                    {p.payment_method_snapshot === 'etransfer'
                      ? `e-Transfer: ${p.etransfer_id_snapshot || '—'}`
                      : `Bank: ${p.bank_details_snapshot?.account || '—'}`}
                  </td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-1 rounded-full text-xs font-semibold ${STATUS_COLORS[p.status]}`}>
                      {p.status.charAt(0).toUpperCase() + p.status.slice(1)}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex gap-1">
                      {p.status === 'pending' && (
                        <button onClick={() => updateStatus(p.id, 'approved')} disabled={saving === p.id}
                          className="text-xs bg-blue-50 text-blue-600 border border-blue-200 rounded px-2 py-1 hover:bg-blue-100 disabled:opacity-50">
                          Approve
                        </button>
                      )}
                      {p.status === 'approved' && (
                        <button onClick={() => updateStatus(p.id, 'paid')} disabled={saving === p.id}
                          className="text-xs bg-green-50 text-green-700 border border-green-200 rounded px-2 py-1 hover:bg-green-100 disabled:opacity-50">
                          Mark Paid
                        </button>
                      )}
                      {(p.status === 'pending' || p.status === 'approved') && (
                        <button onClick={() => updateStatus(p.id, 'cancelled')} disabled={saving === p.id}
                          className="text-xs bg-red-50 text-red-600 border border-red-200 rounded px-2 py-1 hover:bg-red-100 disabled:opacity-50">
                          Cancel
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr><td colSpan={8} className="px-4 py-12 text-center text-gray-400">No payout records yet</td></tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* Generate Payouts Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md">
            <div className="p-6 border-b border-gray-100 flex items-center justify-between">
              <h2 className="text-lg font-bold text-gray-900">Generate Payouts</h2>
              <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-gray-600 text-xl">✕</button>
            </div>

            <div className="p-6 space-y-5">
              {/* Partner selector */}
              <div>
                <label className="block text-xs font-semibold text-gray-500 mb-2">Select AaraPartner *</label>
                <select
                  value={selectedPartner}
                  onChange={(e) => handlePartnerChange(e.target.value)}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">— Choose a partner —</option>
                  {partners.map((p) => (
                    <option key={p.id} value={p.id}>{p.full_name}</option>
                  ))}
                </select>
              </div>

              {/* Referral checkboxes */}
              {selectedPartner && (
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="text-xs font-semibold text-gray-500">Select Properties *</label>
                    {referrals.length > 0 && (
                      <button
                        onClick={() => setSelectedReferrals(
                          selectedReferrals.length === referrals.length ? [] : referrals.map(r => r.id)
                        )}
                        className="text-xs text-blue-600 hover:underline"
                      >
                        {selectedReferrals.length === referrals.length ? 'Deselect all' : 'Select all'}
                      </button>
                    )}
                  </div>

                  {loadingReferrals ? (
                    <div className="text-center py-4 text-gray-400 text-sm">Loading...</div>
                  ) : referrals.length === 0 ? (
                    <div className="text-center py-4 text-gray-400 text-sm">No approved referrals for this partner.</div>
                  ) : (
                    <div className="border border-gray-200 rounded-lg divide-y divide-gray-100 max-h-56 overflow-y-auto">
                      {referrals.map((r) => (
                        <label key={r.id} className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={selectedReferrals.includes(r.id)}
                            onChange={() => toggleReferral(r.id)}
                            className="w-4 h-4 rounded accent-blue-600"
                          />
                          <div className="flex-1 min-w-0">
                            <div className="text-sm font-medium text-gray-800 truncate">{r.property_address}</div>
                            <div className="text-xs text-gray-400">{r.landlord_name} · ${r.subscription_fee}/mo</div>
                          </div>
                        </label>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {generateMsg && (
                <div className="bg-red-50 text-red-700 border border-red-200 px-4 py-2 rounded-lg text-sm">
                  {generateMsg}
                </div>
              )}

              <div className="flex gap-3 pt-1">
                <button
                  onClick={handleGenerate}
                  disabled={generating || selectedReferrals.length === 0}
                  className="flex-1 bg-blue-600 text-white rounded-lg py-2.5 text-sm font-semibold hover:bg-blue-700 disabled:opacity-50 transition-colors"
                >
                  {generating ? 'Generating...' : `Generate for ${selectedReferrals.length} propert${selectedReferrals.length === 1 ? 'y' : 'ies'}`}
                </button>
                <button onClick={() => setShowModal(false)} className="px-5 bg-gray-100 text-gray-600 rounded-lg py-2.5 text-sm font-semibold hover:bg-gray-200">
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
