import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';

export default function JobDetail() {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [job, setJob]         = useState(null);
  const [loading, setLoading] = useState(true);
  const [applying, setApplying] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [resumeFile, setResumeFile] = useState(null);
  const [form, setForm] = useState({ name: '', email: '', phone: '', linkedin: '', coverNote: '' });

  useEffect(() => {
    axios.get(`/api/jobs/${id}`)
      .then(r => setJob(r.data))
      .catch(() => navigate('/'))
      .finally(() => setLoading(false));
  }, [id]);

  useEffect(() => {
    if (user) setForm(f => ({ ...f, name: user.name || '', email: user.email || '' }));
  }, [user]);

  const handleApply = async (e) => {
    e.preventDefault();
    setApplying(true);
    try {
      const fd = new FormData();
      fd.append('jobId', id);
      Object.entries(form).forEach(([k, v]) => fd.append(k, v));
      if (resumeFile) fd.append('resume', resumeFile);
      await axios.post('/api/apply', fd, { headers: { 'Content-Type': 'multipart/form-data' } });
      toast.success('Application submitted! 🎉');
      setShowForm(false);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Application failed');
    }
    setApplying(false);
  };

  if (loading) return <div className="loading">Loading job...</div>;
  if (!job) return null;

  const typeClass = job.type === 'Remote' ? 'remote' : job.type === 'On-site' ? 'onsite' : 'hybrid';

  return (
    <div style={{ maxWidth: 780, margin: '0 auto' }}>
      {/* Back */}
      <button className="btn btn-outline btn-sm" style={{ marginBottom: '1.5rem' }} onClick={() => navigate('/')}>← Back to Jobs</button>

      {/* Header card */}
      <div className="card" style={{ marginBottom: '1.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem', marginBottom: '1rem' }}>
          <div style={{ width: 56, height: 56, borderRadius: 12, background: 'rgba(124,108,250,0.15)', color: 'var(--accent)', border: '1px solid rgba(124,108,250,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'var(--font-head)', fontWeight: 700, fontSize: '1.1rem', flexShrink: 0 }}>
            {job.company.slice(0, 2).toUpperCase()}
          </div>
          <div style={{ flex: 1 }}>
            <h1 style={{ fontFamily: 'var(--font-head)', fontSize: '1.5rem', fontWeight: 600, marginBottom: 6 }}>{job.title}</h1>
            <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', fontSize: '0.88rem', color: 'var(--muted)' }}>
              <span>🏢 {job.company}</span>
              <span>📍 {job.location}</span>
              {job.salary && <span>💰 {job.salary}</span>}
              <span className={`badge badge-${typeClass}`}>{job.type}</span>
            </div>
          </div>
          {user?.role !== 'recruiter' && (
            <button className="btn btn-primary" onClick={() => setShowForm(s => !s)}>
              {showForm ? 'Cancel' : 'Apply Now'}
            </button>
          )}
        </div>

        {/* Skills */}
        {job.skills?.length > 0 && (
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
            {job.skills.map(s => <span key={s} className="skill-tag match">{s}</span>)}
          </div>
        )}
      </div>

      {/* Description */}
      <div className="card" style={{ marginBottom: '1.5rem' }}>
        <div className="section-title"><div className="dot"></div>Job Description</div>
        <div style={{ color: 'var(--muted)', lineHeight: 1.8, fontSize: '0.92rem', whiteSpace: 'pre-wrap' }}>
          {job.description}
        </div>
      </div>

      {/* Apply Form */}
      {showForm && (
        <div className="card">
          <div className="section-title"><div className="dot" style={{ background: 'var(--success)' }}></div>Apply for this Role</div>
          <form onSubmit={handleApply}>
            <div className="two-col">
              <div className="form-group">
                <label>Full Name *</label>
                <input value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} placeholder="Your full name" required />
              </div>
              <div className="form-group">
                <label>Email *</label>
                <input type="email" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} placeholder="you@email.com" required />
              </div>
            </div>
            <div className="two-col">
              <div className="form-group">
                <label>Phone</label>
                <input value={form.phone} onChange={e => setForm(f => ({ ...f, phone: e.target.value }))} placeholder="+91 98765 43210" />
              </div>
              <div className="form-group">
                <label>LinkedIn</label>
                <input value={form.linkedin} onChange={e => setForm(f => ({ ...f, linkedin: e.target.value }))} placeholder="linkedin.com/in/yourprofile" />
              </div>
            </div>
            <div className="form-group">
              <label>Upload Resume (PDF/DOCX/TXT)</label>
              <input type="file" accept=".pdf,.docx,.txt" onChange={e => setResumeFile(e.target.files[0])}
                style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 8, padding: '8px 12px', color: 'var(--text)', width: '100%', cursor: 'pointer' }} />
              {resumeFile && <small style={{ color: 'var(--success)', marginTop: 4, display: 'block' }}>✓ {resumeFile.name}</small>}
            </div>
            <div className="form-group">
              <label>Cover Note</label>
              <textarea value={form.coverNote} onChange={e => setForm(f => ({ ...f, coverNote: e.target.value }))} placeholder="Why are you a great fit for this role?" />
            </div>
            <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end' }}>
              <button type="button" className="btn btn-outline" onClick={() => setShowForm(false)}>Cancel</button>
              <button type="submit" className="btn btn-primary" disabled={applying}>
                {applying ? <><span className="spinner"></span>Submitting...</> : 'Submit Application'}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
