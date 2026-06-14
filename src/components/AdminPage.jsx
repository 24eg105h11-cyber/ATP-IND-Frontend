NOCHANGE
const AdminPage = () => {
  // Add Problem States
  const [activeTab, setActiveTab] = useState('addProblem');
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    difficulty: 'easy',
    tags: '',
    constraints: '',
    templateKey: 'twoSum'
  });
  const [testCases, setTestCases] = useState([{ input: '', expectedOutput: '', explanation: '' }]);
  const [problemLoading, setProblemLoading] = useState(false);
  const [problemMessage, setProblemMessage] = useState('');

  // User Management States
  const [users, setUsers] = useState([]);
  const [usersLoading, setUsersLoading] = useState(false);
  const [usersMessage, setUsersMessage] = useState('');
  const [deleteConfirm, setDeleteConfirm] = useState(null);

  // Problem Management States
  const [problems, setProblems] = useState([]);
  const [problemsLoading, setProblemsLoading] = useState(false);
  const [problemsMessage, setProblemsMessage] = useState('');
  const [deleteProblemConfirm, setDeleteProblemConfirm] = useState(null);

  // Fetch users or problems on component mount or tab change
  useEffect(() => {
    if (activeTab === 'manageUsers') {
      fetchUsers();
    }
    if (activeTab === 'manageProblems') {
      fetchProblems();
    }
  }, [activeTab]);

  const fetchUsers = async () => {
    setUsersLoading(true);
    setUsersMessage('');
    try {
      const response = await axios.get(`${API_BASE_URL}/users/admin/all-users`, { withCredentials: true });
      setUsers(response.data?.payload || []);
    } catch (err) {
      const errorMsg = err.response?.data?.message || err.message || 'Failed to fetch users';
      setUsersMessage(`Error: ${errorMsg}`);
      setUsers([]);
    } finally {
      setUsersLoading(false);
    }
  };

  const getAuthHeaders = () => {
    const token = localStorage.getItem('authToken');
    return token ? { Authorization: `Bearer ${token}` } : {};
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleTestCaseChange = (index, field, value) => {
    const newTestCases = [...testCases];
    newTestCases[index] = { ...newTestCases[index], [field]: value };
    setTestCases(newTestCases);
  };

  const addTestCase = () => {
    setTestCases([...testCases, { input: '', expectedOutput: '', explanation: '' }]);
  };

  const removeTestCase = (index) => {
    setTestCases(testCases.filter((_, i) => i !== index));
  };

  const handleAddProblem = async (e) => {
    e.preventDefault();
    setProblemLoading(true);
    setProblemMessage('');

    try {
      // Validate required fields
      if (!formData.title || !formData.description || !formData.difficulty) {
        setProblemMessage('Error: Title, description, and difficulty are required');
        setProblemLoading(false);
        return;
      }

      const problemPayload = {
        title: formData.title,
        description: formData.description,
        difficulty: formData.difficulty,
        tags: formData.tags.split(',').map(tag => tag.trim()).filter(tag => tag),
        constraints: formData.constraints.split('\n').map(constraint => constraint.trim()).filter(constraint => constraint),
        templateKey: formData.templateKey,
      };

      const response = await axios.post(
        `${API_BASE_URL}/problems`,
        problemPayload,
        { withCredentials: true, headers: getAuthHeaders() }
      );

      // Now add test cases
      if (testCases.length > 0) {
        for (const testCase of testCases) {
          if (testCase.input && testCase.expectedOutput) {
            try {
              await axios.post(`${API_BASE_URL}/testcases`, {
                problem: response.data.payload._id,
                input: testCase.input,
                expectedOutput: testCase.expectedOutput,
                isSample: true,
                explanation: testCase.explanation || ''
              }, { withCredentials: true });
            } catch (err) {
              console.error('Failed to add test case:', err);
            }
          }
        }
      }

      setProblemMessage(`✅ Problem "${formData.title}" created successfully!`);
      // Reset form
      setFormData({
        title: '',
        description: '',
        difficulty: 'easy',
        tags: '',
        constraints: '',
        templateKey: 'twoSum'
      });
      setTestCases([{ input: '', expectedOutput: '', explanation: '' }]);
    } catch (err) {
      const errorMsg = err.response?.data?.message || err.message || 'Failed to create problem';
      setProblemMessage(`Error: ${errorMsg}`);
    } finally {
      setProblemLoading(false);
    }
  };

  const fetchProblems = async () => {
    setProblemsLoading(true);
    setProblemsMessage('');
    try {
      const response = await axios.get(`${API_BASE_URL}/problems`, { withCredentials: true });
      setProblems(response.data?.payload || []);
    } catch (err) {
      const errorMsg = err.response?.data?.message || err.message || 'Failed to fetch problems';
      setProblemsMessage(`Error: ${errorMsg}`);
      setProblems([]);
    } finally {
      setProblemsLoading(false);
    }
  };

  const handleDeleteProblem = async (problemId) => {
    try {
      await axios.delete(`${API_BASE_URL}/problems/${problemId}`, { withCredentials: true });
      setProblemsMessage('✅ Problem deleted successfully');
      setDeleteProblemConfirm(null);
      fetchProblems();
    } catch (err) {
      const errorMsg = err.response?.data?.message || err.message || 'Failed to delete problem';
      setProblemsMessage(`Error: ${errorMsg}`);
    }
  };

  const handleDeleteUser = async (userId) => {
    try {
      await axios.delete(`${API_BASE_URL}/users/${userId}`, { withCredentials: true });
      setUsersMessage('✅ User deleted successfully');
      setDeleteConfirm(null);
      fetchUsers();
    } catch (err) {
      const errorMsg = err.response?.data?.message || err.message || 'Failed to delete user';
      setUsersMessage(`Error: ${errorMsg}`);
    }
  };

  return (
    <div style={{ backgroundColor: '#fcfdff', minHeight: '100vh', padding: '40px 20px' }}>
      <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
        <h1 style={{ fontSize: '2.5rem', fontWeight: '800', color: '#1e293b', marginBottom: '10px' }}>Admin Dashboard</h1>
        <p style={{ fontSize: '1rem', color: '#64748b', marginBottom: '30px' }}>Manage challenges and users</p>

        {/* Tabs */}
        <div style={{ display: 'flex', gap: '16px', marginBottom: '30px', borderBottom: '1px solid #e2e8f0', paddingBottom: '0' }}>
          <button
            onClick={() => setActiveTab('addProblem')}
            style={{
              padding: '12px 24px',
              background: 'none',
              border: 'none',
              borderBottom: activeTab === 'addProblem' ? '3px solid #3b82f6' : 'none',
              color: activeTab === 'addProblem' ? '#1e293b' : '#64748b',
              fontWeight: activeTab === 'addProblem' ? '700' : '600',
              fontSize: '1rem',
              cursor: 'pointer',
              transition: 'all 0.2s'
            }}
          >
            Add Challenge
          </button>
          <button
            onClick={() => setActiveTab('manageProblems')}
            style={{
              padding: '12px 24px',
              background: 'none',
              border: 'none',
              borderBottom: activeTab === 'manageProblems' ? '3px solid #3b82f6' : 'none',
              color: activeTab === 'manageProblems' ? '#1e293b' : '#64748b',
              fontWeight: activeTab === 'manageProblems' ? '700' : '600',
              fontSize: '1rem',
              cursor: 'pointer',
              transition: 'all 0.2s'
            }}
          >
            Manage Challenges
          </button>
          <button
            onClick={() => setActiveTab('manageUsers')}
            style={{
              padding: '12px 24px',
              background: 'none',
              border: 'none',
              borderBottom: activeTab === 'manageUsers' ? '3px solid #3b82f6' : 'none',
              color: activeTab === 'manageUsers' ? '#1e293b' : '#64748b',
              fontWeight: activeTab === 'manageUsers' ? '700' : '600',
              fontSize: '1rem',
              cursor: 'pointer',
              transition: 'all 0.2s'
            }}
          >
            Manage Users
          </button>
        </div>

        {/* Add Problem Tab */}
        {activeTab === 'addProblem' && (
          <div style={{ backgroundColor: '#fff', borderRadius: '12px', padding: '40px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)' }}>
            <h2 style={{ fontSize: '1.5rem', fontWeight: '700', color: '#1e293b', marginBottom: '24px' }}>Add New Challenge</h2>

            {problemMessage && (
              <div style={{
                padding: '12px 16px',
                borderRadius: '8px',
                marginBottom: '20px',
                backgroundColor: problemMessage.includes('Error') ? '#fee2e2' : '#dcfce7',
                color: problemMessage.includes('Error') ? '#991b1b' : '#166534',
                border: `1px solid ${problemMessage.includes('Error') ? '#fca5a5' : '#86efac'}`
              }}>
                {problemMessage}
              </div>
            )}

            <form onSubmit={handleAddProblem} style={{ display: 'grid', gap: '20px' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                {/* Title */}
                <div>
                  <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', color: '#334155' }}>Title *</label>
                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleFormChange}
                    placeholder="e.g., Two Sum"
                    required
                    style={{
                      width: '100%',
                      padding: '10px 12px',
                      border: '1px solid #e2e8f0',
                      borderRadius: '8px',
                      fontSize: '0.95rem',
                      fontFamily: 'inherit',
                      boxSizing: 'border-box'
                    }}
                  />
                </div>

                {/* Difficulty */}
                <div>
                  <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', color: '#334155' }}>Difficulty *</label>
                  <select
                    name="difficulty"
                    value={formData.difficulty}
                    onChange={handleFormChange}
                    style={{
                      width: '100%',
                      padding: '10px 12px',
                      border: '1px solid #e2e8f0',
                      borderRadius: '8px',
                      fontSize: '0.95rem',
                      fontFamily: 'inherit',
                      boxSizing: 'border-box'
                    }}
                  >
                    <option value="easy">Easy</option>
                    <option value="medium">Medium</option>
                    <option value="hard">Hard</option>
                  </select>
                </div>

                {/* Template Key */}
                <div>
                  <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', color: '#334155' }}>Template Key</label>
                  <select
                    name="templateKey"
                    value={formData.templateKey}
                    onChange={handleFormChange}
                    style={{
                      width: '100%',
                      padding: '10px 12px',
                      border: '1px solid #e2e8f0',
                      borderRadius: '8px',
                      fontSize: '0.95rem',
                      fontFamily: 'inherit',
                      boxSizing: 'border-box'
                    }}
                  >
                    <option value="twoSum">Two Sum</option>
                    <option value="runningSum">Running Sum</option>
                    <option value="productExceptSelf">Product Except Self</option>
                    <option value="plusOne">Plus One</option>
                  </select>
                </div>

                {/* Tags */}
                <div>
                  <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', color: '#334155' }}>Tags (comma-separated)</label>
                  <input
                    type="text"
                    name="tags"
                    value={formData.tags}
                    onChange={handleFormChange}
                    placeholder="e.g., array, hashmap, two-pointer"
                    style={{
                      width: '100%',
                      padding: '10px 12px',
                      border: '1px solid #e2e8f0',
                      borderRadius: '8px',
                      fontSize: '0.95rem',
                      fontFamily: 'inherit',
                      boxSizing: 'border-box'
                    }}
                  />
                </div>
              </div>

              {/* Description */}
              <div>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', color: '#334155' }}>Description *</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleFormChange}
                  placeholder="Detailed problem description..."
                  required
                  style={{
                    width: '100%',
                    padding: '12px',
                    border: '1px solid #e2e8f0',
                    borderRadius: '8px',
                    fontSize: '0.95rem',
                    fontFamily: 'inherit',
                    minHeight: '120px',
                    resize: 'vertical',
                    boxSizing: 'border-box'
                  }}
                />
              </div>

              {/* Constraints */}
              <div>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', color: '#334155' }}>Constraints (one per line)</label>
                <textarea
                  name="constraints"
                  value={formData.constraints}
                  onChange={handleFormChange}
                  placeholder="e.g., 2 ≤ nums.length ≤ 10⁴&#10;-10⁹ ≤ nums[i] ≤ 10⁹"
                  style={{
                    width: '100%',
                    padding: '12px',
                    border: '1px solid #e2e8f0',
                    borderRadius: '8px',
                    fontSize: '0.95rem',
                    fontFamily: 'inherit',
                    minHeight: '100px',
                    resize: 'vertical',
                    boxSizing: 'border-box'
                  }}
                />
              </div>

              {/* Test Cases */}
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                  <h3 style={{ fontSize: '1.1rem', fontWeight: '700', color: '#1e293b', margin: 0 }}>Test Cases</h3>
                  <button
                    type="button"
                    onClick={addTestCase}
                    style={{
                      padding: '8px 16px',
                      backgroundColor: '#3b82f6',
                      color: 'white',
                      border: 'none',
                      borderRadius: '6px',
                      cursor: 'pointer',
                      fontWeight: '600',
                      fontSize: '0.9rem'
                    }}
                  >
                    + Add Test Case
                  </button>
                </div>

                {testCases.map((testCase, index) => (
                  <div key={index} style={{
                    backgroundColor: '#f8fafc',
                    padding: '16px',
                    borderRadius: '8px',
                    marginBottom: '12px',
                    border: '1px solid #e2e8f0'
                  }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                      <h4 style={{ margin: 0, color: '#334155', fontWeight: '600' }}>Test Case {index + 1}</h4>
                      {testCases.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeTestCase(index)}
                          style={{
                            padding: '4px 12px',
                            backgroundColor: '#fee2e2',
                            color: '#991b1b',
                            border: 'none',
                            borderRadius: '4px',
                            cursor: 'pointer',
                            fontWeight: '600',
                            fontSize: '0.85rem'
                          }}
                        >
                          Remove
                        </button>
                      )}
                    </div>

                    <div style={{ display: 'grid', gap: '12px' }}>
                      <div>
                        <label style={{ display: 'block', marginBottom: '4px', fontWeight: '600', color: '#475569', fontSize: '0.9rem' }}>Input</label>
                        <textarea
                          value={testCase.input}
                          onChange={(e) => handleTestCaseChange(index, 'input', e.target.value)}
                          placeholder='e.g., [2,7,11,15]&#10;9'
                          style={{
                            width: '100%',
                            padding: '10px',
                            border: '1px solid #cbd5e1',
                            borderRadius: '6px',
                            fontSize: '0.85rem',
                            fontFamily: 'monospace',
                            minHeight: '80px',
                            resize: 'vertical',
                            boxSizing: 'border-box'
                          }}
                        />
                      </div>

                      <div>
                        <label style={{ display: 'block', marginBottom: '4px', fontWeight: '600', color: '#475569', fontSize: '0.9rem' }}>Expected Output</label>
                        <textarea
                          value={testCase.expectedOutput}
                          onChange={(e) => handleTestCaseChange(index, 'expectedOutput', e.target.value)}
                          placeholder='e.g., [0,1]'
                          style={{
                            width: '100%',
                            padding: '10px',
                            border: '1px solid #cbd5e1',
                            borderRadius: '6px',
                            fontSize: '0.85rem',
                            fontFamily: 'monospace',
                            minHeight: '60px',
                            resize: 'vertical',
                            boxSizing: 'border-box'
                          }}
                        />
                      </div>

                      <div>
                        <label style={{ display: 'block', marginBottom: '4px', fontWeight: '600', color: '#475569', fontSize: '0.9rem' }}>Explanation (Optional)</label>
                        <textarea
                          value={testCase.explanation}
                          onChange={(e) => handleTestCaseChange(index, 'explanation', e.target.value)}
                          placeholder='Explanation for this test case...'
                          style={{
                            width: '100%',
                            padding: '10px',
                            border: '1px solid #cbd5e1',
                            borderRadius: '6px',
                            fontSize: '0.85rem',
                            fontFamily: 'inherit',
                            minHeight: '60px',
                            resize: 'vertical',
                            boxSizing: 'border-box'
                          }}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <button
                type="submit"
                disabled={problemLoading}
                style={{
                  padding: '12px 24px',
                  backgroundColor: '#059669',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  fontWeight: '700',
                  fontSize: '1rem',
                  cursor: 'pointer',
                  opacity: problemLoading ? 0.6 : 1,
                  transition: 'all 0.2s'
                }}
              >
                {problemLoading ? 'Creating...' : 'Create Challenge'}
              </button>
            </form>
          </div>
        )}

        {/* Manage Problems Tab */}
        {activeTab === 'manageProblems' && (
          <div style={{ backgroundColor: '#fff', borderRadius: '12px', padding: '40px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)' }}>
            <h2 style={{ fontSize: '1.5rem', fontWeight: '700', color: '#1e293b', marginBottom: '24px' }}>Manage Challenges</h2>

            {problemsMessage && (
              <div style={{
                padding: '12px 16px',
                borderRadius: '8px',
                marginBottom: '20px',
                backgroundColor: problemsMessage.includes('Error') ? '#fee2e2' : '#dcfce7',
                color: problemsMessage.includes('Error') ? '#991b1b' : '#166534',
                border: `1px solid ${problemsMessage.includes('Error') ? '#fca5a5' : '#86efac'}`
              }}>
                {problemsMessage}
              </div>
            )}

            {problemsLoading ? (
              <div style={{ textAlign: 'center', padding: '40px', color: '#64748b' }}>
                <p>Loading challenges...</p>
              </div>
            ) : problems.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '40px', color: '#64748b' }}>
                <p>No challenges available.</p>
              </div>
            ) : (
              <div style={{ overflowX: 'auto' }}>
                <table style={{
                  width: '100%',
                  borderCollapse: 'collapse',
                  fontSize: '0.95rem'
                }}>
                  <thead>
                    <tr style={{ backgroundColor: '#f8fafc', borderBottom: '2px solid #e2e8f0' }}>
                      <th style={{ padding: '12px', textAlign: 'left', fontWeight: '700', color: '#334155' }}>Title</th>
                      <th style={{ padding: '12px', textAlign: 'left', fontWeight: '700', color: '#334155' }}>Difficulty</th>
                      <th style={{ padding: '12px', textAlign: 'left', fontWeight: '700', color: '#334155' }}>Created By</th>
                      <th style={{ padding: '12px', textAlign: 'left', fontWeight: '700', color: '#334155' }}>Created</th>
                      <th style={{ padding: '12px', textAlign: 'center', fontWeight: '700', color: '#334155' }}>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {problems.map((problem) => (
                      <tr key={problem._id} style={{ borderBottom: '1px solid #e2e8f0' }}>
                        <td style={{ padding: '12px', color: '#1e293b', fontWeight: '600' }}>{problem.title}</td>
                        <td style={{ padding: '12px', color: '#475569', textTransform: 'capitalize' }}>{problem.difficulty}</td>
                        <td style={{ padding: '12px', color: '#475569' }}>{problem.createdBy?.username || 'Unknown'}</td>
                        <td style={{ padding: '12px', color: '#475569' }}>
                          {new Date(problem.createdAt).toLocaleDateString()}
                        </td>
                        <td style={{ padding: '12px', textAlign: 'center' }}>
                          {deleteProblemConfirm === problem._id ? (
                            <div style={{ display: 'flex', gap: '8px', justifyContent: 'center' }}>
                              <button
                                onClick={() => handleDeleteProblem(problem._id)}
                                style={{
                                  padding: '6px 12px',
                                  backgroundColor: '#ef4444',
                                  color: 'white',
                                  border: 'none',
                                  borderRadius: '4px',
                                  cursor: 'pointer',
                                  fontWeight: '600',
                                  fontSize: '0.85rem'
                                }}
                              >
                                Confirm
                              </button>
                              <button
                                onClick={() => setDeleteProblemConfirm(null)}
                                style={{
                                  padding: '6px 12px',
                                  backgroundColor: '#e5e7eb',
                                  color: '#374151',
                                  border: 'none',
                                  borderRadius: '4px',
                                  cursor: 'pointer',
                                  fontWeight: '600',
                                  fontSize: '0.85rem'
                                }}
                              >
                                Cancel
                              </button>
                            </div>
                          ) : (
                            <button
                              onClick={() => setDeleteProblemConfirm(problem._id)}
                              style={{
                                padding: '6px 12px',
                                backgroundColor: '#fee2e2',
                                color: '#991b1b',
                                border: 'none',
                                borderRadius: '4px',
                                cursor: 'pointer',
                                fontWeight: '600',
                                fontSize: '0.85rem'
                              }}
                            >
                              Remove
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* Manage Users Tab */}
        {activeTab === 'manageUsers' && (
          <div style={{ backgroundColor: '#fff', borderRadius: '12px', padding: '40px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)' }}>
            <h2 style={{ fontSize: '1.5rem', fontWeight: '700', color: '#1e293b', marginBottom: '24px' }}>Manage Users</h2>

            {usersMessage && (
              <div style={{
                padding: '12px 16px',
                borderRadius: '8px',
                marginBottom: '20px',
                backgroundColor: usersMessage.includes('Error') ? '#fee2e2' : '#dcfce7',
                color: usersMessage.includes('Error') ? '#991b1b' : '#166534',
                border: `1px solid ${usersMessage.includes('Error') ? '#fca5a5' : '#86efac'}`
              }}>
                {usersMessage}
              </div>
            )}

            {usersLoading ? (
              <div style={{ textAlign: 'center', padding: '40px', color: '#64748b' }}>
                <p>Loading users...</p>
              </div>
            ) : users.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '40px', color: '#64748b' }}>
                <p>No users found.</p>
              </div>
            ) : (
              <div style={{ overflowX: 'auto' }}>
                <table style={{
                  width: '100%',
                  borderCollapse: 'collapse',
                  fontSize: '0.95rem'
                }}>
                  <thead>
                    <tr style={{ backgroundColor: '#f8fafc', borderBottom: '2px solid #e2e8f0' }}>
                      <th style={{ padding: '12px', textAlign: 'left', fontWeight: '700', color: '#334155' }}>Username</th>
                      <th style={{ padding: '12px', textAlign: 'left', fontWeight: '700', color: '#334155' }}>Email</th>
                      <th style={{ padding: '12px', textAlign: 'left', fontWeight: '700', color: '#334155' }}>Role</th>
                      <th style={{ padding: '12px', textAlign: 'left', fontWeight: '700', color: '#334155' }}>Joined</th>
                      <th style={{ padding: '12px', textAlign: 'center', fontWeight: '700', color: '#334155' }}>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map((user) => (
                      <tr key={user._id} style={{ borderBottom: '1px solid #e2e8f0' }}>
                        <td style={{ padding: '12px', color: '#1e293b', fontWeight: '600' }}>{user.username}</td>
                        <td style={{ padding: '12px', color: '#475569' }}>{user.email}</td>
                        <td style={{ padding: '12px' }}>
                          <span style={{
                            display: 'inline-block',
                            padding: '4px 12px',
                            borderRadius: '20px',
                            fontSize: '0.8rem',
                            fontWeight: '700',
                            backgroundColor: user.role === 'admin' ? '#dbeafe' : '#f3f4f6',
                            color: user.role === 'admin' ? '#1e40af' : '#374151',
                            textTransform: 'capitalize'
                          }}>
                            {user.role}
                          </span>
                        </td>
                        <td style={{ padding: '12px', color: '#475569' }}>
                          {new Date(user.createdAt).toLocaleDateString()}
                        </td>
                        <td style={{ padding: '12px', textAlign: 'center' }}>
                          {deleteConfirm === user._id ? (
                            <div style={{ display: 'flex', gap: '8px', justifyContent: 'center' }}>
                              <button
                                onClick={() => handleDeleteUser(user._id)}
                                style={{
                                  padding: '6px 12px',
                                  backgroundColor: '#ef4444',
                                  color: 'white',
                                  border: 'none',
                                  borderRadius: '4px',
                                  cursor: 'pointer',
                                  fontWeight: '600',
                                  fontSize: '0.85rem'
                                }}
                              >
                                Confirm
                              </button>
                              <button
                                onClick={() => setDeleteConfirm(null)}
                                style={{
                                  padding: '6px 12px',
                                  backgroundColor: '#e5e7eb',
                                  color: '#374151',
                                  border: 'none',
                                  borderRadius: '4px',
                                  cursor: 'pointer',
                                  fontWeight: '600',
                                  fontSize: '0.85rem'
                                }}
                              >
                                Cancel
                              </button>
                            </div>
                          ) : (
                            <button
                              onClick={() => setDeleteConfirm(user._id)}
                              style={{
                                padding: '6px 12px',
                                backgroundColor: '#fee2e2',
                                color: '#991b1b',
                                border: 'none',
                                borderRadius: '4px',
                                cursor: 'pointer',
                                fontWeight: '600',
                                fontSize: '0.85rem'
                              }}
                            >
                              Remove
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminPage;
