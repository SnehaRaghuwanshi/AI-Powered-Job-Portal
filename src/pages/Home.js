// import { useState, useEffect } from 'react';
// import { Link, useNavigate } from 'react-router-dom';
// import axios from 'axios';

// const COLORS = ['#7c6cfa','#4ecdc4','#f59e0b','#22d3a5','#f06060','#a78bfa'];

// export default function Home() {
//   const [jobs, setJobs]       = useState([]);
//   const [search, setSearch]   = useState('');
//   const [type, setType]       = useState('');
//   const [loading, setLoading] = useState(true);
//   const [page, setPage]       = useState(1);
//   const [total, setTotal]     = useState(0);
//   const navigate = useNavigate();

//   const fetchJobs = async () => {
//     setLoading(true);
//     try {
//       const params = { page, limit: 8 };
//       if (search) params.search = search;
//       if (type)   params.type   = type;
//       const { data } = await axios.get('/api/jobs', { params });
//       setJobs(data.jobs);
//       setTotal(data.total);
//     } catch { setJobs([]); }
//     setLoading(false);
//   };

//   useEffect(() => { fetchJobs(); }, [page, type]);

//   const handleSearch = (e) => { e.preventDefault(); setPage(1); fetchJobs(); };

//   return (
//     <div>
//       {/* Hero */}
//       <div style={{ textAlign: 'center', padding: '3rem 1rem 2.5rem' }}>
//         <h1 style={{ fontFamily: 'var(--font-head)', fontSize: '2.6rem', fontWeight: 700, lineHeight: 1.1, marginBottom: '1rem' }}>
//           Find your next <em style={{ fontStyle: 'normal', color: 'var(--accent)' }}>dream role</em> with AI
//         </h1>
//         <p style={{ color: 'var(--muted)', fontSize: '1rem', maxWidth: 480, margin: '0 auto 2rem' }}>
//           AI-powered job matching that understands your skills, not just keywords.
//         </p>
//         <form onSubmit={handleSearch} style={{ display: 'flex', gap: 10, maxWidth: 520, margin: '0 auto', flexWrap: 'wrap' }}>
//           <input
//             value={search}
//             onChange={e => setSearch(e.target.value)}
//             placeholder="Search jobs, skills, companies..."
//             style={{ flex: 1, background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 8, padding: '10px 14px', color: 'var(--text)', fontFamily: 'var(--font-body)', fontSize: '0.9rem', outline: 'none', minWidth: 200 }}
//           />
//           <select value={type} onChange={e => { setType(e.target.value); setPage(1); }}
//             style={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 8, padding: '10px 14px', color: 'var(--text)', fontFamily: 'var(--font-body)', fontSize: '0.9rem', outline: 'none' }}>
//             <option value="">All Types</option>
//             <option value="Remote">Remote</option>
//             <option value="On-site">On-site</option>
//             <option value="Hybrid">Hybrid</option>
//           </select>
//           <button type="submit" className="btn btn-primary">Search</button>
//         </form>
//       </div>

//       {/* Stats */}
//       <div className="three-col" style={{ marginBottom: '2rem' }}>
//         <div className="stat-card"><div className="num">{total}+</div><div className="lbl">Active Jobs</div></div>
//         <div className="stat-card"><div className="num">AI</div><div className="lbl">Powered Screening</div></div>
//         <div className="stat-card"><div className="num">Fast</div><div className="lbl">Apply in Minutes</div></div>
//       </div>

//       {/* Job List */}
//       <div className="section-title"><div className="dot"></div>Open Positions</div>

//       {loading ? (
//         <div className="loading">Loading jobs...</div>
//       ) : jobs.length === 0 ? (
//         <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--muted)' }}>No jobs found. Try a different search.</div>
//       ) : (
//         <div style={{ display: 'grid', gap: '1rem' }}>
//           {jobs.map((job, i) => {
//             const col = COLORS[i % COLORS.length];
//             const typeClass = job.type === 'Remote' ? 'remote' : job.type === 'On-site' ? 'onsite' : 'hybrid';
//             return (
//               <div key={job._id} className="card" style={{ display: 'flex', alignItems: 'center', gap: '1rem', cursor: 'pointer', transition: 'border-color .2s' }}
//                 onClick={() => navigate(`/jobs/${job._id}`)}
//                 onMouseEnter={e => e.currentTarget.style.borderColor = 'var(--accent)'}
//                 onMouseLeave={e => e.currentTarget.style.borderColor = 'var(--border)'}>
//                 <div style={{ width: 48, height: 48, borderRadius: 10, background: `${col}22`, color: col, border: `1px solid ${col}44`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'var(--font-head)', fontWeight: 700, fontSize: '1rem', flexShrink: 0 }}>
//                   {job.company.slice(0, 2).toUpperCase()}
//                 </div>
//                 <div style={{ flex: 1 }}>
//                   <div style={{ fontFamily: 'var(--font-head)', fontWeight: 500, marginBottom: 4, display: 'flex', gap: 8, alignItems: 'center' }}>
//                     {job.title}
//                     {job.createdAt && (Date.now() - new Date(job.createdAt)) < 3 * 24 * 60 * 60 * 1000 && <span className="badge badge-new">New</span>}
//                   </div>
//                   <div style={{ fontSize: '0.82rem', color: 'var(--muted)', display: 'flex', gap: 12, flexWrap: 'wrap' }}>
//                     <span>{job.company}</span>
//                     <span>{job.location}</span>
//                     {job.salary && <span>{job.salary}</span>}
//                     <span className={`badge badge-${typeClass}`}>{job.type}</span>
//                     {job.applicants > 0 && <span>{job.applicants} applicant{job.applicants !== 1 ? 's' : ''}</span>}
//                   </div>
//                 </div>
//                 <button className="btn btn-outline btn-sm" onClick={e => { e.stopPropagation(); navigate(`/jobs/${job._id}`); }}>View →</button>
//               </div>
//             );
//           })}
//         </div>
//       )}

