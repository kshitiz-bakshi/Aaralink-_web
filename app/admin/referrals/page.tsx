'use client';
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';

type Referral = {
  id: string;
  property_address: string;
  landlord_name: string;
  landlord_phone: string;
  landlord_email: string;
  status: 'pending' | 'approved' | 'rejected';
  subscription_fee: number | null;
  notes: string | null;
  created_at: string;
  approved_at: string | null;
  ara_partners: { full_name: string } | null;
  commission_rules: { id: string; commission_percent: number; start_date: string; end_date: string | null }[];
};

type CommissionForm = {
  commissionPercent: string;
  startDate: string;
  endDate: string;
  subscriptionFee: string;
};

const STATUS_COLORS: Record<string, string> = {
  pending: 'bg-yellow-100 text-yellow-800',
  approved: 'bg-green-100 text-green-800',
  rejected: 'bg-red-100 text-red-800',
};

export default function ReferralsPage() {
  const [referrals, setReferrals] = useState<Referral[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'pending' | 'approved' | 'rejected'>('all');
  const [selected, setSelected] = useState<Referral | null>(null);
  const [form, setForm] = useState<CommissionForm>({ commissionPercent: '', startDate: '', endDate: '', subscriptionFee: '' });
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');

  const load = async () => {
    setLoading(true);
    const { data } = await supabase
      .from('referrals')
      .select('*, ara_partners(full_name), commission_rules(*)')
      .order('created_at', { ascending: false });
    setReferrals((data as any[]) || []);
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const openDetail = (r: Referral) => {
    setSelected(r);
    const active = r.commission_rules?.find((c) => !c.end_date);
    setForm({
      commissionPercent: active ? String(active.commission_percent) : '',
      startDate: active?.start_date ?? new Date().toISOString().slice(0, 10),
      endDate: active?.end_date ?? '',
      subscriptionFee: r.subscription_fee ? String(r.subscription_fee) : '',
    });
    setMessage('');
  };

  const handleApprove = async () => {
    if (!selected) return;
    if (!form.commissionPercent || !form.startDate || !form.subscriptionFee) {
      setMessage('Commission %, Start Date, and Subscription Fee are required to approve.');
      return;
    }
    setSaving(true);

    // Terminate existing active rule
    const active = selected.commission_rules?.find((c) => !c.end_date);
    if (active) {
      await supabase
        .from('commission_rules')
        .update({ end_date: new Date().toISOString().split('T')[0] })
        .eq('id', active.id);
    }

    // Insert new commission rule
    await supabase.from('commission_rules').insert({
      referral_id: selected.id,
      commission_percent: parseFloat(form.commissionPercent),
      start_date: form.startDate,
      end_date: form.endDate || null,
    });

    // Update referral status and subscription fee
    await supabase
      .from('referrals')
      .update({
        status: 'approved',
        subscription_fee: parseFloat(form.subscriptionFee),
        approved_at: new Date().toISOString(),
        notes: selected.notes,
      })
      .eq('id', selected.id);

    // Audit log
    await supabase.from('audit_log').insert({
      entity_type: 'referral',
      entity_id: selected.id,
      action: 'approved',
      new_values: { commission_percent: form.commissionPercent, subscription_fee: form.subscriptionFee },
    });

    setSaving(false);
    setSelected(null);
    load();
  };

  const handleReject = async () => {
    if (!selected) return;
    setSaving(true);
    await supabase.from('referrals').update({ status: 'rejected' }).eq('id', selected.id);
    await supabase.from('audit_log').insert({
      entity_type: 'referral',
      entity_id: selected.id,
      action: 'rejected',
    });
    setSaving(false);
    setSelected(null);
    load();
  };

  const handleUpdateCommission = async () => {
    if (!selected || !form.commissionPercent || !form.startDate) {
      setMessage('Commission % and Start Date are required.');
      return;
    }
    setSaving(true);
    const active = selected.commission_rules?.find((c) => !c.end_date);
    if (active) {
      await supabase
        .from('commission_rules')
        .update({ end_date: form.startDate })
        .eq('id', active.id);
    }
    await supabase.from('commission_rules').insert({
      referral_id: selected.id,
      commission_percent: parseFloat(form.commissionPercent),
      start_date: form.startDate,
      end_date: form.endDate || null,
    });
    if (form.subscriptionFee) {
      await supabase
        .from('referrals')
        .update({ subscription_fee: parseFloat(form.subscriptionFee) })
        .eq('id', selected.id);
    }
    await supabase.from('audit_log').insert({
      entity_type: 'commission_rules',
      entity_id: selected.id,
      action: 'updated',
      new_values: { commission_percent: form.commissionPercent, start_date: form.startDate },
    });
    setSaving(false);
    setMessage('Commission updated.');
    load();
  };

  const filtered = filter === 'all' ? referrals : referrals.filter((r) => r.status === filter);

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Referrals</h1>
        <div className="flex gap-2">
          {(['all', 'pending', 'approved', 'rejected'] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-2 rounded-lg text-sm font-medium border transition-colors ${filter === f ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50'}`}
            >
              {f.charAt(0).toUpperCase() + f.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="text-center py-20 text-gray-400">Loading...</div>
      ) : (
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="text-left px-4 py-3 font-semibold text-gray-600">Property Address</th>
                <th className="text-left px-4 py-3 font-semibold text-gray-600">Landlord</th>
                <th className="text-left px-4 py-3 font-semibold text-gray-600">AaraPartner</th>
                <th className="text-left px-4 py-3 font-semibold text-gray-600">Commission</th>
                <th className="text-left px-4 py-3 font-semibold text-gray-600">Sub. Fee</th>
                <th className="text-left px-4 py-3 font-semibold text-gray-600">Status</th>
                <th className="text-left px-4 py-3 font-semibold text-gray-600">Submitted</th>
                <th className="px-4 py-3"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filtered.map((r) => {
                const activeRule = r.commission_rules?.find((c) => !c.end_date);
                return (
                  <tr key={r.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-3 font-medium text-gray-900 max-w-xs">{r.property_address}</td>
                    <td className="px-4 py-3 text-gray-600">
                      <div>{r.landlord_name}</div>
                      <div className="text-xs text-gray-400">{r.landlord_email || r.landlord_phone}</div>
                    </td>
                    <td className="px-4 py-3 text-gray-600">{r.ara_partners?.full_name || '—'}</td>
                    <td className="px-4 py-3 text-gray-600">{activeRule ? `${activeRule.commission_percent}%` : '—'}</td>
                    <td className="px-4 py-3 text-gray-600">{r.subscription_fee ? `$${r.subscription_fee}` : '—'}</td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-1 rounded-full text-xs font-semibold ${STATUS_COLORS[r.status]}`}>
                        {r.status.charAt(0).toUpperCase() + r.status.slice(1)}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-gray-400 text-xs">
                      {new Date(r.created_at).toLocaleDateString('en-CA')}
                    </td>
                    <td className="px-4 py-3">
                      <button
                        onClick={() => openDetail(r)}
                        className="text-blue-600 hover:underline text-xs font-medium"
                      >
                        Manage
                      </button>
                    </td>
                  </tr>
                );
              })}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={8} className="px-4 py-12 text-center text-gray-400">No referrals found</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* Detail Modal */}
      {selected && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg">
            <div className="p-6 border-b border-gray-100">
              <div className="flex items-start justify-between">
                <div>
                  <h2 className="text-lg font-bold text-gray-900">{selected.property_address}</h2>
                  <p className="text-sm text-gray-500 mt-1">{selected.landlord_name} · {selected.landlord_email || selected.landlord_phone}</p>
                </div>
                <button onClick={() => setSelected(null)} className="text-gray-400 hover:text-gray-600 text-xl">✕</button>
              </div>
            </div>

            <div className="p-6 space-y-4">
              {message && <div className="bg-blue-50 text-blue-700 text-sm px-4 py-2 rounded-lg">{message}</div>}

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-500 mb-1">Commission % *</label>
                  <input
                    type="number"
                    value={form.commissionPercent}
                    onChange={(e) => setForm({ ...form, commissionPercent: e.target.value })}
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="e.g. 10"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-500 mb-1">Subscription Fee/mo ($) *</label>
                  <input
                    type="number"
                    value={form.subscriptionFee}
                    onChange={(e) => setForm({ ...form, subscriptionFee: e.target.value })}
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="e.g. 150"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-500 mb-1">Commission Start Date *</label>
                  <input
                    type="date"
                    value={form.startDate}
                    onChange={(e) => setForm({ ...form, startDate: e.target.value })}
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-500 mb-1">Commission End Date</label>
                  <input
                    type="date"
                    value={form.endDate}
                    onChange={(e) => setForm({ ...form, endDate: e.target.value })}
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div className="flex gap-3 pt-2">
                {selected.status === 'pending' && (
                  <>
                    <button
                      onClick={handleApprove}
                      disabled={saving}
                      className="flex-1 bg-green-600 text-white rounded-lg py-2.5 text-sm font-semibold hover:bg-green-700 disabled:opacity-50"
                    >
                      {saving ? 'Saving...' : 'Approve'}
                    </button>
                    <button
                      onClick={handleReject}
                      disabled={saving}
                      className="flex-1 bg-red-50 text-red-600 border border-red-200 rounded-lg py-2.5 text-sm font-semibold hover:bg-red-100 disabled:opacity-50"
                    >
                      Reject
                    </button>
                  </>
                )}
                {selected.status === 'approved' && (
                  <button
                    onClick={handleUpdateCommission}
                    disabled={saving}
                    className="flex-1 bg-blue-600 text-white rounded-lg py-2.5 text-sm font-semibold hover:bg-blue-700 disabled:opacity-50"
                  >
                    {saving ? 'Saving...' : 'Update Commission'}
                  </button>
                )}
                <button onClick={() => setSelected(null)} className="px-6 bg-gray-100 text-gray-600 rounded-lg py-2.5 text-sm font-semibold hover:bg-gray-200">
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
