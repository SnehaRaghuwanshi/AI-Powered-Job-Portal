import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';

export default function Register() {
  const [form, setForm]     = useState({ name: '', email: '', password: '', role: 'jobseeker' });
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = e => setForm(f => ({ ...f, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const user = await register(form.name, form.email, form.password, form.role);
      toast.success(`Account created! Welcome, ${user.name}`);
      navigate(user.role === 'recruiter' ? '/screener' : '/');
    } catch (err) {
      toast.error(err.response?.data?.message || err.response?.data?.errors?.[0]?.msg || 'Registration failed');
    }
    setLoading(false);
  };

  return (
    <div style={{ maxWidth: 440, margin: '3rem auto' }}>
      <div className="card">
        <h2 style={{ fontFamily: 'var(--font-head)', fontSize: '1.5rem', marginBottom: '0.4rem' }}>Create account</h2>
        <p style={{ color: 'var(--muted)', fontSize: '0.88rem', marginBottom: '1.8rem' }}>Join TalentAI — it's free</p>

        {/* Role selector */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: '1.5rem' }}>
          {['jobseeker', 'recruiter'].map(r => (
            <div key={r} onClick={() => setForm(f => ({ ...f, role: r }))}
              style={{ padding: '0.9rem', border: `1px solid ${form.role === r ? 'var(--accent)' : 'var(--border)'}`, borderRadius: 10, cursor: 'pointer', textAlign: 'center', background: form.role === r ? 'rgba(124,108,250,0.08)' : 'var(--surface)', transition: 'all .2s' }}>
              <div style={{ fontSize: '1.3rem', marginBottom: 4 }}>{r === 'jobseeker' ? '🎯' : '🏢'}</div>
              <div style={{ fontSize: '0.85rem', fontWeight: 500, color: form.role === r ? 'var(--accent)' : 'var(--text)' }}>
                {r === 'jobseeker' ? 'Job Seeker' : 'Recruiter'}
              </div>
              <div style={{ fontSize: '0.75rem', color: 'var(--muted)', marginTop: 2 }}>
                {r === 'jobseeker' ? 'Find & apply to jobs' : 'Post jobs & screen resumes'}
              </div>
            </div>
          ))}
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Full Name</label>
            <input name="name" value={form.name} onChange={handleChange} placeholder="Your full name" required />
          </div>
          <div className="form-group">
            <label>Email</label>
            <input type="email" name="email" value={form.email} onChange={handleChange} placeholder="you@email.com" required />
          </div>
          <div className="form-group">
            <label>Password</label>
            <input type="password" name="password" value={form.password} onChange={handleChange} placeholder="Min. 6 characters" required minLength={6} />
          </div>
          <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '0.5rem' }} disabled={loading}>
            {loading ? <><span className="spinner"></span>Creating account...</> : 'Create Account'}
          </button>
        </form>
        <p style={{ textAlign: 'center', marginTop: '1.2rem', fontSize: '0.85rem', color: 'var(--muted)' }}>
          Already have an account? <Link to="/login" style={{ color: 'var(--accent)' }}>Sign in</Link>
        </p>
      </div>
    </div>
  );
}
