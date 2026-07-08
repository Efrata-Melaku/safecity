import { useEffect, useMemo, useState, type ChangeEvent } from 'react';
import { Search } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { Link } from "react-router-dom";


import {
  addReportNote,
  archiveReport,
  assignReport,
  getDashboardStats,
  getReport,
  getReports,
  getStaff,
  logReportCall,
  restoreReport,
  sendReportEmail,
  sendReportSms,
  updateReportStatus,
} from '../services/api';
import type { DashboardStats, ReportDetail, ReportResponse, StaffItem } from '../types';

export function AdminDashboardPage() {
  const { language } = useLanguage();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  
  const [reports, setReports] = useState<ReportResponse[]>([]);
  const [staff, setStaff] = useState<StaffItem[]>([]);
  const [selectedReport, setSelectedReport] = useState<ReportDetail | null>(null);
  const [search, setSearch] = useState('');
  const [showArchived, setShowArchived] = useState(false);
  const [loadingReports, setLoadingReports] = useState(false);
  const [noteValue, setNoteValue] = useState('');
  const [emailDraft, setEmailDraft] = useState({ recipient: '', subject: '', message: '' });

  const fetchData = async () => {
    setLoadingReports(true);
    try {
      const [statsRes, reportsRes, staffRes] = await Promise.all([
        getDashboardStats(),
        getReports(showArchived),
        getStaff(),
      ]);
      setStats(statsRes.stats || null);
      setReports(reportsRes.reports || []);
      setStaff(staffRes.staff || []);
    } catch {
      setStats(null);
      setReports([]);
      setStaff([]);
    } finally {
      setLoadingReports(false);
    }
  };

  useEffect(() => {
    void fetchData();
  }, [showArchived]);

  const filteredReports = useMemo(() => {
    const query = search.trim().toLowerCase();
    return reports.filter((report) => {
      const text = [report.claimCode, report.status, report.priority, report.assignedStaff?.email, report.assignedStaff?.name]
        .filter(Boolean)
        .join(' ')
        .toLowerCase();
      return !query || text.includes(query);
    });
  }, [reports, search]);

  const openReport = async (report: ReportResponse) => {
    try {
      const response = await getReport(report.id);
      setSelectedReport(response.report || null);
      if (response.report) {
        setEmailDraft({
          recipient: response.report.reporterEmail || response.report.contactValue || '',
          subject: `Update on report ${response.report.claimCode}`,
          message: '',
        });
      }
    } catch {
      setSelectedReport(null);
    }
  };

  const refreshSelectedReport = async () => {
    if (!selectedReport) return;
    try {
      const response = await getReport(selectedReport.id);
      setSelectedReport(response.report || null);
    } catch {
      // ignore
    }
  };

  const handleStatusChange = async (event: ChangeEvent<HTMLSelectElement>) => {
    if (!selectedReport) return;
    await updateReportStatus(selectedReport.id, { status: event.target.value });
    await refreshSelectedReport();
  };

  const handlePriorityChange = async (event: ChangeEvent<HTMLSelectElement>) => {
    if (!selectedReport) return;
    await updateReportStatus(selectedReport.id, { status: selectedReport.status, priority: event.target.value });
    await refreshSelectedReport();
  };

  const handleAddNote = async () => {
    if (!selectedReport || !noteValue.trim()) return;
    await addReportNote(selectedReport.id, { content: noteValue.trim() });
    setNoteValue('');
    await refreshSelectedReport();
  };

  const handleAssign = async (event: ChangeEvent<HTMLSelectElement>) => {
    if (!selectedReport) return;
    await assignReport(selectedReport.id, { adminId: event.target.value });
    await refreshSelectedReport();
    await fetchData();
  };

  // email send handled inline when admin clicks Email

  const handleCall = async () => {
    if (!selectedReport) return;
    await logReportCall(selectedReport.id, { recipient: selectedReport.contactValue || selectedReport.reporterPhone || '' });
    await refreshSelectedReport();
  };

  const handleSms = async () => {
    if (!selectedReport) return;
    await sendReportSms(selectedReport.id, {
      recipient: selectedReport.contactValue || selectedReport.reporterPhone || '',
      message: 'We are following up on your report.',
    });
    await refreshSelectedReport();
  };

  const handleArchive = async () => {
    if (!selectedReport) return;
    await archiveReport(selectedReport.id);
    await refreshSelectedReport();
    await fetchData();
  };

  const handleRestore = async () => {
    if (!selectedReport) return;
    await restoreReport(selectedReport.id);
    await refreshSelectedReport();
    await fetchData();
  };

  return (
    <div className="space-y-8">
      <div className="rounded-3xl bg-white p-8 shadow-sm">
        <h1 className="text-3xl font-semibold">{language === 'en' ? 'Admin dashboard' : '??????? ?????'}</h1>
        <p className="mt-3 text-sm text-slate-600">{language === 'en' ? 'Monitor reports, resources, and accountability actions.' : '??????? ????? ?? ??????? ??????? ??????'}</p>
      </div>
<div className="flex gap-3">
  <Link
    to="/admin-resources"
    className="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-semibold text-white"
  >
    Manage Resources
  </Link>
</div>
      <div className="grid gap-4 md:grid-cols-4">
        {stats ? (
          [
            { label: language === 'en' ? 'Pending' : '????? ??', value: stats.pending },
            { label: language === 'en' ? 'In Progress' : '???? ??', value: stats.inProgress },
            { label: language === 'en' ? 'Resolved' : '?????', value: stats.resolved },
            { label: language === 'en' ? 'Critical' : '?????', value: stats.critical },
          ].map((card) => (
            <div key={card.label} className="rounded-2xl bg-slate-900 p-5 text-white shadow-sm">
              <div className="text-sm text-slate-300">{card.label}</div>
              <div className="mt-3 text-3xl font-semibold">{card.value}</div>
            </div>
          ))
        ) : null}
      </div>

      <div className="rounded-3xl bg-white p-6 shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h2 className="text-xl font-semibold">{language === 'en' ? 'Report queue' : '????? ???'}</h2>
          <div className="flex items-center gap-2 rounded-full border border-slate-200 px-3 py-2 text-sm">
            <Search size={16} />
            <input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              className="w-44 bg-transparent outline-none"
              placeholder={language === 'en' ? 'Search reports' : '?????? ???'}
            />
          </div>
        </div>

        <div className="mt-4 flex flex-wrap gap-3 items-center">
          <label className="flex items-center gap-2 rounded-full border border-slate-200 px-3 py-2 text-sm">
            <input type="checkbox" checked={showArchived} onChange={() => setShowArchived((value) => !value)} />
            {language === 'en' ? 'Show archived' : '????? ???? ???'}
          </label>
          <span className="text-sm text-slate-500">{loadingReports ? (language === 'en' ? 'Loading reports�' : '????? ???? ??...') : `${filteredReports.length} ${language === 'en' ? 'reports' : '?????'}`}</span>
        </div>

        <div className="mt-6 grid gap-3 lg:grid-cols-[0.65fr_0.35fr]">
          <div className="space-y-3">
            {filteredReports.map((report) => (
              <button
                key={report.id}
                type="button"
                onClick={() => void openReport(report)}
                className="flex w-full justify-between rounded-2xl border border-slate-200 p-4 text-left hover:border-emerald-400"
              >
                <div>
                  <div className="font-semibold">{report.claimCode}</div>
                  <div className="text-sm text-slate-600">{report.status} � {report.priority}</div>
                </div>
                <div className="text-sm text-slate-600">{report.assignedStaff?.name || report.assignedStaff?.email || (language === 'en' ? 'Unassigned' : '??????')}</div>
              </button>
            ))}
          </div>

          {selectedReport ? (
  <div className="space-y-4 rounded-3xl border border-slate-200 p-4">

    {/* Header */}
    <div className="flex items-center justify-between gap-3">
      <div>
        <div className="text-xl font-semibold">
          {selectedReport.claimCode}
        </div>
        <div className="text-sm text-slate-500">
          {language === 'en'
            ? 'Complete report details'
            : '????? ????'}
        </div>
      </div>

      <div className="flex gap-2">
        <button
          type="button"
          onClick={() => void handleArchive()}
          className="rounded-full border px-3 py-2 text-sm"
        >
          Archive
        </button>

        <button
          type="button"
          onClick={() => void handleRestore()}
          className="rounded-full border px-3 py-2 text-sm"
        >
          Restore
        </button>
      </div>
    </div>


    {/* Main Report Information */}
    <div className="rounded-2xl bg-slate-50 p-4">

      <h3 className="font-semibold text-lg">
        Report Information
      </h3>


      <div className="mt-4 grid gap-4 sm:grid-cols-2">


        <div>
          <p className="text-sm text-slate-500">
            Claim Code
          </p>
          <p>{selectedReport.claimCode}</p>
        </div>


        <div>
          <p className="text-sm text-slate-500">
            Abuse Type
          </p>
          <p>{selectedReport.abuseType}</p>
        </div>


        <div>
          <p className="text-sm text-slate-500">
            Location
          </p>
          <p>{selectedReport.location}</p>
        </div>


        <div>
          <p className="text-sm text-slate-500">
            Incident Date
          </p>

          <p>
            {
              selectedReport.incidentDate
              ? new Date(
                selectedReport.incidentDate
              ).toLocaleDateString()
              : "Not provided"
            }
          </p>

        </div>



        <div>
          <p className="text-sm text-slate-500">
            Priority
          </p>
          <p>{selectedReport.priority}</p>
        </div>


        <div>
          <p className="text-sm text-slate-500">
            Status
          </p>
          <p>{selectedReport.status}</p>
        </div>



        <div>
          <p className="text-sm text-slate-500">
            Contact Preference
          </p>
          <p>
            {selectedReport.contactPreference}
          </p>
        </div>


        <div>
          <p className="text-sm text-slate-500">
            Anonymous
          </p>

          <p>
            {selectedReport.anonymous
              ? "Yes"
              : "No"}
          </p>

        </div>


      </div>


      <div className="mt-4">

        <p className="text-sm text-slate-500">
          Description
        </p>

        <p className="mt-2 text-sm">
          {selectedReport.description}
        </p>

      </div>


    </div>


<div className="grid gap-3 sm:grid-cols-2">
                  <select value={selectedReport.status} onChange={handleStatusChange} className="rounded-2xl border border-slate-200 px-3 py-2">
                    <option value="pending">Pending</option>
                    <option value="in_progress">In progress</option>
                    <option value="resolved">Resolved</option>
                  </select>
                  <select value={selectedReport.priority || 'medium'} onChange={handlePriorityChange} className="rounded-2xl border border-slate-200 px-3 py-2">
                    <option value="high">High</option>
                    <option value="medium">Medium</option>
                    <option value="low">Low</option>
                  </select>
                </div>

    {/* Reporter Contact */}
    <div className="rounded-2xl bg-slate-50 p-4">

      <h3 className="font-semibold text-lg">
        Reporter Contact
      </h3>


      <div className="mt-3 space-y-2">

        <p>
          Email:
          {" "}
          {selectedReport.reporterEmail || "Not provided"}
        </p>


        <p>
          Phone:
          {" "}
          {selectedReport.reporterPhone || "Not provided"}
        </p>


        <p>
          Contact:
          {" "}
          {selectedReport.contactValue || "Not provided"}
        </p>


      </div>


    </div>




    {/* Assignment */}
    <div className="rounded-2xl bg-slate-50 p-4">

      <h3 className="font-semibold">
        Assigned Staff
      </h3>


      <select
        value={
          selectedReport.assignedStaff?.id || ''
        }
        onChange={handleAssign}
        className="mt-3 w-full rounded-2xl border px-3 py-2"
      >

        <option value="">
          Unassigned
        </option>


        {staff.map(member=>(
          <option
            key={member.id}
            value={member.id}
          >
            {member.name || member.email}
          </option>
        ))}


      </select>


    </div>





    {/* Actions */}
    <div className="rounded-2xl bg-slate-50 p-4">

      <h3 className="font-semibold">
        Actions
      </h3>


      <div className="mt-3 flex flex-wrap gap-2">


        <button
          onClick={() => void handleCall()}
          className="rounded-full border px-4 py-2"
        >
          Call
        </button>


        <button
          onClick={() => void handleSms()}
          className="rounded-full border px-4 py-2"
        >
          SMS
        </button>



        <button
          onClick={async()=>{

          await sendReportEmail(
            selectedReport.id,
            {
              recipient:
                emailDraft.recipient,

              subject:
                emailDraft.subject,

              message:
                emailDraft.message,

              sender:
                "admin@safehawassa.org"
            }
          );

          await refreshSelectedReport();

          }}
          className="rounded-full border px-4 py-2"
        >
          Email
        </button>


      </div>

    </div>





    {/* Notes */}
    <div className="rounded-2xl bg-slate-50 p-4">

      <h3 className="font-semibold">
        Notes
      </h3>


      <textarea
        value={noteValue}
        onChange={(e)=>
          setNoteValue(e.target.value)
        }
        className="mt-3 h-24 w-full rounded-2xl border p-3"
        placeholder="Add internal note..."
      />


      <button
        onClick={() => void handleAddNote()}
        className="mt-3 rounded-full bg-emerald-600 px-4 py-2 text-white"
      >
        Save Note
      </button>



      <div className="mt-4 space-y-3">

      {selectedReport.reportNotes?.map(note=>(
        <div
          key={note.id}
          className="border-b pb-2"
        >

          <p>
            {note.content}
          </p>

          <small className="text-slate-500">
            {note.author?.email}
          </small>


        </div>
      ))}


      </div>


    </div>





    {/* Communication History */}

    <div className="rounded-2xl bg-slate-50 p-4">

      <h3 className="font-semibold">
        Communication History
      </h3>


      <div className="mt-3 space-y-2">


      {selectedReport.communicationLogs?.map(log=>(

        <div
          key={log.id}
          className="text-sm"
        >

          {log.type}
          {" - "}
          {log.recipient}

        </div>

      ))}



      </div>


    </div>



  </div>
)  : (
            <div className="rounded-3xl border border-dashed border-slate-300 p-8 text-center text-slate-500">{language === 'en' ? 'Select a report to view details.' : '?????? ???? ???? ?????'}</div>
          )}
        </div>
      </div>
    </div>
  );
}