//       {/* Pagination */}
//       {total > 8 && (
//         <div style={{ display: 'flex', justifyContent: 'center', gap: 8, marginTop: '2rem' }}>
//           <button className="btn btn-outline btn-sm" disabled={page === 1} onClick={() => setPage(p => p - 1)}>← Prev</button>
//           <span style={{ padding: '6px 14px', color: 'var(--muted)', fontSize: '0.85rem' }}>Page {page}</span>
//           <button className="btn btn-outline btn-sm" disabled={jobs.length < 8} onClick={() => setPage(p => p + 1)}>Next →</button>
//         </div>
//       )}
//     </div>
//   );
// }
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const COLORS = ['#7c6cfa','#4ecdc4','#f59e0b','#22d3a5','#f06060','#a78bfa'];

export default function Home() {
  const [jobs, setJobs]           = useState([]);
  const [search, setSearch]       = useState('');
  const [type, setType]           = useState('');
  const [loading, setLoading]     = useState(true);
  const [page, setPage]           = useState(1);
  const [total, setTotal]         = useState(0);
  const [jobSource, setJobSource] = useState('real');
  const navigate = useNavigate();

  const fetchJobs = async () => {
    setLoading(true);
    try {
      if (jobSource === 'real') {
        const { data } = await axios.get('/api/realjobs', {
          params: { query: search || 'software developer', location: 'india', page }
        });
        setJobs(data.jobs);
        setTotal(data.total);
      } else {
        const params = { page, limit: 8 };
        if (search) params.search = search;
        if (type)   params.type   = type;
        const { data } = await axios.get('/api/jobs', { params });
        setJobs(data.jobs);
        setTotal(data.total);
      }
    } catch { setJobs([]); }
    setLoading(false);
  };

  useEffect(() => { fetchJobs(); }, [page, type, jobSource]);

  const handleSearch = (e) => { e.preventDefault(); setPage(1); fetchJobs(); };

  return (
    <div>
      {/* Hero */}
      <div style={{ textAlign: 'center', padding: '3rem 1rem 2.5rem' }}>
        <h1 style={{ fontFamily: 'var(--font-head)', fontSize: '2.6rem', fontWeight: 700, lineHeight: 1.1, marginBottom: '1rem' }}>
          Find your next <em style={{ fontStyle: 'normal', color: 'var(--accent)' }}>dream role</em> with AI
        </h1>
        <p style={{ color: 'var(--muted)', fontSize: '1rem', maxWidth: 480, margin: '0 auto 2rem' }}>
          AI-powered job matching that understands your skills, not just keywords.
        </p>

        {/* Toggle — Real Jobs vs Posted Jobs */}
        <div style={{ display: 'flex', gap: 8, justifyContent: 'center', marginBottom: '1.5rem' }}>
          <button
            className={`btn btn-sm ${jobSource === 'real' ? 'btn-primary' : 'btn-outline'}`}
            onClick={() => { setJobSource('real'); setPage(1); }}>
            🌐 Real Jobs (Indeed/LinkedIn)
          </button>
          <button
            className={`btn btn-sm ${jobSource === 'local' ? 'btn-primary' : 'btn-outline'}`}
            onClick={() => { setJobSource('local'); setPage(1); }}>
            📋 Posted Jobs
          </button>
        </div>

        {/* Search Bar */}
        <form onSubmit={handleSearch} style={{ display: 'flex', gap: 10, maxWidth: 520, margin: '0 auto', flexWrap: 'wrap' }}>
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder={jobSource === 'real' ? 'Search real jobs e.g. React Developer...' : 'Search posted jobs...'}
            style={{ flex: 1, background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 8, padding: '10px 14px', color: 'var(--text)', fontFamily: 'var(--font-body)', fontSize: '0.9rem', outline: 'none', minWidth: 200 }}
          />
          {jobSource === 'local' && (
            <select value={type} onChange={e => { setType(e.target.value); setPage(1); }}
              style={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 8, padding: '10px 14px', color: 'var(--text)', fontFamily: 'var(--font-body)', fontSize: '0.9rem', outline: 'none' }}>
              <option value="">All Types</option>
              <option value="Remote">Remote</option>
              <option value="On-site">On-site</option>
              <option value="Hybrid">Hybrid</option>
            </select>
          )}
          <button type="submit" className="btn btn-primary">Search</button>
        </form>
      </div>

      {/* Stats */}
      <div className="three-col" style={{ marginBottom: '2rem' }}>
        <div className="stat-card"><div className="num">{total}+</div><div className="lbl">Active Jobs</div></div>
        <div className="stat-card"><div className="num">AI</div><div className="lbl">Powered Screening</div></div>
        <div className="stat-card"><div className="num">Fast</div><div className="lbl">Apply in Minutes</div></div>
      </div>

      {/* Job List */}
      <div className="section-title">
        <div className="dot"></div>
        {jobSource === 'real' ? '🌐 Real Jobs from Indeed / LinkedIn' : '📋 Posted Jobs'}
      </div>

      {loading ? (
        <div className="loading">Loading jobs...</div>
      ) : jobs.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--muted)' }}>
          No jobs found. Try a different search.
        </div>
      ) : (
        <div style={{ display: 'grid', gap: '1rem' }}>
          {jobs.map((job, i) => {
            const col = COLORS[i % COLORS.length];
            const typeClass = job.type === 'Remote' ? 'remote' : job.type === 'On-site' ? 'onsite' : 'hybrid';
            return (
              <div key={job._id} className="card"
                style={{ display: 'flex', alignItems: 'center', gap: '1rem', cursor: 'pointer', transition: 'border-color .2s' }}
                onClick={() => job.applyLink ? window.open(job.applyLink, '_blank') : navigate(`/jobs/${job._id}`)}
                onMouseEnter={e => e.currentTarget.style.borderColor = 'var(--accent)'}
                onMouseLeave={e => e.currentTarget.style.borderColor = 'var(--border)'}>

                {/* Logo */}
                {job.logo ? (
                  <img src={job.logo} alt={job.company}
                    style={{ width: 48, height: 48, borderRadius: 10, objectFit: 'contain', background: '#fff', padding: 4, flexShrink: 0 }} />
                ) : (
                  <div style={{ width: 48, height: 48, borderRadius: 10, background: `${col}22`, color: col, border: `1px solid ${col}44`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'var(--font-head)', fontWeight: 700, fontSize: '1rem', flexShrink: 0 }}>
                    {job.company?.slice(0, 2).toUpperCase()}
                  </div>
                )}

                <div style={{ flex: 1 }}>
                  <div style={{ fontFamily: 'var(--font-head)', fontWeight: 500, marginBottom: 4, display: 'flex', gap: 8, alignItems: 'center' }}>
                    {job.title}
                    {job.createdAt && (Date.now() - new Date(job.createdAt)) < 3 * 24 * 60 * 60 * 1000 && (
                      <span className="badge badge-new">New</span>
                    )}
                    {job.source && (
                      <span style={{ fontSize: '0.72rem', color: 'var(--muted)', background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 20, padding: '2px 8px' }}>
                        {job.source}
                      </span>
                    )}
                  </div>
                  <div style={{ fontSize: '0.82rem', color: 'var(--muted)', display: 'flex', gap: 12, flexWrap: 'wrap' }}>
                    <span>{job.company}</span>
                    <span>{job.location}</span>
                    {job.salary && job.salary !== 'Not disclosed' && <span>{job.salary}</span>}
                    <span className={`badge badge-${typeClass}`}>{job.type}</span>
                    {job.applicants > 0 && <span>{job.applicants} applicant{job.applicants !== 1 ? 's' : ''}</span>}
                  </div>
                </div>

                <button className="btn btn-outline btn-sm"
                  onClick={e => {
                    e.stopPropagation();
                    job.applyLink ? window.open(job.applyLink, '_blank') : navigate(`/jobs/${job._id}`);
                  }}>
                  {job.applyLink ? 'Apply →' : 'View →'}
                </button>
              </div>
            );
          })}
        </div>
      )}

      {/* Pagination */}
      {total > 8 && (
        <div style={{ display: 'flex', justifyContent: 'center', gap: 8, marginTop: '2rem' }}>
          <button className="btn btn-outline btn-sm" disabled={page === 1} onClick={() => setPage(p => p - 1)}>← Prev</button>
          <span style={{ padding: '6px 14px', color: 'var(--muted)', fontSize: '0.85rem' }}>Page {page}</span>
          <button className="btn btn-outline btn-sm" disabled={jobs.length < 8} onClick={() => setPage(p => p + 1)}>Next →</button>
        </div>
      )}
    </div>
  );
}
