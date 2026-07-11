import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';

export default function Dashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [jobs, setJobs]     = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user?.role === 'recruiter') {
      axios.get('/api/jobs')
        .then(r => setJobs(r.data.jobs.filter(j => j.postedBy?._id === user.id || j.postedBy === user.id)))
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, [user]);

  const deleteJob = async (id) => {
    try {
      await axios.delete(`/api/jobs/${id}`);
      setJobs(js => js.filter(j => j._id !== id));
      toast.success('Job removed');
    } catch { toast.error('Could not remove job'); }
  };

  if (loading) return <div className="loading">Loading dashboard...</div>;

  return (
    <div>
      <div className="section-title" style={{ marginBottom: '1.5rem' }}><div className="dot"></div>Dashboard</div>

      {/* User card */}
      <div className="card" style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
        <div style={{ width: 56, height: 56, borderRadius: '50%', background: 'rgba(124,108,250,0.15)', color: 'var(--accent)', border: '1px solid rgba(124,108,250,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'var(--font-head)', fontWeight: 700, fontSize: '1.2rem' }}>
          {user.name.slice(0, 2).toUpperCase()}
        </div>
        <div>
          <div style={{ fontFamily: 'var(--font-head)', fontSize: '1.1rem', fontWeight: 500 }}>{user.name}</div>
          <div style={{ fontSize: '0.82rem', color: 'var(--muted)' }}>{user.email} · <span style={{ color: 'var(--accent)', textTransform: 'capitalize' }}>{user.role}</span></div>
        </div>
        {user.role === 'recruiter' && (
          <div style={{ marginLeft: 'auto', display: 'flex', gap: 8 }}>
            <button className="btn btn-outline btn-sm" onClick={() => navigate('/post-job')}>+ Post Job</button>
            <button className="btn btn-primary btn-sm" onClick={() => navigate('/screener')}>AI Screener</button>
          </div>
        )}
      </div>

      {/* Recruiter — their jobs */}
      {user.role === 'recruiter' && (
        <div>
          <div className="section-title"><div className="dot" style={{ background: 'var(--accent2)' }}></div>Your Job Postings</div>
          {jobs.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--muted)' }}>
              No jobs posted yet.
              <button className="btn btn-primary btn-sm" style={{ marginLeft: 12 }} onClick={() => navigate('/post-job')}>Post your first job</button>
            </div>
          ) : (
            <div style={{ display: 'grid', gap: '1rem' }}>
              {jobs.map(job => (
                <div key={job._id} className="card" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontFamily: 'var(--font-head)', fontWeight: 500, marginBottom: 4 }}>{job.title}</div>
                    <div style={{ fontSize: '0.82rem', color: 'var(--muted)', display: 'flex', gap: 12 }}>
                      <span>{job.location}</span>
                      <span>{job.type}</span>
                      <span style={{ color: 'var(--accent)' }}>{job.applicants} applicant{job.applicants !== 1 ? 's' : ''}</span>
                      <span>{new Date(job.createdAt).toLocaleDateString()}</span>
                    </div>
                  </div>
                  <div style={{ display: 'flex', gap: 8 }}>
                    <button className="btn btn-outline btn-sm" onClick={() => navigate(`/jobs/${job._id}`)}>View</button>
                    <button className="btn btn-sm" style={{ background: 'rgba(240,96,96,0.12)', color: 'var(--danger)', border: '1px solid rgba(240,96,96,0.3)' }}
                      onClick={() => deleteJob(job._id)}>Remove</button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Job seeker dashboard */}
      {user.role === 'jobseeker' && (
        <div className="card" style={{ textAlign: 'center', padding: '3rem' }}>
          <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🎯</div>
          <h3 style={{ fontFamily: 'var(--font-head)', marginBottom: '0.5rem' }}>Find your next opportunity</h3>
          <p style={{ color: 'var(--muted)', marginBottom: '1.5rem' }}>Browse jobs and apply with your resume. AI will match your skills.</p>
          <button className="btn btn-primary" onClick={() => navigate('/')}>Browse Jobs</button>
        </div>
      )}
    </div>
  );
}
