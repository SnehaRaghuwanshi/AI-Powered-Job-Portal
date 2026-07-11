import { useState, useRef } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';

export default function Screener() {
  const [jd, setJd]               = useState('');
  const [skills, setSkills]       = useState([]);
  const [skillInput, setSkillInput] = useState('');
  const [pastedResumes, setPasted]  = useState('');
  const [files, setFiles]           = useState([]);
  const [results, setResults]       = useState([]);
  const [loading, setLoading]       = useState(false);
  const [progress, setProgress]     = useState(0);
  const fileRef = useRef();

  const addSkill = () => {
    const v = skillInput.trim();
    if (v && !skills.includes(v)) { setSkills(s => [...s, v]); setSkillInput(''); }
  };

  const handleFiles = (newFiles) => {
    setFiles(prev => {
      const existing = prev.map(f => f.name);
      return [...prev, ...[...newFiles].filter(f => !existing.includes(f.name))];
    });
  };

  const handleDrop = (e) => { e.preventDefault(); handleFiles(e.dataTransfer.files); };

  const runScreening = async () => {
    if (!jd.trim()) { toast.error('Please add a job description'); return; }
    if (files.length === 0 && !pastedResumes.trim()) { toast.error('Please upload or paste at least one resume'); return; }

    setLoading(true); setResults([]); setProgress(10);
    const interval = setInterval(() => setProgress(p => Math.min(p + 7, 85)), 500);

    try {
      const fd = new FormData();
      fd.append('jobDescription', jd);
      fd.append('requiredSkills', JSON.stringify(skills));
      if (pastedResumes.trim()) fd.append('pastedResumes', pastedResumes);
      files.forEach(f => fd.append('resumes', f));

      const { data } = await axios.post('/api/screen', fd, { headers: { 'Content-Type': 'multipart/form-data' } });
      clearInterval(interval); setProgress(100);
      setResults(data.results);
      toast.success(`${data.results.length} resume${data.results.length !== 1 ? 's' : ''} screened!`);
    } catch (err) {
      clearInterval(interval);
      toast.error(err.response?.data?.message || 'Screening failed');
    }
    setLoading(false);
  };

  const COLORS = ['#7c6cfa','#4ecdc4','#f59e0b','#22d3a5','#f06060'];
  const recColors = {
    'Strong Hire': { bg: 'rgba(34,211,165,0.12)', col: '#22d3a5', border: 'rgba(34,211,165,0.3)' },
    'Hire':        { bg: 'rgba(78,205,196,0.12)',  col: '#4ecdc4', border: 'rgba(78,205,196,0.3)' },
    'Maybe':       { bg: 'rgba(245,158,11,0.12)',  col: '#f59e0b', border: 'rgba(245,158,11,0.3)' },
    'Pass':        { bg: 'rgba(240,96,96,0.12)',   col: '#f06060', border: 'rgba(240,96,96,0.3)' },
  };

  return (
    <div>
      <div className="section-title" style={{ marginBottom: '1.5rem' }}><div className="dot"></div>AI Resume Screener</div>

      <div className="two-col" style={{ marginBottom: '1.5rem' }}>
        {/* Left — JD + Skills */}
        <div className="card">
          <div style={{ fontSize: '0.85rem', color: 'var(--muted)', marginBottom: 8 }}>Job Description *</div>
          <textarea value={jd} onChange={e => setJd(e.target.value)}
            placeholder="Paste the full job description here — role overview, responsibilities, requirements..."
            style={{ width: '100%', background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 8, padding: '10px 14px', color: 'var(--text)', fontFamily: 'var(--font-body)', fontSize: '0.88rem', outline: 'none', resize: 'vertical', minHeight: 160 }} />

          <div style={{ marginTop: '1.2rem' }}>
            <div style={{ fontSize: '0.85rem', color: 'var(--muted)', marginBottom: 8 }}>Required Skills</div>
            <div style={{ display: 'flex', gap: 8, marginBottom: 10 }}>
              <input value={skillInput} onChange={e => setSkillInput(e.target.value)} onKeyDown={e => e.key === 'Enter' && addSkill()}
                placeholder="Add skill (Enter to add)"
                style={{ flex: 1, background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 8, padding: '8px 12px', color: 'var(--text)', fontFamily: 'var(--font-body)', fontSize: '0.85rem', outline: 'none' }} />
              <button className="btn btn-outline btn-sm" onClick={addSkill}>Add</button>
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, minHeight: 28 }}>
              {skills.map(s => (
                <span key={s} className="skill-tag match" style={{ cursor: 'pointer' }} onClick={() => setSkills(sk => sk.filter(x => x !== s))}>
                  {s} <span style={{ marginLeft: 4, opacity: 0.6 }}>✕</span>
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Right — Upload */}
        <div className="card">
          <div style={{ fontSize: '0.85rem', color: 'var(--muted)', marginBottom: 8 }}>Upload Resumes (PDF / DOCX / TXT)</div>
          <div className="drop-zone" onDragOver={e => e.preventDefault()} onDrop={handleDrop} onClick={() => fileRef.current.click()}>
            <div style={{ fontSize: '2rem', marginBottom: 8 }}>📄</div>
            <div style={{ fontFamily: 'var(--font-head)', fontSize: '0.95rem', marginBottom: 4 }}>Drop files here or click to browse</div>
            <div style={{ fontSize: '0.8rem', color: 'var(--muted)' }}>Upload multiple resumes at once — max 5MB each</div>
            <input ref={fileRef} type="file" multiple accept=".pdf,.docx,.txt" style={{ display: 'none' }} onChange={e => handleFiles(e.target.files)} />
          </div>

          {files.length > 0 && (
            <div style={{ marginTop: 10 }}>
              {files.map((f, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '6px 10px', background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 8, marginBottom: 6, fontSize: '0.82rem' }}>
                  <span style={{ color: 'var(--accent)' }}>📄</span>
                  <span style={{ flex: 1 }}>{f.name}</span>
                  <span style={{ color: 'var(--muted)' }}>{(f.size / 1024).toFixed(0)}KB</span>
                  <span style={{ cursor: 'pointer', color: 'var(--muted)' }} onClick={() => setFiles(fs => fs.filter((_, j) => j !== i))}>✕</span>
                </div>
              ))}
            </div>
          )}

          <div style={{ fontSize: '0.85rem', color: 'var(--muted)', margin: '1rem 0 8px' }}>Or paste resume text</div>
          <textarea value={pastedResumes} onChange={e => setPasted(e.target.value)}
            placeholder="Paste resume text here. For multiple resumes, separate them with:&#10;--- RESUME ---"
            style={{ width: '100%', background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 8, padding: '10px 14px', color: 'var(--text)', fontFamily: 'var(--font-body)', fontSize: '0.85rem', outline: 'none', resize: 'vertical', minHeight: 100 }} />

          <button className="btn btn-primary" style={{ width: '100%', marginTop: '1rem' }} onClick={runScreening} disabled={loading}>
            {loading ? <><span className="spinner"></span>Analyzing with AI...</> : '✦ Run AI Screening'}
          </button>
        </div>
      </div>

      {/* Progress bar */}
      {loading && (
        <div style={{ height: 4, background: 'var(--border)', borderRadius: 2, overflow: 'hidden', marginBottom: '1.5rem' }}>
          <div style={{ height: '100%', width: progress + '%', background: 'linear-gradient(90deg, var(--accent), var(--accent2))', borderRadius: 2, transition: 'width .3s' }}></div>
        </div>
      )}

      {/* Results */}
      {results.length > 0 && (
        <div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
            <div className="section-title" style={{ marginBottom: 0 }}><div className="dot" style={{ background: 'var(--success)' }}></div>Screening Results</div>
            <span style={{ fontSize: '0.82rem', color: 'var(--muted)' }}>{results.length} candidate{results.length !== 1 ? 's' : ''} screened · ranked by match score</span>
          </div>

          {results.map((c, i) => {
            const col = COLORS[i % COLORS.length];
            const initials = c.name.split(' ').map(x => x[0]).join('').slice(0, 2).toUpperCase();
            const rec = recColors[c.recommendation] || recColors['Maybe'];
            const scoreColor = c.score >= 75 ? '#22d3a5' : c.score >= 50 ? '#f59e0b' : '#f06060';
            const rankLabel = ['🥇','🥈','🥉'][i] || `#${i+1}`;

            return (
              <div key={i} className="card" style={{ marginBottom: '1rem', transition: 'border-color .2s' }}
                onMouseEnter={e => e.currentTarget.style.borderColor = 'var(--accent)'}
                onMouseLeave={e => e.currentTarget.style.borderColor = 'var(--border)'}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem', marginBottom: '0.8rem', flexWrap: 'wrap' }}>
                  <span style={{ fontSize: '1.2rem' }}>{rankLabel}</span>
                  <div style={{ width: 42, height: 42, borderRadius: '50%', background: `${col}22`, color: col, border: `1px solid ${col}44`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'var(--font-head)', fontWeight: 700, fontSize: '0.9rem' }}>
                    {initials}
                  </div>
                  <div>
                    <div style={{ fontFamily: 'var(--font-head)', fontWeight: 500 }}>{c.name}</div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--muted)' }}>{c.title} · {c.experience}</div>
                  </div>
                  <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 12 }}>
                    <div style={{ textAlign: 'right' }}>
                      <div style={{ fontFamily: 'var(--font-head)', fontSize: '1.5rem', fontWeight: 700, color: scoreColor }}>{c.score}%</div>
                      <div style={{ height: 5, background: 'var(--border)', borderRadius: 3, width: 80, overflow: 'hidden', marginTop: 3 }}>
                        <div style={{ height: '100%', width: c.score + '%', background: scoreColor, borderRadius: 3, transition: 'width 1s ease' }}></div>
                      </div>
                    </div>
                    <span className="badge" style={{ background: rec.bg, color: rec.col, border: `1px solid ${rec.border}` }}>{c.recommendation}</span>
                  </div>
                </div>

                {/* Skills */}
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: '0.8rem' }}>
                  {(c.skills || []).slice(0, 10).map(s => (
                    <span key={s} className={`skill-tag ${(c.matchedSkills || []).map(x => x.toLowerCase()).includes(s.toLowerCase()) ? 'match' : ''}`}>{s}</span>
                  ))}
                </div>

                {/* AI Summary */}
                <div style={{ background: 'var(--surface)', borderLeft: '3px solid var(--accent)', borderRadius: '0 8px 8px 0', padding: '0.75rem 1rem', fontSize: '0.85rem', color: 'var(--muted)', lineHeight: 1.7 }}>
                  <strong style={{ color: 'var(--text)' }}>Strengths:</strong> {c.pros}<br />
                  <strong style={{ color: 'var(--text)' }}>Gaps:</strong> {c.cons}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
