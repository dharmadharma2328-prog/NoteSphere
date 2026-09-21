import { useEffect, useState } from 'react';
import { AlertTriangle, Check, FileText, RefreshCw, Shield, Users, X } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { adminApi } from '../services/api/adminApi';

const statusStyles = {
  approved: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400',
  rejected: 'bg-red-500/10 text-red-600 dark:text-red-400',
  flagged: 'bg-amber-500/10 text-amber-600 dark:text-amber-400',
  pending: 'bg-slate-500/10 text-slate-600 dark:text-slate-300'
};

const AdminPage = () => {
  const { user, addToast } = useApp();
  const [stats, setStats] = useState({});
  const [resources, setResources] = useState([]);
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [busyId, setBusyId] = useState('');

  const loadAdminData = async () => {
    setLoading(true);
    try {
      const [dashboard, resourceData, reportData] = await Promise.all([
        adminApi.getDashboard(),
        adminApi.getResources(),
        adminApi.getReports()
      ]);
      setStats(dashboard.stats || {});
      setResources(resourceData.resources || []);
      setReports(reportData.reports || []);
    } catch (err) {
      addToast(err.message || 'Could not load administrator data.', 'warning');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user.role === 'Admin') loadAdminData();
  }, [user.role]);

  const moderateResource = async (id, status) => {
    setBusyId(id);
    try {
      await adminApi.updateResourceModeration(id, status);
      setResources(prev => prev.map(resource => resource.id === id ? { ...resource, status } : resource));
      addToast(`Resource marked ${status}.`, 'success');
    } catch (err) {
      addToast(err.message || 'Could not update resource status.', 'warning');
    } finally {
      setBusyId('');
    }
  };

  const resolveReport = async (id, resolution) => {
    setBusyId(id);
    try {
      await adminApi.resolveReport(id, resolution);
      setReports(prev => prev.map(report => report.id === id ? { ...report, status: resolution } : report));
      addToast('Report resolved.', 'success');
    } catch (err) {
      addToast(err.message || 'Could not resolve report.', 'warning');
    } finally {
      setBusyId('');
    }
  };

  if (user.role !== 'Admin') {
    return <div className="glass-panel rounded-3xl bg-white p-8 text-center dark:bg-slate-900"><Shield className="mx-auto mb-3 h-8 w-8 text-slate-400" /><h1 className="font-heading text-lg font-bold dark:text-white">Administrator access required</h1></div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div><h1 className="font-heading text-xl font-bold dark:text-white">Admin moderation</h1><p className="mt-1 text-xs text-slate-400">Review platform activity, resources, and user reports.</p></div>
        <button onClick={loadAdminData} disabled={loading} title="Refresh admin data" className="rounded-xl border border-slate-200 bg-white p-3 text-slate-500 hover:text-sky-500 disabled:opacity-50 dark:border-slate-800 dark:bg-slate-900"><RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} /></button>
      </div>

      <div className="grid grid-cols-2 gap-3 lg:grid-cols-5">
        {[['Users', stats.totalUsers, Users], ['Resources', stats.totalResources, FileText], ['Downloads', stats.totalDownloads, FileText], ['Pending reports', stats.pendingReports, AlertTriangle], ['Tests', stats.totalMockTests, FileText]].map(([label, value, Icon]) => (
          <div key={label} className="rounded-2xl border border-slate-200/60 bg-white p-4 dark:border-slate-800/60 dark:bg-slate-900"><Icon className="mb-3 h-4 w-4 text-sky-500" /><p className="text-xl font-bold dark:text-white">{value ?? '-'}</p><p className="mt-1 text-[10px] text-slate-400">{label}</p></div>
        ))}
      </div>

      <section className="rounded-2xl border border-slate-200/60 bg-white dark:border-slate-800/60 dark:bg-slate-900">
        <div className="border-b border-slate-200/60 p-5 dark:border-slate-800/60"><h2 className="font-heading text-sm font-bold dark:text-white">Resource moderation</h2></div>
        <div className="divide-y divide-slate-200/60 dark:divide-slate-800/60">
          {resources.length === 0 && <p className="p-5 text-xs text-slate-400">No resources to review.</p>}
          {resources.map(resource => <div key={resource.id} className="flex flex-wrap items-center justify-between gap-3 p-5"><div className="min-w-0"><p className="truncate text-sm font-semibold dark:text-white">{resource.title}</p><p className="mt-1 text-[11px] text-slate-400">{resource.uploader_name || 'Unknown uploader'} · {resource.resource_type || 'Resource'}</p></div><div className="flex items-center gap-2"><span className={`rounded-full px-2 py-1 text-[10px] font-bold ${statusStyles[resource.status] || statusStyles.pending}`}>{resource.status}</span><button onClick={() => moderateResource(resource.id, 'approved')} disabled={busyId === resource.id} title="Approve resource" className="rounded-lg p-2 text-emerald-500 hover:bg-emerald-500/10 disabled:opacity-50"><Check className="h-4 w-4" /></button><button onClick={() => moderateResource(resource.id, 'rejected')} disabled={busyId === resource.id} title="Reject resource" className="rounded-lg p-2 text-red-500 hover:bg-red-500/10 disabled:opacity-50"><X className="h-4 w-4" /></button></div></div>)}
        </div>
      </section>

      <section className="rounded-2xl border border-slate-200/60 bg-white dark:border-slate-800/60 dark:bg-slate-900">
        <div className="border-b border-slate-200/60 p-5 dark:border-slate-800/60"><h2 className="font-heading text-sm font-bold dark:text-white">User reports</h2></div>
        <div className="divide-y divide-slate-200/60 dark:divide-slate-800/60">
          {reports.length === 0 && <p className="p-5 text-xs text-slate-400">No reports have been submitted.</p>}
          {reports.map(report => <div key={report.id} className="flex flex-wrap items-center justify-between gap-3 p-5"><div className="min-w-0"><p className="text-sm font-semibold dark:text-white">{report.reason}</p><p className="mt-1 text-[11px] text-slate-400">{report.target_type} · reported by {report.reporter_name || 'Unknown user'}</p></div><div className="flex items-center gap-2"><span className={`rounded-full px-2 py-1 text-[10px] font-bold ${statusStyles[report.status] || statusStyles.pending}`}>{report.status}</span>{report.status === 'pending' && <><button onClick={() => resolveReport(report.id, 'resolved')} disabled={busyId === report.id} className="rounded-lg bg-emerald-500 px-3 py-2 text-[10px] font-bold text-white disabled:opacity-50">Resolve</button><button onClick={() => resolveReport(report.id, 'dismissed')} disabled={busyId === report.id} className="rounded-lg border border-slate-200 px-3 py-2 text-[10px] font-bold text-slate-500 dark:border-slate-700 dark:text-slate-300">Dismiss</button></>}</div></div>)}
        </div>
      </section>
    </div>
  );
};

export default AdminPage;
