import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  X, Sparkles, ArrowRight, ArrowLeft, Check, 
  Code, Briefcase, TrendingUp, Brain, CheckCircle2 
} from 'lucide-react';

export default function SmartFinderModal() {
  const { isFinderOpen, setIsFinderOpen, books, navigateTo, showToast } = useApp();

  const [step, setStep] = useState(1);
  const [goal, setGoal] = useState('');
  const [level, setLevel] = useState('');
  const [budget, setBudget] = useState(9999);
  const [time, setTime] = useState(30);
  const [results, setResults] = useState([]);

  if (!isFinderOpen) return null;

  const handleNext = () => {
    if (step === 1 && !goal) {
      showToast('Please select your primary learning goal.');
      return;
    }
    if (step === 2 && !level) {
      showToast('Please select your current experience level.');
      return;
    }
    if (step === 3 && !budget) {
      showToast('Please select your budget limit.');
      return;
    }
    if (step === 4 && !time) {
      showToast('Please select your available daily time.');
      return;
    }

    if (step < 4) {
      setStep(prev => prev + 1);
    } else {
      // Calculate Matches
      const keywords = goal === 'programming' 
        ? ['programming', 'sql', 'api', 'typescript', 'algorithms', 'docker', 'async', 'refactoring', 'clean code']
        : goal === 'business'
        ? ['business', 'strategy', 'api design', 'databases']
        : goal === 'career'
        ? ['distributed systems', 'performance', 'algorithms', 'concurrency', 'systems']
        : ['personal development', 'productivity', 'cli', 'shell', 'habits'];

      const scored = books.map(b => {
        let score = 0;
        if (b.tags) {
          b.tags.forEach(t => {
            if (keywords.some(k => t.toLowerCase().includes(k))) score += 3;
          });
        }
        if (b.price <= budget) score += 2;
        if (b.bestSeller) score += 1;
        return { book: b, score };
      }).sort((a, b) => b.score - a.score);

      const filtered = scored.filter(s => s.book.price <= budget).map(s => s.book);
      setResults(filtered.length > 0 ? filtered.slice(0, 4) : books.slice(0, 4));
      setStep(5);
    }
  };

  const handleBack = () => {
    if (step > 1) {
      setStep(prev => prev - 1);
    } else {
      setIsFinderOpen(false);
    }
  };

  const resetFinder = () => {
    setStep(1);
    setGoal('');
    setLevel('');
    setBudget(9999);
    setTime(30);
    setResults([]);
  };

  return (
    <div className="modal-overlay" onClick={() => setIsFinderOpen(false)}>
      <div 
        className="modal-content wide"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Sparkles size={20} color="var(--primary)" />
            <h3 style={{ margin: 0 }}>Smart Book Finder</h3>
          </div>
          <button className="modal-close-btn" onClick={() => setIsFinderOpen(false)}>
            <X size={18} />
          </button>
        </div>

        {/* Step 1: Main Goal */}
        {step === 1 && (
          <div>
            <div className="section-kicker">STEP 1 OF 4</div>
            <h3 style={{ fontSize: '22px', fontWeight: 800, marginBottom: '8px' }}>
              What is your primary reading goal?
            </h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '14px' }}>
              We will match titles aligned with your immediate engineering and professional milestones.
            </p>

            <div className="finder-option-grid">
              <button
                className={`finder-card-option ${goal === 'programming' ? 'selected' : ''}`}
                onClick={() => setGoal('programming')}
              >
                <Code size={20} color="var(--primary)" />
                <div>
                  <div>Master Software Architecture</div>
                  <small style={{ color: 'var(--text-muted)', fontWeight: 500 }}>Code quality, refactoring & design</small>
                </div>
              </button>

              <button
                className={`finder-card-option ${goal === 'career' ? 'selected' : ''}`}
                onClick={() => setGoal('career')}
              >
                <TrendingUp size={20} color="var(--accent)" />
                <div>
                  <div>Staff / Senior Engineering</div>
                  <small style={{ color: 'var(--text-muted)', fontWeight: 500 }}>Concurrency, algorithms & distributed scale</small>
                </div>
              </button>

              <button
                className={`finder-card-option ${goal === 'business' ? 'selected' : ''}`}
                onClick={() => setGoal('business')}
              >
                <Briefcase size={20} color="var(--gold-text)" />
                <div>
                  <div>Databases & API Strategy</div>
                  <small style={{ color: 'var(--text-muted)', fontWeight: 500 }}>High-throughput queries & API contracts</small>
                </div>
              </button>

              <button
                className={`finder-card-option ${goal === 'self' ? 'selected' : ''}`}
                onClick={() => setGoal('self')}
              >
                <Brain size={20} color="var(--emerald)" />
                <div>
                  <div>Developer Productivity</div>
                  <small style={{ color: 'var(--text-muted)', fontWeight: 500 }}>Terminal mastery, CLI & automated habits</small>
                </div>
              </button>
            </div>
          </div>
        )}

        {/* Step 2: Experience Level */}
        {step === 2 && (
          <div>
            <div className="section-kicker">STEP 2 OF 4</div>
            <h3 style={{ fontSize: '22px', fontWeight: 800, marginBottom: '8px' }}>
              What is your current experience level?
            </h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '14px' }}>
              We'll filter out content that is either too basic or overly theoretical.
            </p>

            <div className="finder-option-grid" style={{ gridTemplateColumns: '1fr' }}>
              <button
                className={`finder-card-option ${level === 'beginner' ? 'selected' : ''}`}
                onClick={() => setLevel('beginner')}
              >
                🌱 <strong>Foundational / Junior Developer</strong> (1-2 years experience)
              </button>

              <button
                className={`finder-card-option ${level === 'intermediate' ? 'selected' : ''}`}
                onClick={() => setLevel('intermediate')}
              >
                ⚡ <strong>Mid-Level Software Engineer</strong> (3-5 years experience)
              </button>

              <button
                className={`finder-card-option ${level === 'advanced' ? 'selected' : ''}`}
                onClick={() => setLevel('advanced')}
              >
                🚀 <strong>Senior / Staff / Lead Architect</strong> (6+ years experience)
              </button>
            </div>
          </div>
        )}

        {/* Step 3: Budget Limit */}
        {step === 3 && (
          <div>
            <div className="section-kicker">STEP 3 OF 4</div>
            <h3 style={{ fontSize: '22px', fontWeight: 800, marginBottom: '8px' }}>
              What is your target budget?
            </h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '14px' }}>
              Choose your comfortable spending range per book.
            </p>

            <div className="finder-option-grid">
              <button
                className={`finder-card-option ${budget === 400 ? 'selected' : ''}`}
                onClick={() => setBudget(400)}
              >
                💰 Under ₹400
              </button>
              <button
                className={`finder-card-option ${budget === 550 ? 'selected' : ''}`}
                onClick={() => setBudget(550)}
              >
                💰 ₹400 – ₹550
              </button>
              <button
                className={`finder-card-option ${budget === 750 ? 'selected' : ''}`}
                onClick={() => setBudget(750)}
              >
                💰 ₹550 – ₹750
              </button>
              <button
                className={`finder-card-option ${budget === 9999 ? 'selected' : ''}`}
                onClick={() => setBudget(9999)}
              >
                💎 Unlimited / Pro Tier
              </button>
            </div>
          </div>
        )}

        {/* Step 4: Daily Reading Time */}
        {step === 4 && (
          <div>
            <div className="section-kicker">STEP 4 OF 4</div>
            <h3 style={{ fontSize: '22px', fontWeight: 800, marginBottom: '8px' }}>
              How much time can you commit to reading daily?
            </h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '14px' }}>
              Helps us recommend either concise field guides or comprehensive deep dives.
            </p>

            <div className="finder-option-grid">
              <button
                className={`finder-card-option ${time === 10 ? 'selected' : ''}`}
                onClick={() => setTime(10)}
              >
                ⏱ 10 - 15 minutes / day
              </button>
              <button
                className={`finder-card-option ${time === 30 ? 'selected' : ''}`}
                onClick={() => setTime(30)}
              >
                ⏱ 30 minutes / day
              </button>
              <button
                className={`finder-card-option ${time === 60 ? 'selected' : ''}`}
                onClick={() => setTime(60)}
              >
                ⏱ 1 hour / day
              </button>
              <button
                className={`finder-card-option ${time === 120 ? 'selected' : ''}`}
                onClick={() => setTime(120)}
              >
                ⏱ 2+ hours / day
              </button>
            </div>
          </div>
        )}

        {/* Step 5: Matches Result Output */}
        {step === 5 && (
          <div>
            <div className="section-kicker" style={{ color: 'var(--emerald-text)' }}>
              ✓ MATCHES READY
            </div>
            <h3 style={{ fontSize: '22px', fontWeight: 800, marginBottom: '6px' }}>
              Your Tailored Shortlist
            </h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '13.5px', marginBottom: '20px' }}>
              Based on your goal ({goal}), {level} level, ₹{budget === 9999 ? 'Flexible' : budget} budget, and {time} min/day commitment.
            </p>

            <div className="reco-grid" style={{ marginBottom: '24px' }}>
              {results.map(book => (
                <div 
                  key={book.id}
                  className="mini-card"
                  onClick={() => {
                    setIsFinderOpen(false);
                    navigateTo('product', book.id);
                  }}
                >
                  <div 
                    className="mini-cover"
                    style={{
                      background: `linear-gradient(135deg, ${book.color || '#4F46E5'} 0%, ${book.colorEnd || '#312E81'} 100%)`
                    }}
                  >
                    {book.title.split(' ').map(w => w[0]).join('').substring(0, 2).toUpperCase()}
                  </div>
                  <h4 style={{ fontSize: '14.5px', fontWeight: 800 }}>{book.title}</h4>
                  <p style={{ fontSize: '12px', color: 'var(--text-muted)' }}>by {book.author}</p>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 'auto' }}>
                    <span style={{ fontSize: '12px', fontWeight: 800, color: 'var(--gold-text)' }}>
                      ★ {book.rating}
                    </span>
                    <strong style={{ fontFamily: 'var(--font-mono)' }}>₹{book.price}</strong>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Wizard Controls Foot */}
        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '28px', borderTop: '1px solid var(--border)', paddingTop: '16px' }}>
          {step <= 4 ? (
            <>
              <button className="btn btn-ghost" onClick={handleBack}>
                <ArrowLeft size={16} /> Back
              </button>
              <button className="btn btn-primary" onClick={handleNext}>
                {step === 4 ? 'Generate Matches →' : 'Continue →'}
              </button>
            </>
          ) : (
            <>
              <button className="btn btn-ghost" onClick={resetFinder}>
                ↻ Retake Quiz
              </button>
              <button 
                className="btn btn-primary"
                onClick={() => setIsFinderOpen(false)}
              >
                Done Exploring
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
