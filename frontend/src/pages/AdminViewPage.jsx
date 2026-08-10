import React, { useEffect, useState } from 'react';
import BackgroundGrid from '../components/BackgroundGrid';
import BrandLogo from '../components/BrandLogo';
import { useNavigate } from 'react-router-dom';

export default function AdminViewPage() {
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const fetchWaitlist = async () => {
    setLoading(true);
    setError(null);
    try {
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:8000';
      const response = await fetch(`${apiUrl}/api/admin/waitlist`);
      if (!response.ok) {
        throw new Error(`Server status ${response.status}`);
      }
      const result = await response.json();
      setSubmissions(result.data || []);
    } catch (err) {
      console.error('Error fetching admin waitlist:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWaitlist();
  }, []);

  const formatDate = (dateString) => {
    if (!dateString) return 'Recent';
    try {
      const options = { month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' };
      return new Date(dateString).toLocaleDateString('en-US', options);
    } catch {
      return dateString;
    }
  };

  return (
    <div className="hero-page" style={{ minHeight: '100vh', width: '100%', position: 'relative', overflowX: 'hidden' }}>
      {/* Background vector hatch grid */}
      <BackgroundGrid />

      {/* Main Container */}
      <div style={{ position: 'relative', zIndex: 2, width: '100%', maxWidth: '1150px', margin: '0 auto', padding: '1.5rem 1.5rem 4rem' }}>
        
        {/* Top Header Glassmorphic Pill */}
        <header style={{ 
          display: 'flex', 
          justify: 'space-between', 
          alignItems: 'center', 
          padding: '0.75rem 1.5rem', 
          marginBottom: '3rem',
          background: 'var(--nav-bg)', 
          backdropFilter: 'blur(20px)', 
          WebkitBackdropFilter: 'blur(20px)',
          border: '1px solid var(--nav-border)', 
          borderRadius: '9999px',
          boxShadow: 'inset 0 1px 1px rgba(255, 255, 255, 0.35), 0 10px 30px rgba(0, 15, 60, 0.25)',
          width: '100%'
        }}>
          {/* Left Brand Identity */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', cursor: 'pointer' }} onClick={() => navigate('/')}>
            <BrandLogo width={36} />
            <span style={{ color: '#ffffff', fontWeight: '700', fontSize: '1.1rem', letterSpacing: '-0.02em' }}>
              Jaradeck <span style={{ opacity: 0.6, fontWeight: '400', fontSize: '0.9rem', marginLeft: '0.35rem' }}>| Admin Dashboard</span>
            </span>
          </div>

          {/* Right Action Buttons */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <button 
              onClick={fetchWaitlist}
              style={{
                padding: '0.55rem 1.25rem',
                borderRadius: '9999px',
                background: 'rgba(255, 255, 255, 0.12)',
                border: '1px solid rgba(255, 255, 255, 0.28)',
                color: '#ffffff',
                fontSize: '0.88rem',
                fontWeight: '500',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.5rem'
              }}
              onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(255, 255, 255, 0.2)'; }}
              onMouseLeave={(e) => { e.currentTarget.style.background = 'rgba(255, 255, 255, 0.12)'; }}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21.5 2v6h-6M2.5 22v-6h6M2 11.5a10 10 0 0 1 18.8-4.3M22 12.5a10 10 0 0 1-18.8 4.2"/>
              </svg>
              Sync Data
            </button>
            <button 
              onClick={() => navigate('/')}
              style={{
                padding: '0.55rem 1.25rem',
                borderRadius: '9999px',
                background: '#ffffff',
                border: 'none',
                color: '#0048cc',
                fontSize: '0.88rem',
                fontWeight: '700',
                cursor: 'pointer',
                transition: 'transform 0.2s ease, box-shadow 0.2s ease',
                boxShadow: '0 4px 14px rgba(0, 0, 0, 0.16)',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.4rem'
              }}
              onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-1px)'; }}
              onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateY(0)'; }}
            >
              Return Home
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="5" y1="12" x2="19" y2="12"></line>
                <polyline points="12 5 19 12 12 19"></polyline>
              </svg>
            </button>
          </div>
        </header>

        {/* Page Title & Stats Overview */}
        <div style={{ marginBottom: '2.5rem' }}>
          <h1 style={{ color: '#ffffff', fontSize: '2.4rem', fontWeight: '700', letterSpacing: '-0.03em', marginBottom: '0.5rem' }}>
            Waitlist Submissions
          </h1>
          <p style={{ color: 'rgba(255, 255, 255, 0.75)', fontSize: '1.05rem', maxWidth: '600px' }}>
            Live record of user access requests and task preferences.
          </p>

          {/* Stat Cards */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.25rem', marginTop: '1.75rem' }}>
            <div style={{
              background: 'rgba(255, 255, 255, 0.08)',
              backdropFilter: 'blur(16px)',
              WebkitBackdropFilter: 'blur(16px)',
              border: '1px solid rgba(255, 255, 255, 0.18)',
              borderRadius: '16px',
              padding: '1.25rem 1.5rem'
            }}>
              <p style={{ color: 'rgba(255, 255, 255, 0.65)', fontSize: '0.82rem', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Total Responses</p>
              <h2 style={{ color: '#ffffff', fontSize: '2.2rem', fontWeight: '700', marginTop: '0.2rem' }}>{submissions.length}</h2>
            </div>
            
            <div style={{
              background: 'rgba(255, 255, 255, 0.08)',
              backdropFilter: 'blur(16px)',
              WebkitBackdropFilter: 'blur(16px)',
              border: '1px solid rgba(255, 255, 255, 0.18)',
              borderRadius: '16px',
              padding: '1.25rem 1.5rem'
            }}>
              <p style={{ color: 'rgba(255, 255, 255, 0.65)', fontSize: '0.82rem', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Database Status</p>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '0.4rem' }}>
                <span style={{ width: '9px', height: '9px', borderRadius: '50%', background: '#10b981', boxShadow: '0 0 10px #10b981' }}></span>
                <span style={{ color: '#ffffff', fontWeight: '600', fontSize: '1.1rem' }}>Active</span>
              </div>
            </div>
          </div>
        </div>

        {/* Content Section */}
        {loading ? (
          <div style={{
            background: 'rgba(255, 255, 255, 0.06)',
            backdropFilter: 'blur(20px)',
            WebkitBackdropFilter: 'blur(20px)',
            border: '1px solid rgba(255, 255, 255, 0.15)',
            borderRadius: '20px',
            padding: '4rem 2rem',
            textAlign: 'center',
            color: 'rgba(255, 255, 255, 0.85)'
          }}>
            <p style={{ fontSize: '1.05rem', fontWeight: '500' }}>Fetching waitlist data from database...</p>
          </div>
        ) : error ? (
          <div style={{
            background: 'rgba(255, 255, 255, 0.06)',
            backdropFilter: 'blur(20px)',
            WebkitBackdropFilter: 'blur(20px)',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            borderRadius: '20px',
            padding: '3rem 2rem',
            textAlign: 'center'
          }}>
            <h3 style={{ fontSize: '1.2rem', color: '#ffffff', fontWeight: '600', marginBottom: '0.5rem' }}>Unable to Sync Data</h3>
            <p style={{ fontSize: '0.95rem', color: 'rgba(255, 255, 255, 0.7)', marginBottom: '1.5rem' }}>{error}</p>
            <button 
              onClick={fetchWaitlist}
              style={{ padding: '0.6rem 1.4rem', borderRadius: '9999px', background: '#ffffff', color: '#0048cc', border: 'none', cursor: 'pointer', fontWeight: '700' }}
            >
              Try Again
            </button>
          </div>
        ) : submissions.length === 0 ? (
          <div style={{
            background: 'rgba(255, 255, 255, 0.06)',
            backdropFilter: 'blur(20px)',
            WebkitBackdropFilter: 'blur(20px)',
            border: '1px solid rgba(255, 255, 255, 0.15)',
            borderRadius: '20px',
            padding: '4rem 2rem',
            textAlign: 'center'
          }}>
            <h3 style={{ color: '#ffffff', fontSize: '1.3rem', fontWeight: '600', marginBottom: '0.5rem' }}>No Submissions Found</h3>
            <p style={{ color: 'rgba(255, 255, 255, 0.7)', fontSize: '0.95rem', maxWidth: '450px', margin: '0 auto 1.5rem' }}>
              Submissions submitted via the waitlist flow will appear here automatically.
            </p>
            <button 
              onClick={() => navigate('/waitlist')}
              style={{ padding: '0.65rem 1.4rem', borderRadius: '9999px', background: '#ffffff', color: '#0048cc', border: 'none', cursor: 'pointer', fontWeight: '700' }}
            >
              Go to Waitlist Form
            </button>
          </div>
        ) : (
          /* Submissions Cards Grid */
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: '1.5rem' }}>
            {submissions.map((sub, index) => (
              <div 
                key={sub.id || index} 
                style={{
                  background: 'rgba(255, 255, 255, 0.08)',
                  backdropFilter: 'blur(20px)',
                  WebkitBackdropFilter: 'blur(20px)',
                  border: '1px solid rgba(255, 255, 255, 0.18)',
                  borderRadius: '20px',
                  padding: '1.75rem',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '1.25rem',
                  boxShadow: '0 10px 30px rgba(0, 15, 60, 0.2)'
                }}
              >
                {/* Header info */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', borderBottom: '1px solid rgba(255, 255, 255, 0.1)', paddingBottom: '1rem' }}>
                  <div>
                    <span style={{ fontSize: '0.75rem', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'rgba(255, 255, 255, 0.6)' }}>
                      {sub.name ? sub.name : 'Waitlist Member'}
                    </span>
                    <h3 style={{ color: '#ffffff', fontSize: '1.2rem', fontWeight: '700', marginTop: '0.2rem' }}>
                      {sub.role === 'other' ? (sub.role_other || 'Custom Role') : (sub.role || 'Not Specified')}
                    </h3>
                  </div>
                  <span style={{ 
                    fontSize: '0.78rem', 
                    fontWeight: '600',
                    padding: '0.35rem 0.8rem', 
                    borderRadius: '9999px', 
                    background: 'rgba(255, 255, 255, 0.15)', 
                    color: '#ffffff',
                    border: '1px solid rgba(255, 255, 255, 0.25)'
                  }}>
                    {sub.frequency || 'Weekly'}
                  </span>
                </div>

                {/* Contact details */}
                <div>
                  <p style={{ color: 'rgba(255, 255, 255, 0.6)', fontSize: '0.75rem', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.5rem' }}>
                    Contact Details
                  </p>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                    {sub.contacts && typeof sub.contacts === 'object' ? (
                      Object.entries(sub.contacts).map(([key, val]) => (
                        <div key={key} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'rgba(0, 0, 0, 0.18)', padding: '0.55rem 0.8rem', borderRadius: '10px' }}>
                          <span style={{ color: 'rgba(255, 255, 255, 0.75)', fontSize: '0.85rem', textTransform: 'capitalize' }}>{key}:</span>
                          <span style={{ color: '#ffffff', fontSize: '0.88rem', fontWeight: '600' }}>{val}</span>
                        </div>
                      ))
                    ) : (
                      <span style={{ color: 'rgba(255, 255, 255, 0.7)', fontSize: '0.9rem' }}>No contact details provided</span>
                    )}
                  </div>
                </div>

                {/* Requested Tasks */}
                <div>
                  <p style={{ color: 'rgba(255, 255, 255, 0.6)', fontSize: '0.75rem', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.5rem' }}>
                    Requested Tasks
                  </p>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>
                    {Array.isArray(sub.tasks_selected) && sub.tasks_selected.map((task) => (
                      <span key={task} style={{ 
                        fontSize: '0.8rem', 
                        padding: '0.3rem 0.7rem', 
                        borderRadius: '8px', 
                        background: 'rgba(255, 255, 255, 0.12)', 
                        color: '#ffffff',
                        border: '1px solid rgba(255, 255, 255, 0.18)'
                      }}>
                        {task}
                      </span>
                    ))}
                    {sub.tasks_other && (
                      <span style={{ 
                        fontSize: '0.8rem', 
                        padding: '0.3rem 0.7rem', 
                        borderRadius: '8px', 
                        background: 'rgba(255, 255, 255, 0.18)', 
                        color: '#ffffff',
                        border: '1px solid rgba(255, 255, 255, 0.28)'
                      }}>
                        Other: {sub.tasks_other}
                      </span>
                    )}
                  </div>
                </div>

                {/* Footer Timestamp */}
                <div style={{ marginTop: 'auto', paddingTop: '0.75rem', borderTop: '1px solid rgba(255, 255, 255, 0.08)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ color: 'rgba(255, 255, 255, 0.5)', fontSize: '0.8rem' }}>Submitted</span>
                  <span style={{ color: '#ffffff', fontSize: '0.8rem', fontWeight: '500' }}>{formatDate(sub.created_at)}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
