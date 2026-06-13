import React, { useEffect, useMemo, useState } from 'react';
import { useAuth } from '../store/authStore';

const roadmap = [
  {
    level: 'Step 1',
    title: 'Array fundamentals',
    description: 'Build comfort with indexing, iteration, and simple transformations before moving into pattern problems.',
    problemTitles: ['Two Sum', 'Running Sum of 1D Array', 'Plus One'],
    tip: 'Focus on writing clean loops and understanding how input shape changes the solution.'
  },
  {
    level: 'Step 2',
    title: 'Prefix and products',
    description: 'Learn how prefix state helps you avoid nested loops and compute answers in linear time.',
    problemTitles: ['Product of Array Except Self'],
    tip: 'Try to explain why prefix and suffix information can be reused instead of recomputed.'
  },
  {
    level: 'Step 3',
    title: 'Two pointers and sorted arrays',
    description: 'Practice moving from brute force to coordinated pointer movement on ordered data.',
    problemTitles: ['Two Sum II - Input Array Is Sorted'],
    tip: 'Trace pointer movement on paper first. The pattern matters more than memorizing code.'
  },
  {
    level: 'Step 4',
    title: 'Pattern mastery',
    description: 'Revisit earlier problems and look for repeated ideas: hash tables, prefix sums, and binary search.',
    problemTitles: [],
    tip: 'After each solved problem, write the core pattern in one sentence.'
  }
];

const focusAreas = [
  {
    title: 'Best way to learn',
    text: 'Solve in this order: understand the problem, write a brute-force approach, optimize with one pattern, then re-solve from memory.'
  },
  {
    title: 'How to practice',
    text: 'Pick one topic block per session and only move on after you can explain the pattern without looking at the answer.'
  },
  {
    title: 'What to revisit',
    text: 'Return to every problem you missed after 24 hours and solve it again with a different wording of the same pattern.'
  }
];

