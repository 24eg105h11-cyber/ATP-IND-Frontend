import React, { useState, useEffect, useMemo } from 'react';
import { Link, useParams } from 'react-router-dom';
import Editor from '@monaco-editor/react';
import axios from 'axios';
import { useAuth } from '../store/authStore';
import { API_BASE_URL } from '../utils/apiConfig';

const CodePlayground = () => {
  const { problemId } = useParams();
  const [problem, setProblem] = useState(null);
  const [problemLoading, setProblemLoading] = useState(false);
  const [problemError, setProblemError] = useState('');

  const problemTemplates = useMemo(() => ({
    twoSum: {
      javascript: `/**\n * @param {number[]} nums\n * @param {number} target\n * @return {number[]}\n */\nvar twoSum = function(nums, target) {\n    \n};`,
      python: `class Solution:\n    def twoSum(self, nums: List[int], target: int) -> List[int]:\n        pass`,
      java: `class Solution {\n    public int[] twoSum(int[] nums, int target) {\n        \n    }\n}`,
      cpp: `class Solution {\npublic:\n    vector<int> twoSum(vector<int>& nums, int target) {\n        \n    }\n};`,
      c: `/**\n * Note: The returned array must be malloced, assume caller calls free().\n */\nint* twoSum(int* nums, int numsSize, int target, int* returnSize) {\n    \n}`,
      samples: [
        { input: "[2,7,11,15]\n9", expectedOutput: "[0,1]" },
        { input: "[3,2,4]\n6", expectedOutput: "[1,2]" },
        { input: "[3,3]\n6", expectedOutput: "[0,1]" }
      ]
    },
    runningSum: {
      javascript: `/**\n * @param {number[]} nums\n * @return {number[]}\n */\nvar runningSum = function(nums) {\n    \n};`,
      python: `class Solution:\n    def runningSum(self, nums: List[int]) -> List[int]:\n        pass`,
      java: `class Solution {\n    public int[] runningSum(int[] nums) {\n        \n    }\n}`,
      cpp: `class Solution {\npublic:\n    vector<int> runningSum(vector<int>& nums) {\n        \n    }\n};`,
      c: `/**\n * Note: The returned array must be malloced, assume caller calls free().\n */\nint* runningSum(int* nums, int numsSize, int* returnSize) {\n    \n}`,
      samples: [
        { input: "[1,2,3,4]", expectedOutput: "[1,3,6,10]" },
        { input: "[1,1,1,1,1]", expectedOutput: "[1,2,3,4,5]" },
        { input: "[3,1,2,10,1]", expectedOutput: "[3,4,6,16,17]" }
      ]
    },
    productExceptSelf: {
      javascript: `/**\n * @param {number[]} nums\n * @return {number[]}\n */\nvar productExceptSelf = function(nums) {\n    \n};`,
      python: `class Solution:\n    def productExceptSelf(self, nums: List[int]) -> List[int]:\n        pass`,
      java: `class Solution {\n    public int[] productExceptSelf(int[] nums) {\n        \n    }\n}`,
      cpp: `class Solution {\npublic:\n    vector<int> productExceptSelf(vector<int>& nums) {\n        \n    }\n};`,
      c: `/**\n * Note: The returned array must be malloced, assume caller calls free().\n */\nint* productExceptSelf(int* nums, int numsSize, int* returnSize) {\n    \n}`,
      samples: [
        { input: "[1,2,3,4]", expectedOutput: "[24,12,8,6]" },
        { input: "[-1,1,0,-3,3]", expectedOutput: "[0,0,9,0,0]" },
        { input: "[2,3,4,5]", expectedOutput: "[60,40,30,24]" }
      ]
    },
    plusOne: {
      javascript: `/**\n * @param {number[]} digits\n * @return {number[]}\n */\nvar plusOne = function(digits) {\n    \n};`,
      python: `class Solution:\n    def plusOne(self, digits: List[int]) -> List[int]:\n        pass`,
      java: `class Solution {\n    public int[] plusOne(int[] digits) {\n        \n    }\n}`,
      cpp: `class Solution {\npublic:\n    vector<int> plusOne(vector<int>& digits) {\n        \n    }\n};`,
      c: `/**\n * Note: The returned array must be malloced, assume caller calls free().\n */\nint* plusOne(int* digits, int digitsSize, int* returnSize) {\n    \n}`,
      samples: [
        { input: "[1,2,3]", expectedOutput: "[1,2,4]" },
        { input: "[4,3,2,1]", expectedOutput: "[4,3,2,2]" },
        { input: "[9]", expectedOutput: "[1,0]" }
      ]
    }
  }), []);

  const currentTemplateKey = problem?.templateKey || 'twoSum';
  const currentTemplate = problemTemplates[currentTemplateKey] || problemTemplates.twoSum;
  const currentSamples = currentTemplate.samples;
  const getBoilerplate = (templateKey, lang) => {
    const template = problemTemplates[templateKey] || problemTemplates.twoSum;
    return template[lang] || template.javascript;
  };

  const formatDisplayTitle = (value) => String(value || '').replace(/([a-z])([A-Z0-9])/g, '$1 $2').replace(/\s+/g, ' ').trim();
  const currentProblemTitle = formatDisplayTitle(problem?.title || 'this problem');
  const editorialStepsByLanguage = useMemo(() => ({
    javascript: [
      `Read ${currentProblemTitle}, identify the input shape, and translate it into a small helper function first.`,
      `Use a plain loop or a hash map depending on the pattern in ${currentTemplateKey}; keep the logic direct and readable.`,
      `Return the final value in the format the problem expects, then compare against the sample cases.`
    ],
    python: [
      `Start with the Solution class and write the cleanest version of the core idea for ${currentProblemTitle}.`,
      `Use Python lists, dicts, or slicing only when they make the pattern simpler; avoid extra ceremony.`,
      `Check the sample inputs and make sure your return type matches the expected output exactly.`
    ],
    java: [
      `Declare the method signature first, then map ${currentProblemTitle} into arrays, HashMap, or two pointers as needed.`,
      `Use strong types and early returns so the control flow stays easy to follow.`,
      `Verify that your final array or collection is built before returning from the method.`
    ],
    cpp: [
      `Set up the Solution class and choose vector or unordered_map based on the pattern behind ${currentTemplateKey}.`,
      `Keep the loop logic tight and prefer indexed access when the problem works on arrays.`,
      `Return the final vector directly and compare against the sample outputs.`
    ],
    c: [
      `Use the provided function signature, read the inputs carefully, and work with raw arrays for ${currentProblemTitle}.`,
      `Track sizes and positions explicitly, because C requires you to manage indexing and return values yourself.`,
      `Fill the output buffer or returned array, then set returnSize correctly before finishing.`
    ],
    r: [
      `Treat the problem as a vector/list transformation and describe the steps before coding the R version.`,
      `Use indexing, loops, and vector operations to mirror the same pattern you would use in the other languages.`,
      `Return the final structure in the same shape as the expected output and double-check the sample cases.`
    ]
  }), [currentProblemTitle, currentTemplateKey]);

  const [allProblems, setAllProblems] = useState([]);
  const { currentUser, markProblemCompleted } = useAuth();

  const normalize = (value) => String(value || '').trim().toLowerCase();

  const relatedChallenges = useMemo(() => {
    if (!problem) return [];

    const solvedIds = new Set((currentUser?.completedProblems || []).map((item) => {
      if (!item) return null;
      if (typeof item === 'string') return item;
      return item?._id?.toString?.() || null;
    }).filter(Boolean));

    const currentTags = new Set((problem.tags || []).map(normalize));
    const currentTitle = normalize(problem.title);

    return allProblems
      .filter((candidate) => candidate && candidate._id && candidate._id.toString() !== problem._id?.toString?.())
      .filter((candidate) => !solvedIds.has(candidate._id?.toString?.() || candidate._id))
      .map((candidate) => {
        const candidateTags = (candidate.tags || []).map(normalize);
        const sharedTagCount = candidateTags.reduce((score, tag) => score + (currentTags.has(tag) ? 1 : 0), 0);
        const sameDifficultyBonus = candidate.difficulty === problem.difficulty ? 2 : 0;
        const titleBonus = normalize(candidate.title).includes(currentTitle) ? 1 : 0;
        return { ...candidate, score: sharedTagCount * 4 + sameDifficultyBonus + titleBonus };
      })
      .filter((candidate) => candidate.score > 0)
      .sort((left, right) => right.score - left.score)
      .slice(0, 4);
  }, [allProblems, currentUser?.completedProblems, problem]);

  const [language, setLanguage] = useState('javascript');
  const [code, setCode] = useState(currentTemplate.javascript);
  const [output, setOutput] = useState('');
  const [loading, setLoading] = useState(false);
  const [testcases, setTestcases] = useState([]);
  const [selectedCase, setSelectedCase] = useState(0);
  const [activeTab, setActiveTab] = useState('testcase'); // bottom panel: 'testcase' or 'testresult'
  const [activeInfoTab, setActiveInfoTab] = useState('description');
  const [testResults, setTestResults] = useState([]);
  const [customInput, setCustomInput] = useState('');
  const [submissions, setSubmissions] = useState([]);
  const [submissionsLoading, setSubmissionsLoading] = useState(false);
  const [submissionsError, setSubmissionsError] = useState('');
  const [isFromSubmission, setIsFromSubmission] = useState(false);

  useEffect(() => {
    if (!problemId) return;

    const fetchProblemData = async () => {
      setProblemLoading(true);
      setProblemError('');
      setProblem(null);

      try {
        const problemRes = await axios.get(`${API_BASE_URL}/problems/${problemId}`, { withCredentials: true });
        const fetchedProblem = problemRes.data.payload;
        setProblem(fetchedProblem);
        setCode(getBoilerplate(fetchedProblem?.templateKey || 'twoSum', language));

        const testRes = await axios.get(`${API_BASE_URL}/testcases/problem/${problemId}`, { withCredentials: true });
        const fetchedCases = testRes.data.payload || [];
        setTestcases(fetchedCases);
        if (fetchedCases.length > 0) {
          setCustomInput(fetchedCases[0].input);
        }
      } catch (err) {
        console.error("Failed to fetch problem data", err);
        setProblemError(err.response?.data?.message || err.message || 'Unable to load the problem');
      } finally {
        setProblemLoading(false);
      }
    };

    fetchProblemData();
  }, [problemId]);

  useEffect(() => {
    const fetchProblemList = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/problems`, { withCredentials: true });
        setAllProblems(response.data?.payload || []);
      } catch (err) {
        console.error('Failed to fetch related problems', err);
        setAllProblems([]);
      }
    };

    fetchProblemList();
  }, []);

  useEffect(() => {
    setCode(getBoilerplate(currentTemplateKey, language));
  }, [currentTemplateKey, language, problemTemplates]);

  useEffect(() => {
    const fetchSubmissions = async () => {
      if (activeInfoTab !== 'submissions' || !problemId) return;

      setSubmissionsLoading(true);
      setSubmissionsError('');

      try {
        const response = await axios.get(`${API_BASE_URL}/submissions?problem=${problemId}`, { withCredentials: true });
        setSubmissions(response.data?.payload || []);
      } catch (err) {
        const errorMessage = err.response?.status === 401
          ? 'Please login to view submissions.'
          : (err.response?.data?.message || err.message || 'Failed to load submissions');
        setSubmissionsError(errorMessage);
        setSubmissions([]);
      } finally {
        setSubmissionsLoading(false);
      }
    };

    fetchSubmissions();
  }, [activeInfoTab, problemId]);

  const languages = [
    { label: 'JavaScript', value: 'javascript' },
    { label: 'Python', value: 'python' },
    { label: 'Java', value: 'java' },
    { label: 'C', value: 'c' },
    { label: 'C++', value: 'cpp' },
    { label: 'R', value: 'r' },
  ];

  const handleRunCode = async () => {
    setLoading(true);
    setActiveTab('testresult');
    setTestResults([]);
    setIsFromSubmission(false);
    const sampleCases = currentSamples;

    // Use testcases from state, or our sample cases if DB is empty
    let casesToRun = testcases.length > 0 ? testcases : sampleCases;

    try {
      const results = [];
      for (let i = 0; i < casesToRun.length; i++) {
        const tc = casesToRun[i];
        try {
          const response = await axios.post(`${API_BASE_URL}/playground/run`, {
            code,
            language,
            input: tc.input,
            templateKey: currentTemplateKey
          }, { withCredentials: true });

          const { payload } = response.data;
          results.push({
            case: i + 1,
            input: tc.input,
            expected: tc.expectedOutput,
            actual: payload.output || payload.error || "No output",
            passed: tc.expectedOutput ? payload.output?.trim() === tc.expectedOutput?.trim() : true,
            error: payload.error
          });
        } catch (err) {
          results.push({
            case: i + 1,
            input: tc.input,
            expected: tc.expectedOutput,
            actual: "Error: " + (err.response?.data?.message || err.message),
            passed: false,
            error: err.message
          });
        }
      }
      setTestResults(results);
      setSelectedCase(0);
    } catch (err) {
      console.error("Run code general error:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitCode = async () => {
    if (!problemId) return alert("Select a challenge to submit");
    if (!currentUser) return alert("Please login to submit your code");
    
    setLoading(true);
    setActiveTab('testresult');
    setTestResults([]);
    
    try {
      const response = await axios.post(`${API_BASE_URL}/submissions`, {
        problemId,
        code,
        language
      }, { withCredentials: true });

      const { payload } = response.data;
      const storedSubmission = {
        ...payload,
        code,
        language,
        problem: problemId,
        user: currentUser?._id ? { _id: currentUser._id, username: currentUser.username } : payload.user,
      };

      setSubmissions((prev) => {
        const filtered = prev.filter((item) => item?._id !== storedSubmission._id);
        return [storedSubmission, ...filtered];
      });
      
      // Detailed feedback for submission including Efficiency and Rating
      if (payload.status === 'accepted') {
        setIsFromSubmission(true);
        setOutput(`Success: ACCEPTED\n\n- Cases Passed: ${payload.passedCount}/${payload.totalCases}\n- Runtime: ${payload.runtime}ms\n- Efficiency Score: ${payload.efficiencyScore}%\n- Rating: ${payload.efficiencyScore > 80 ? 'EXCELLENT' : payload.efficiencyScore > 60 ? 'VERY GOOD' : 'GOOD'}`);
        markProblemCompleted(problemId);
        setActiveInfoTab('submissions');
      } else {
        setIsFromSubmission(false);
        const errorInfo = payload.error ? `\n\nError Detail:\n${payload.error}` : "";
        setOutput(`Result: ${payload.status.toUpperCase()}\n\n- Cases Passed: ${payload.passedCount}/${payload.totalCases}\n- Status: Failed at first hidden test case${errorInfo}`);
      }
    } catch (err) {
      console.error("Submission error:", err);
      // More descriptive error message
      const errorMsg = err.response?.status === 401 
        ? "Session expired or not logged in. Please login again." 
        : (err.response?.data?.message || err.message);
      setOutput('Submission Error: ' + errorMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', height: 'calc(100vh - 64px)', backgroundColor: '#0f172a', color: '#e2e8f0' }}>
      {/* Sidebar: Problem Description */}
      <div style={{ borderRight: '1px solid #1e293b', padding: '24px', overflowY: 'auto', backgroundColor: '#1e293b' }}>
        {problem ? (
          <>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <h1 style={{ fontSize: '1.5rem', margin: 0, color: '#fff', display: 'flex', alignItems: 'center', gap: '8px' }}>
                {problem.title}
                {(() => {
                  const solved = currentUser?.completedProblems?.some(cp => {
                    try { return (cp?._id?.toString() === problem._id) || (cp?.toString() === problem._id); } catch (e) { return false; }
                  });
                  return solved ? <span style={{ color: '#16a34a', fontWeight: '800' }}>✔</span> : null;
                })()}
              </h1>
              <span style={{ 
                padding: '4px 8px', 
                borderRadius: '6px', 
                fontSize: '0.75rem', 
                fontWeight: 'bold',
                backgroundColor: problem.difficulty === 'easy' ? '#065f46' : problem.difficulty === 'medium' ? '#854d0e' : '#991b1b'
              }}>
                {problem.difficulty.toUpperCase()}
              </span>
            </div>
            
            <div style={{ display: 'flex', gap: '20px', borderBottom: '1px solid #334155', marginBottom: '16px', fontSize: '0.9rem' }}>
              <button type="button" onClick={() => setActiveInfoTab('description')} style={{ paddingBottom: '8px', borderBottomWidth: '2px', borderBottomStyle: 'solid', borderBottomColor: activeInfoTab === 'description' ? '#3b82f6' : 'transparent', cursor: 'pointer', color: activeInfoTab === 'description' ? '#fff' : '#94a3b8', background: 'none', borderWidth: 0, borderStyle: 'none' }}>Description</button>
              <button type="button" onClick={() => setActiveInfoTab('editorial')} style={{ paddingBottom: '8px', borderBottomWidth: '2px', borderBottomStyle: 'solid', borderBottomColor: activeInfoTab === 'editorial' ? '#3b82f6' : 'transparent', cursor: 'pointer', color: activeInfoTab === 'editorial' ? '#fff' : '#94a3b8', background: 'none', borderWidth: 0, borderStyle: 'none' }}>Editorial</button>
              <button type="button" onClick={() => setActiveInfoTab('solutions')} style={{ paddingBottom: '8px', borderBottomWidth: '2px', borderBottomStyle: 'solid', borderBottomColor: activeInfoTab === 'solutions' ? '#3b82f6' : 'transparent', cursor: 'pointer', color: activeInfoTab === 'solutions' ? '#fff' : '#94a3b8', background: 'none', borderWidth: 0, borderStyle: 'none' }}>Solutions</button>
              <button type="button" onClick={() => setActiveInfoTab('submissions')} style={{ paddingBottom: '8px', borderBottomWidth: '2px', borderBottomStyle: 'solid', borderBottomColor: activeInfoTab === 'submissions' ? '#3b82f6' : 'transparent', cursor: 'pointer', color: activeInfoTab === 'submissions' ? '#fff' : '#94a3b8', background: 'none', borderWidth: 0, borderStyle: 'none' }}>Submissions</button>
            </div>

            {activeInfoTab === 'description' && (
              <>
                <p style={{ lineHeight: '1.6', fontSize: '0.95rem', color: '#cbd5e1' }}>{problem.description}</p>
                
                {/* Example Section (Hardcoded fallback if DB is empty) */}
                {(testcases.length > 0 ? testcases.slice(0, 2) : currentSamples.slice(0, 2)).map((tc, index) => (
                  <div key={index} style={{ marginTop: '24px' }}>
                    <h4 style={{ color: '#fff', fontSize: '0.9rem', marginBottom: '8px' }}>Example {index + 1}:</h4>
                    <div style={{ backgroundColor: '#0f172a', padding: '16px', borderRadius: '8px', fontSize: '0.85rem', border: '1px solid #334155' }}>
                      <p style={{ margin: '0 0 8px 0' }}><strong style={{ color: '#94a3b8' }}>Input:</strong></p>
                      <pre style={{ margin: 0, padding: '12px', backgroundColor: '#111827', borderRadius: '8px', color: '#e2e8f0', whiteSpace: 'pre-wrap', overflowX: 'auto', fontSize: '0.85rem' }}><code>{tc.input}</code></pre>
                      <p style={{ margin: '12px 0 8px 0' }}><strong style={{ color: '#94a3b8' }}>Output:</strong></p>
                      <pre style={{ margin: 0, padding: '12px', backgroundColor: '#111827', borderRadius: '8px', color: '#e2e8f0', whiteSpace: 'pre-wrap', overflowX: 'auto', fontSize: '0.85rem' }}><code>{tc.expectedOutput}</code></pre>
                      {tc.explanation && (
                        <p style={{ margin: '12px 0 0 0' }}><strong style={{ color: '#94a3b8' }}>Explanation:</strong> <span style={{ color: '#cbd5e1' }}>{tc.explanation}</span></p>
                      )}
                    </div>
                  </div>
                ))}

                <div style={{ marginTop: '24px' }}>
                  <h3 style={{ fontSize: '1rem', color: '#fff', marginBottom: '12px' }}>Mechanism & Approach:</h3>
                  <div style={{ fontSize: '0.9rem', color: '#cbd5e1', lineHeight: '1.6' }}>
                    <p style={{ marginBottom: '8px' }}>1. <strong>Brute Force:</strong> Iterate through each element and check if there's another value that sums up to the target. (Time: O(n²))</p>
                    <p style={{ marginBottom: '8px' }}>2. <strong>One-pass Hash Table:</strong> While iterating, store the index of the complement (target - current) in a map to find it in constant time later. (Time: O(n))</p>
                  </div>
                </div>

                <div style={{ marginTop: '24px' }}>
                  <h3 style={{ fontSize: '1rem', color: '#fff', marginBottom: '12px' }}>Constraints:</h3>
                  <ul style={{ paddingLeft: '20px', fontSize: '0.9rem', color: '#cbd5e1' }}>
                    {problem.constraints && problem.constraints.length > 0 ? (
                      problem.constraints.map((constraint, idx) => (
                        <li key={idx} style={{ marginBottom: '4px' }}>{constraint}</li>
                      ))
                    ) : (
                      <>
                        <li style={{ marginBottom: '4px' }}>2 ≤ nums.length ≤ 10⁴</li>
                        <li style={{ marginBottom: '4px' }}>-10⁹ ≤ nums[i] ≤ 10⁹</li>
                        <li style={{ marginBottom: '4px' }}>-10⁹ ≤ target ≤ 10⁹</li>
                        <li style={{ marginBottom: '4px' }}>Only one valid answer exists.</li>
                      </>
                    )}
                  </ul>
                </div>
              </>
            )}

            {activeInfoTab === 'editorial' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', paddingTop: '4px' }}>
                <div style={{ backgroundColor: '#fff', border: '1px solid #e2e8f0', borderRadius: '14px', padding: '18px 20px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)' }}>
                  <p style={{ margin: '0 0 6px', color: '#64748b', fontSize: '0.8rem', fontWeight: '700', letterSpacing: '0.08em', textTransform: 'uppercase' }}>Editorial</p>
                  <h3 style={{ margin: '0 0 8px', color: '#1e293b', fontSize: '1.1rem', lineHeight: 1.25 }}>Steps to solve {currentProblemTitle}</h3>
                  <p style={{ margin: 0, color: '#475569', lineHeight: 1.65, maxWidth: '760px' }}>
                    Follow the same pattern in each language, but adapt the syntax and data structures to the language you are using.
                  </p>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '16px' }}>
                {Object.entries(editorialStepsByLanguage).map(([langKey, steps]) => {
                  const languageLabel = languages.find((item) => item.value === langKey)?.label || langKey.toUpperCase();

                  return (
                    <div key={langKey} style={{ backgroundColor: '#fff', border: '1px solid #e2e8f0', borderRadius: '16px', padding: '16px 16px 18px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)', borderTop: '4px solid #3b82f6' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', gap: '12px', flexWrap: 'wrap', marginBottom: '12px', alignItems: 'center' }}>
                        <h4 style={{ margin: 0, color: '#1e293b', fontSize: '1rem', fontWeight: '800' }}>{languageLabel}</h4>
                        <span style={{ color: '#64748b', fontSize: '0.75rem', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.08em', backgroundColor: '#f8fafc', padding: '4px 8px', borderRadius: '999px' }}>
                          {currentTemplateKey}
                        </span>
                      </div>

                      <div style={{ display: 'grid', gap: '12px' }}>
                        {steps.map((step, idx) => (
                          <div key={`${langKey}-${idx}`} style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
                            <span style={{ width: '24px', height: '24px', borderRadius: '50%', backgroundColor: '#3b82f6', color: '#fff', fontSize: '0.78rem', fontWeight: '800', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: '1px' }}>
                              {idx + 1}
                            </span>
                            <p style={{ margin: 0, color: '#475569', lineHeight: 1.7, fontSize: '0.92rem' }}>{step}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })}
                </div>
              </div>
            )}

            {activeInfoTab === 'solutions' && (
              <div style={{ color: '#cbd5e1', lineHeight: 1.7 }}>
                <p style={{ marginTop: 0 }}>This section can show community solutions or official solutions.</p>
              </div>
            )}

            {activeInfoTab === 'submissions' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {submissionsLoading ? (
                  <p style={{ color: '#94a3b8', margin: 0 }}>Loading submissions...</p>
                ) : submissionsError ? (
                  <p style={{ color: '#fca5a5', margin: 0 }}>{submissionsError}</p>
                ) : submissions.length === 0 ? (
                  <p style={{ color: '#94a3b8', margin: 0 }}>No submissions yet for this problem.</p>
                ) : (
                  submissions.map((submission, index) => {
                    const status = submission.status || 'pending';
                    const statusColor = status === 'accepted'
                      ? '#10b981'
                      : status === 'wrong answer'
                        ? '#f59e0b'
                        : status === 'runtime error' || status === 'compilation error'
                          ? '#ef4444'
                          : '#94a3b8';

                    return (
                      <div
                        key={submission._id || index}
                        style={{
                          backgroundColor: '#0f172a',
                          border: '1px solid #334155',
                          borderRadius: '10px',
                          padding: '12px 14px',
                          display: 'flex',
                          flexDirection: 'column',
                          gap: '8px'
                        }}
                      >
                        <div style={{ display: 'flex', justifyContent: 'space-between', gap: '12px', alignItems: 'center', flexWrap: 'wrap' }}>
                          <div>
                            <p style={{ margin: 0, color: '#e2e8f0', fontWeight: 700, fontSize: '0.95rem' }}>{submission.user?.username || 'You'}</p>
                            <p style={{ margin: '2px 0 0', color: '#94a3b8', fontSize: '0.78rem' }}>
                              {submission.createdAt ? new Date(submission.createdAt).toLocaleString() : 'Just now'}
                            </p>
                          </div>
                          <span style={{ color: statusColor, fontWeight: 700, textTransform: 'uppercase', fontSize: '0.75rem', letterSpacing: '0.04em' }}>
                            {status}
                          </span>
                        </div>

                        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', color: '#cbd5e1', fontSize: '0.82rem' }}>
                          <span>Language: {submission.language || 'n/a'}</span>
                          <span>Passed: {submission.passedCount ?? 0}/{submission.totalCases ?? 0}</span>
                          <span>Runtime: {submission.executionTime ?? submission.runtime ?? 0} ms</span>
                        </div>

                        {submission.code ? (
                          <div>
                            <p style={{ margin: '0 0 6px', color: '#94a3b8', fontSize: '0.72rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Code Preview</p>
                            <pre style={{ margin: 0, backgroundColor: '#111827', color: '#e2e8f0', padding: '10px 12px', borderRadius: '8px', overflowX: 'auto', whiteSpace: 'pre-wrap', maxHeight: '84px', overflowY: 'auto', fontSize: '0.8rem', lineHeight: 1.45 }}>
                              {String(submission.code).slice(0, 280)}{String(submission.code).length > 280 ? '…' : ''}
                            </pre>
                          </div>
                        ) : null}

                        {submission.error ? (
                          <div>
                            <p style={{ margin: '0 0 6px', color: '#94a3b8', fontSize: '0.72rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Error</p>
                            <pre style={{ margin: 0, backgroundColor: '#2a1111', color: '#fecaca', padding: '10px 12px', borderRadius: '8px', overflowX: 'auto', whiteSpace: 'pre-wrap', maxHeight: '72px', overflowY: 'auto', fontSize: '0.8rem' }}>
                              {submission.error}
                            </pre>
                          </div>
                        ) : null}
                      </div>
                    );
                  })
                )}
              </div>
            )}
          </>
        ) : problemLoading ? (
          <div style={{ padding: '40px', textAlign: 'center', color: '#94a3b8' }}>
            <p>Loading challenge details...</p>
          </div>
        ) : problemError ? (
          <div style={{ padding: '40px', textAlign: 'center', color: '#fca5a5' }}>
            <p>{problemError}</p>
          </div>
        ) : (
          <div style={{ padding: '40px', textAlign: 'center', color: '#94a3b8' }}>
            <p>Select a challenge from the Home page to see details.</p>
          </div>
        )}
      </div>

      {/* Main Area: Editor and Output */}
      <div style={{ display: 'flex', flexDirection: 'column' }}>
        <div style={{ padding: '8px 16px', backgroundColor: '#1e293b', borderBottom: '1px solid #334155', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
            <select 
              value={language} 
              onChange={(e) => {
                const newLang = e.target.value;
                setLanguage(newLang);
                setCode(getBoilerplate(currentTemplateKey, newLang));
              }}
              style={{ padding: '4px 8px', fontSize: '0.85rem', borderRadius: '4px', backgroundColor: '#0f172a', color: '#fff', border: '1px solid #334155' }}
            >
              {languages.map((lang) => (
                <option key={lang.value} value={lang.value}>{lang.label}</option>
              ))}
            </select>
            <span style={{ fontSize: '0.8rem', color: '#94a3b8' }}>|</span>
            <button style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer', fontSize: '0.85rem' }}>Auto</button>
          </div>
          <div style={{ display: 'flex', gap: '8px' }}>
            <button 
              onClick={handleRunCode} 
              disabled={loading}
              style={{ padding: '6px 16px', backgroundColor: '#334155', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '0.85rem' }}
            >
              Run
            </button>
            <button 
              onClick={handleSubmitCode} 
              disabled={loading || !problemId}
              style={{ padding: '6px 16px', backgroundColor: '#059669', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '0.85rem', fontWeight: 'bold' }}
            >
              {loading ? '...' : 'Submit'}
            </button>
          </div>
        </div>

        <div style={{ flex: 1, position: 'relative' }}>
          <Editor
            height="100%"
            language={language}
            theme="vs-dark"
            value={code}
            onChange={(value) => setCode(value)}
            options={{ fontSize: 14, minimap: { enabled: false }, padding: { top: 10 } }}
          />
        </div>

        {/* Bottom Panel: Tabs for Testcase / Test Result */}
        <div style={{ height: '300px', backgroundColor: '#1e293b', borderTop: '1px solid #334155', display: 'flex', flexDirection: 'column' }}>
          <div style={{ display: 'flex', borderBottom: '1px solid #334155', padding: '0 16px' }}>
            <button 
              onClick={() => setActiveTab('testcase')}
              style={{ 
                padding: '10px 16px', 
                background: 'none', 
                borderWidth: 0,
                borderStyle: 'none',
                color: activeTab === 'testcase' ? '#fff' : '#94a3b8',
                borderBottomWidth: '2px',
                borderBottomStyle: 'solid',
                borderBottomColor: activeTab === 'testcase' ? '#fff' : 'transparent',
                cursor: 'pointer',
                fontSize: '0.85rem'
              }}
            >
              Testcase
            </button>
            <button 
              onClick={() => setActiveTab('testresult')}
              style={{ 
                padding: '10px 16px', 
                background: 'none', 
                borderWidth: 0,
                borderStyle: 'none',
                color: activeTab === 'testresult' ? '#fff' : '#94a3b8',
                borderBottomWidth: '2px',
                borderBottomStyle: 'solid',
                borderBottomColor: activeTab === 'testresult' ? '#fff' : 'transparent',
                cursor: 'pointer',
                fontSize: '0.85rem'
              }}
            >
              Test Result
            </button>
          </div>

          <div style={{ flex: 1, overflowY: 'auto', padding: '16px' }}>
            {activeTab === 'testcase' ? (
              <div>
                <div style={{ display: 'flex', gap: '12px', marginBottom: '16px' }}>
                  {(testcases.length > 0 ? testcases : [1]).map((_, idx) => (
                    <button 
                      key={idx}
                      onClick={() => {
                        setSelectedCase(idx);
                        if (testcases[idx]) setCustomInput(testcases[idx].input);
                      }}
                      style={{ 
                        padding: '6px 12px', 
                        borderRadius: '6px', 
                        backgroundColor: selectedCase === idx ? '#334155' : 'transparent',
                        color: selectedCase === idx ? '#fff' : '#94a3b8',
                        border: '1px solid #475569',
                        cursor: 'pointer',
                        fontSize: '0.8rem'
                      }}
                    >
                      Case {idx + 1}
                    </button>
                  ))}
                </div>
                <div>
                  <p style={{ fontSize: '0.85rem', color: '#94a3b8', marginBottom: '4px' }}>Input:</p>
                  <textarea
                    value={testcases[selectedCase]?.input || customInput}
                    onChange={(e) => {
                      const val = e.target.value;
                      if (testcases.length > 0) {
                        const newCases = [...testcases];
                        newCases[selectedCase] = { ...newCases[selectedCase], input: val };
                        setTestcases(newCases);
                      } else {
                        setCustomInput(val);
                      }
                    }}
                    style={{ 
                      width: '100%',
                      minHeight: '80px',
                      backgroundColor: '#0f172a', 
                      color: '#e2e8f0',
                      padding: '12px', 
                      borderRadius: '6px', 
                      fontSize: '0.85rem',
                      border: '1px solid #334155',
                      fontFamily: 'monospace',
                      resize: 'vertical'
                    }}
                  />
                </div>
              </div>
            ) : (
              <div style={{ 
                height: '100%', 
                display: 'flex', 
                flexDirection: 'column',
                justifyContent: 'center', 
                alignItems: 'center', 
                color: '#94a3b8',
                textAlign: 'center'
              }}>
                {loading ? (
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px' }}>
                    <div style={{ 
                      width: '24px', 
                      height: '24px', 
                      border: '3px solid #334155', 
                      borderTop: '3px solid #3b82f6', 
                      borderRadius: '50%', 
                      animation: 'spin 1s linear infinite' 
                    }}></div>
                    <p style={{ margin: 0, fontSize: '0.95rem' }}>Running test cases...</p>
                    <style>{`
                      @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
                    `}</style>
                  </div>
                ) : testResults.length > 0 ? (
                  <div style={{ width: '100%', height: '100%', textAlign: 'left' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <h2 style={{ 
                          margin: 0, 
                          color: testResults.every(r => r.passed) ? '#10b981' : '#ef4444', 
                          fontSize: '1.5rem',
                          fontWeight: 'bold'
                        }}>
                          {testResults.every(r => r.passed) ? 'Accepted' : 'Wrong Answer'}
                        </h2>
                        <span style={{ color: '#94a3b8', fontSize: '0.9rem' }}>Runtime: 0 ms</span>
                      </div>
                    </div>

                    <div style={{ display: 'flex', gap: '8px', marginBottom: '20px', flexWrap: 'wrap' }}>
                      {testResults.map((result, idx) => (
                        <button 
                          key={idx}
                          onClick={() => setSelectedCase(idx)}
                          style={{ 
                            padding: '6px 16px', 
                            borderRadius: '8px', 
                            backgroundColor: selectedCase === idx ? '#334155' : '#1e293b',
                            color: '#fff',
                            border: '1px solid #334155',
                            cursor: 'pointer',
                            fontSize: '0.85rem',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px',
                            transition: 'all 0.2s'
                          }}
                        >
                          <span style={{ 
                            width: '12px', 
                            height: '12px', 
                            borderRadius: '2px', 
                            backgroundColor: result.passed ? '#10b981' : '#ef4444',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: '8px'
                          }}>
                            {result.passed ? '✓' : '✗'}
                          </span>
                          Case {idx + 1}
                        </button>
                      ))}
                    </div>

                    {testResults[selectedCase] && (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                        <div style={{ backgroundColor: '#0f172a', padding: '16px', borderRadius: '12px', border: '1px solid #334155' }}>
                          <p style={{ fontSize: '0.75rem', color: '#94a3b8', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>nums =</p>
                          <pre style={{ margin: 0, fontSize: '1rem', color: '#e2e8f0', fontFamily: 'monospace' }}>
                            {testResults[selectedCase].input.split('\n')[0]}
                          </pre>
                        </div>

                        <div style={{ backgroundColor: '#0f172a', padding: '16px', borderRadius: '12px', border: '1px solid #334155' }}>
                          <p style={{ fontSize: '0.75rem', color: '#94a3b8', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>target =</p>
                          <pre style={{ margin: 0, fontSize: '1rem', color: '#e2e8f0', fontFamily: 'monospace' }}>
                            {testResults[selectedCase].input.split('\n')[1]}
                          </pre>
                        </div>
                        
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '16px' }}>
                           <div>
                              <p style={{ fontSize: '0.75rem', color: '#94a3b8', marginBottom: '8px', textTransform: 'uppercase' }}>Output</p>
                              <pre style={{ backgroundColor: '#0f172a', padding: '16px', borderRadius: '12px', fontSize: '1rem', color: testResults[selectedCase].passed ? '#10b981' : '#ef4444', border: '1px solid #334155' }}>{testResults[selectedCase].actual}</pre>
                           </div>
                           {!testResults[selectedCase].passed && (
                             <div>
                                <p style={{ fontSize: '0.75rem', color: '#94a3b8', marginBottom: '8px', textTransform: 'uppercase' }}>Expected</p>
                                <pre style={{ backgroundColor: '#0f172a', padding: '16px', borderRadius: '12px', fontSize: '1rem', color: '#10b981', border: '1px solid #334155' }}>{testResults[selectedCase].expected}</pre>
                             </div>
                           )}
                        </div>
                      </div>
                    )}

                    {testResults.every((result) => result.passed) && relatedChallenges.length > 0 && isFromSubmission && (
                      <div style={{ marginTop: '20px', paddingTop: '18px', borderTop: '1px solid #334155' }}>
                        <h3 style={{ margin: '0 0 10px', color: '#fff', fontSize: '1rem' }}>More challenges</h3>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px' }}>
                          {relatedChallenges.map((challenge) => (
                            <Link
                              key={challenge._id}
                              to={`/playground/${challenge._id}`}
                              style={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '10px',
                                padding: '10px 14px',
                                borderRadius: '8px',
                                backgroundColor: 'rgba(55,55,55,0.95)',
                                border: '1px solid rgba(255,255,255,0.04)',
                                color: 'white',
                                textDecoration: 'none',
                                fontWeight: '700',
                                maxWidth: '100%',
                                boxShadow: '0 4px 10px rgba(0,0,0,0.12)'
                              }}
                            >
                              <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: challenge.difficulty === 'easy' ? '#f59e0b' : challenge.difficulty === 'medium' ? '#14b8a6' : '#ef4444', flexShrink: 0 }} />
                              <span style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{challenge.title}</span>
                            </Link>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <p style={{ fontSize: '1rem', color: '#64748b', fontFamily: 'inherit' }}>
                    {output || 'You must run your code first'}
                  </p>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CodePlayground;
