import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';

export default function PostJob() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ title: '', company: '', location: '', salary: '', type: 'Remote', description: '' });
  const [skills, setSkills]       = useState([]);
  const [skillInput, setSkillInput] = useState('');
  const [posting, setPosting]     = useState(false);
  const [generating, setGenerating] = useState(false);

  const handleChange = e => setForm(f => ({ ...f, [e.target.name]: e.target.value }));

  const addSkill = () => {
    const v = skillInput.trim();
    if (v && !skills.includes(v)) { setSkills(s => [...s, v]); setSkillInput(''); }
  };

  const generateDescription = async () => {
    if (!form.title || !form.company) { toast.error('Enter job title and company first'); return; }
    setGenerating(true);
    try {
      const { data } = await axios.post('/api/screen/generate-jd', {
        title: form.title, company: form.company, skills, context: form.description
      });
      setForm(f => ({ ...f, description: data.description }));
      toast.success('AI description generated!');
    } catch (err) {
      toast.error('Generation failed: ' + (err.response?.data?.message || err.message));
    }
    setGenerating(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.description.trim()) { toast.error('Please add a job description'); return; }
    setPosting(true);
    try {
      await axios.post('/api/jobs', { ...form, skills });
      toast.success('Job posted successfully!');
      navigate('/');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to post job');
    }
    setPosting(false);
  };

  return (
    <div style={{ maxWidth: 680, margin: '0 auto' }}>
      <div className="section-title" style={{ marginBottom: '1.5rem' }}><div className="dot"></div>Post a New Job</div>

      <div className="card">
        <form onSubmit={handleSubmit}>
          <div className="two-col">
            <div className="form-group">
              <label>Job Title *</label>
              <input name="title" value={form.title} onChange={handleChange} placeholder="e.g. Senior Frontend Engineer" required />
            </div>
            <div className="form-group">
              <label>Company Name *</label>
              <input name="company" value={form.company} onChange={handleChange} placeholder="e.g. Acme Corp" required />
            </div>
          </div>
          <div className="two-col">
            <div className="form-group">
              <label>Location</label>
              <input name="location" value={form.location} onChange={handleChange} placeholder="e.g. Remote, Bangalore" required />
            </div>
            <div className="form-group">
              <label>Salary Range</label>
              <input name="salary" value={form.salary} onChange={handleChange} placeholder="e.g. ₹20–35 LPA" />
            </div>
          </div>
          <div className="form-group">
            <label>Work Type</label>
            <select name="type" value={form.type} onChange={handleChange}>
              <option>Remote</option>
              <option>On-site</option>
              <option>Hybrid</option>
            </select>
          </div>

          {/* Skills */}
          <div className="form-group">
            <label>Required Skills</label>
            <div style={{ display: 'flex', gap: 8, marginBottom: 10 }}>
              <input value={skillInput} onChange={e => setSkillInput(e.target.value)} onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), addSkill())}
                placeholder="Add skill (Enter to add)"
                style={{ flex: 1, background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 8, padding: '8px 12px', color: 'var(--text)', fontFamily: 'var(--font-body)', fontSize: '0.85rem', outline: 'none' }} />
              <button type="button" className="btn btn-outline btn-sm" onClick={addSkill}>Add</button>
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
              {skills.map(s => (
                <span key={s} className="skill-tag match" style={{ cursor: 'pointer' }} onClick={() => setSkills(sk => sk.filter(x => x !== s))}>
                  {s} <span style={{ marginLeft: 4, opacity: 0.6 }}>✕</span>
                </span>
              ))}
            </div>
          </div>

          {/* JD + AI gen */}
          <div className="form-group">
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
              <label style={{ margin: 0 }}>Job Description *</label>
              <button type="button" className="btn btn-outline btn-sm" onClick={generateDescription} disabled={generating}>
                {generating ? <><span className="spinner"></span>Generating...</> : '✦ Generate with AI'}
              </button>
            </div>
            <textarea name="description" value={form.description} onChange={handleChange}
              placeholder="Describe the role, or click 'Generate with AI' to auto-write it..."
              style={{ minHeight: 200 }} required />
          </div>

          <button type="submit" className="btn btn-primary" style={{ width: '100%' }} disabled={posting}>
            {posting ? <><span className="spinner"></span>Posting...</> : 'Post Job'}
          </button>
        </form>
      </div>
    </div>
  );
}