const StudyPlanPage = () => {
  const { currentUser, fetchProblems } = useAuth();
  const [problems, setProblems] = useState([]);
  const [loadingProblems, setLoadingProblems] = useState(true);

  useEffect(() => {
    const loadProblems = async () => {
      setLoadingProblems(true);
      try {
        const fetchedProblems = await fetchProblems();
        setProblems(fetchedProblems);
      } finally {
        setLoadingProblems(false);
      }
    };

    loadProblems();
  }, [fetchProblems]);

  const solvedProblemIds = useMemo(() => {
    return new Set((currentUser?.completedProblems || []).map((problem) => {
      if (!problem) return null;
      if (typeof problem === 'string') return problem;
      return problem?._id?.toString?.() || null;
    }).filter(Boolean));
  }, [currentUser?.completedProblems]);

  const normalize = (value) => String(value || '').trim().toLowerCase();

  const problemLookup = useMemo(() => {
    return problems.reduce((accumulator, problem) => {
      accumulator.byId.set(problem._id?.toString?.() || problem._id, problem);
      accumulator.byTitle.set(normalize(problem.title), problem);
      return accumulator;
    }, { byId: new Map(), byTitle: new Map() });
  }, [problems]);

  const roadmapWithProgress = useMemo(() => {
    return roadmap.map((step) => {
      const matchedProblems = step.problemTitles
        .map((title) => problemLookup.byTitle.get(normalize(title)))
        .filter(Boolean);

      const completedCount = matchedProblems.filter((problem) => solvedProblemIds.has(problem._id?.toString?.() || problem._id)).length;
      const totalCount = matchedProblems.length;
      const progress = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

      return {
        ...step,
        matchedProblems,
        completedCount,
        totalCount,
        progress,
      };
    });
  }, [problemLookup, solvedProblemIds]);

  const totalTrackedProblems = roadmapWithProgress.reduce((sum, step) => sum + step.totalCount, 0);
  const completedTrackedProblems = roadmapWithProgress.reduce((sum, step) => sum + step.completedCount, 0);
  const overallProgress = totalTrackedProblems > 0 ? Math.round((completedTrackedProblems / totalTrackedProblems) * 100) : 0;
  const solvedProblemsCount = currentUser?.completedProblems?.length || 0;

  const nextRecommendedStep = useMemo(() => {
    return roadmapWithProgress.find((step) => step.totalCount > 0 && step.progress < 100) || roadmapWithProgress[roadmapWithProgress.length - 1];
  }, [roadmapWithProgress]);

  const allLoaded = !loadingProblems;

  return (
    <div style={{ backgroundColor: '#020617', minHeight: '100vh', padding: '40px 20px', color: '#e2e8f0' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        <header style={{ marginBottom: '40px', textAlign: 'center' }}>
          <h1 style={{
            fontSize: '3.5rem',
            fontWeight: '800',
            color: '#e2e8f0',
            marginBottom: '10px',
            fontFamily: "'Syne', sans-serif",
            letterSpacing: '-3px',
            background: 'linear-gradient(to right, #00ffcc, #3399ff, #00ffcc)',
            backgroundSize: '200% auto',
            animation: 'gradient 4s linear infinite',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent'
          }}>STUDY PLAN</h1>
          <p style={{ fontSize: '1.2rem', color: '#94a3b8', fontWeight: '500', fontFamily: "'Sora', sans-serif" }}>Master the Code. Conquer the Patterns.</p>
        </header>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '16px', marginBottom: '28px' }}>
          <div style={{ backgroundColor: '#111827', border: '1px solid #1f2937', borderRadius: '16px', padding: '20px', boxShadow: '0 10px 30px rgba(0,0,0,0.25)' }}>
            <p style={{ margin: '0 0 10px 0', color: '#94a3b8', fontWeight: '700' }}>Overall progress</p>
            <h2 style={{ margin: '0 0 8px 0', fontSize: '2rem', color: '#e2e8f0' }}>{allLoaded ? `${overallProgress}%` : '...'}</h2>
            <p style={{ margin: 0, color: '#cbd5e1', lineHeight: 1.65 }}>
              {allLoaded
                ? `${completedTrackedProblems} of ${totalTrackedProblems || 0} tracked problems completed.`
                : 'Checking your solved problems and study path progress.'}
            </p>
          </div>

          <div style={{ backgroundColor: '#111827', border: '1px solid #1f2937', borderRadius: '16px', padding: '20px', boxShadow: '0 10px 30px rgba(0,0,0,0.25)' }}>
            <p style={{ margin: '0 0 10px 0', color: '#94a3b8', fontWeight: '700' }}>Next focus</p>
            <h2 style={{ margin: '0 0 8px 0', fontSize: '1.2rem', color: '#e2e8f0' }}>{loadingProblems ? 'Loading recommendations...' : nextRecommendedStep?.title || 'Pattern mastery'}</h2>
            <p style={{ margin: 0, color: '#cbd5e1', lineHeight: 1.65 }}>{nextRecommendedStep?.description || 'Keep solving and then revisit the harder patterns.'}</p>
          </div>

          <div style={{ backgroundColor: '#111827', border: '1px solid #1f2937', borderRadius: '16px', padding: '20px', boxShadow: '0 10px 30px rgba(0,0,0,0.25)' }}>
            <p style={{ margin: '0 0 10px 0', color: '#94a3b8', fontWeight: '700' }}>Solved so far</p>
            <h2 style={{ margin: '0 0 8px 0', fontSize: '2rem', color: '#e2e8f0' }}>{loadingProblems ? '...' : solvedProblemsCount}</h2>
            <p style={{ margin: 0, color: '#cbd5e1', lineHeight: 1.65 }}>Completed problems from the current library.</p>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '16px', marginBottom: '28px' }}>
          {focusAreas.map((item) => (
            <div key={item.title} style={{ backgroundColor: '#111827', border: '1px solid #1f2937', borderRadius: '16px', padding: '20px', boxShadow: '0 10px 30px rgba(0,0,0,0.25)' }}>
              <h3 style={{ marginTop: 0, marginBottom: '10px', fontSize: '1.1rem', color: '#e2e8f0' }}>{item.title}</h3>
              <p style={{ margin: 0, color: '#cbd5e1', lineHeight: 1.65 }}>{item.text}</p>
            </div>
          ))}
        </div>

        <div style={{ display: 'grid', gap: '20px' }}>
          {roadmap.map((step, index) => (
            <div key={step.level} style={{ backgroundColor: '#111827', border: '1px solid #1f2937', borderRadius: '16px', padding: '24px', boxShadow: '0 10px 30px rgba(0,0,0,0.25)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', gap: '16px', flexWrap: 'wrap', marginBottom: '10px' }}>
                <div>
                  <p style={{ margin: '0 0 6px 0', color: '#94a3b8', fontWeight: '700' }}>{step.level}</p>
                  <h2 style={{ margin: 0, fontSize: '1.45rem', color: '#e2e8f0' }}>{step.title}</h2>
                </div>
                <div style={{ color: '#cbd5e1', maxWidth: '440px', lineHeight: 1.6 }}>{step.description}</div>
              </div>

              <div style={{ marginTop: '14px', display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
                <div style={{ flex: '0 0 220px', height: '10px', borderRadius: '999px', backgroundColor: '#e2e8f0', overflow: 'hidden' }}>
                  <div style={{ width: `${step.progress}%`, height: '100%', borderRadius: '999px', background: 'linear-gradient(90deg, #00ffcc, #3399ff)' }} />
                </div>
                <span style={{ color: '#64748b', fontSize: '0.9rem' }}>
                  {step.totalCount > 0 ? `${step.completedCount}/${step.totalCount} completed` : 'No tracked problems in this step yet'}
                </span>
              </div>

              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginTop: '16px' }}>
                {(step.problemTitles.length > 0 ? step.problemTitles : ['Practice and review']).map((topic, topicIndex) => (
                  <span key={`${topic}-${topicIndex}`} style={{ fontSize: '0.75rem', color: '#cbd5e1', backgroundColor: '#111827', border: '1px solid #334155', padding: '2px 8px', borderRadius: '4px' }}>
                    {topic}
                  </span>
                ))}
              </div>

              <p style={{ margin: '16px 0 0 0', color: '#cbd5e1', lineHeight: 1.7 }}>
                <strong style={{ color: '#e2e8f0' }}>Practice tip:</strong> {step.tip}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default StudyPlanPage;