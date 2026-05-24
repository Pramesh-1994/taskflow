import React, { useState, useEffect } from 'react';
import axios from 'axios';

const API = process.env.REACT_APP_API_URL || '/api/tasks';

const PRIORITY_COLORS = { high: '#ef4444', medium: '#f59e0b', low: '#22c55e' };
const STATUS_COLORS = { todo: '#475569', 'in-progress': '#d97706', done: '#059669' };
const STATUS_LABELS = { todo: 'To Do', 'in-progress': 'In Progress', done: 'Done' };

const initialForm = { title: '', description: '', status: 'todo', priority: 'medium', dueDate: '' };

export default function App() {
  const [tasks, setTasks] = useState([]);
  const [form, setForm] = useState(initialForm);
  const [editId, setEditId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [filter, setFilter] = useState('all');

  useEffect(() => { fetchTasks(); }, []);

  const fetchTasks = async () => {
    try {
      setLoading(true);
      const res = await axios.get(API);
      setTasks(res.data.data);
    } catch (e) {
      setError('Failed to connect to backend. Is it running?');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editId) {
        await axios.put(`${API}/${editId}`, form);
      } else {
        await axios.post(API, form);
      }
      setForm(initialForm);
      setEditId(null);
      setShowForm(false);
      fetchTasks();
    } catch (e) {
      setError(e.response?.data?.error || 'Something went wrong');
    }
  };

  const handleEdit = (task) => {
    setEditId(task._id);
    setForm({
      title: task.title,
      description: task.description || '',
      status: task.status,
      priority: task.priority,
      dueDate: task.dueDate ? task.dueDate.substring(0, 10) : '',
    });
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this task?')) return;
    await axios.delete(`${API}/${id}`);
    fetchTasks();
  };

  const handleCancel = () => {
    setForm(initialForm);
    setEditId(null);
    setShowForm(false);
  };

  const filtered = filter === 'all' ? tasks : tasks.filter(t => t.status === filter);
  const counts = { all: tasks.length, todo: tasks.filter(t => t.status === 'todo').length, 'in-progress': tasks.filter(t => t.status === 'in-progress').length, done: tasks.filter(t => t.status === 'done').length };

  return (
    <div style={styles.app}>
      {/* Header */}
      <header style={styles.header}>
        <div style={styles.headerInner}>
          <div>
            <div style={styles.logo}>TASK<span style={{color:'#7c3aed'}}>FLOW</span></div>
            <div style={styles.subtitle}>3-Tier Application · React + Node.js + MongoDB</div>
          </div>
          <button style={styles.addBtn} onClick={() => { setShowForm(true); setEditId(null); setForm(initialForm); }}>
            + New Task
          </button>
        </div>
      </header>

      <main style={styles.main}>
        {/* Tier badges */}
        <div style={styles.tierBadges}>
          {[['Frontend', '#7c3aed', 'React'], ['Backend', '#06b6d4', 'Node.js / Express'], ['Database', '#f59e0b', 'MongoDB']].map(([tier, color, tech]) => (
            <div key={tier} style={{...styles.badge, borderColor: color}}>
              <span style={{color, fontWeight:700, fontSize:11}}>TIER</span>
              <span style={{fontSize:13, fontWeight:600}}>{tier}</span>
              <span style={{fontSize:11, color:'#64748b'}}>{tech}</span>
            </div>
          ))}
        </div>

        {error && <div style={styles.error}>{error} <button onClick={() => setError('')} style={styles.errClose}>✕</button></div>}

        {/* Filter tabs */}
        <div style={styles.tabs}>
          {['all', 'todo', 'in-progress', 'done'].map(s => (
            <button key={s} style={{...styles.tab, ...(filter===s ? styles.tabActive : {})}} onClick={() => setFilter(s)}>
              {s === 'all' ? 'All' : STATUS_LABELS[s]} <span style={styles.tabCount}>{counts[s]}</span>
            </button>
          ))}
        </div>

        {/* Modal Form */}
        {showForm && (
          <div style={styles.overlay}>
            <div style={styles.modal}>
              <h2 style={styles.modalTitle}>{editId ? 'Edit Task' : 'Create New Task'}</h2>
              <form onSubmit={handleSubmit}>
                <label style={styles.label}>Title *</label>
                <input style={styles.input} value={form.title} onChange={e => setForm({...form, title: e.target.value})} placeholder="Task title..." required />

                <label style={styles.label}>Description</label>
                <textarea style={{...styles.input, height:80, resize:'vertical'}} value={form.description} onChange={e => setForm({...form, description: e.target.value})} placeholder="Optional description..." />

                <div style={styles.row}>
                  <div style={{flex:1}}>
                    <label style={styles.label}>Status</label>
                    <select style={styles.input} value={form.status} onChange={e => setForm({...form, status: e.target.value})}>
                      <option value="todo">To Do</option>
                      <option value="in-progress">In Progress</option>
                      <option value="done">Done</option>
                    </select>
                  </div>
                  <div style={{flex:1}}>
                    <label style={styles.label}>Priority</label>
                    <select style={styles.input} value={form.priority} onChange={e => setForm({...form, priority: e.target.value})}>
                      <option value="low">Low</option>
                      <option value="medium">Medium</option>
                      <option value="high">High</option>
                    </select>
                  </div>
                </div>

                <label style={styles.label}>Due Date</label>
                <input style={styles.input} type="date" value={form.dueDate} onChange={e => setForm({...form, dueDate: e.target.value})} />

                <div style={styles.formActions}>
                  <button type="button" style={styles.cancelBtn} onClick={handleCancel}>Cancel</button>
                  <button type="submit" style={styles.submitBtn}>{editId ? 'Update' : 'Create'} Task</button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Tasks grid */}
        {loading ? (
          <div style={styles.centered}>Loading tasks...</div>
        ) : filtered.length === 0 ? (
          <div style={styles.empty}>
            <div style={{fontSize:48}}>📋</div>
            <div>No tasks yet. Create one!</div>
          </div>
        ) : (
          <div style={styles.grid}>
            {filtered.map(task => (
              <div key={task._id} style={styles.card}>
                <div style={styles.cardTop}>
                  <span style={{...styles.statusBadge, background: STATUS_COLORS[task.status] + '22', color: STATUS_COLORS[task.status]}}>
                    {STATUS_LABELS[task.status]}
                  </span>
                  <span style={{...styles.priorityDot, background: PRIORITY_COLORS[task.priority]}} title={task.priority + ' priority'} />
                </div>
                <h3 style={styles.cardTitle}>{task.title}</h3>
                {task.description && <p style={styles.cardDesc}>{task.description}</p>}
                <div style={styles.cardMeta}>
                  <span style={{color: PRIORITY_COLORS[task.priority], fontSize:11, fontWeight:700}}>{task.priority.toUpperCase()}</span>
                  {task.dueDate && <span style={styles.dueDate}>📅 {new Date(task.dueDate).toLocaleDateString()}</span>}
                </div>
                <div style={styles.cardActions}>
                  <button style={styles.editBtn} onClick={() => handleEdit(task)}>Edit</button>
                  <button style={styles.deleteBtn} onClick={() => handleDelete(task._id)}>Delete</button>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}

const styles = {
  app: { minHeight: '100vh', background: '#0a0a0f' },
  header: { borderBottom: '1px solid #1e1e2e', padding: '0 24px', background: '#12121a' },
  headerInner: { maxWidth: 1100, margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '20px 0' },
  logo: { fontFamily: "'Syne', sans-serif", fontSize: 28, fontWeight: 800, letterSpacing: 2, color: '#e2e8f0' },
  subtitle: { fontSize: 11, color: '#475569', marginTop: 4, fontFamily: "'Space Mono', monospace" },
  addBtn: { background: '#7c3aed', color: '#fff', border: 'none', padding: '10px 20px', borderRadius: 8, fontFamily: "'Syne', sans-serif", fontWeight: 600, fontSize: 14, cursor: 'pointer' },
  main: { maxWidth: 1100, margin: '0 auto', padding: '24px' },
  tierBadges: { display: 'flex', gap: 12, marginBottom: 24, flexWrap: 'wrap' },
  badge: { display: 'flex', flexDirection: 'column', padding: '10px 16px', border: '1px solid', borderRadius: 8, background: '#12121a', gap: 2, minWidth: 120 },
  error: { background: '#ef444422', border: '1px solid #ef4444', color: '#ef4444', padding: '12px 16px', borderRadius: 8, marginBottom: 16, display: 'flex', justifyContent: 'space-between', fontSize: 14 },
  errClose: { background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer', fontSize: 16 },
  tabs: { display: 'flex', gap: 8, marginBottom: 24, borderBottom: '1px solid #1e1e2e', paddingBottom: 0 },
  tab: { background: 'none', border: 'none', color: '#64748b', padding: '10px 16px', cursor: 'pointer', fontFamily: "'Syne', sans-serif", fontSize: 14, borderBottom: '2px solid transparent', marginBottom: -1 },
  tabActive: { color: '#e2e8f0', borderBottomColor: '#7c3aed' },
  tabCount: { background: '#1e1e2e', borderRadius: 10, padding: '2px 6px', fontSize: 11, marginLeft: 6 },
  grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 16 },
  card: { background: '#12121a', border: '1px solid #1e1e2e', borderRadius: 12, padding: 20, display: 'flex', flexDirection: 'column', gap: 10 },
  cardTop: { display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
  statusBadge: { fontSize: 11, fontWeight: 700, padding: '3px 8px', borderRadius: 12 },
  priorityDot: { width: 10, height: 10, borderRadius: '50%' },
  cardTitle: { fontSize: 16, fontWeight: 600, color: '#e2e8f0', lineHeight: 1.3 },
  cardDesc: { fontSize: 13, color: '#64748b', lineHeight: 1.5 },
  cardMeta: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 4 },
  dueDate: { fontSize: 11, color: '#475569' },
  cardActions: { display: 'flex', gap: 8, marginTop: 4 },
  editBtn: { flex: 1, background: '#1e1e2e', border: '1px solid #2d2d3e', color: '#e2e8f0', padding: '7px 0', borderRadius: 6, cursor: 'pointer', fontFamily: "'Syne', sans-serif", fontSize: 13 },
  deleteBtn: { flex: 1, background: '#ef444411', border: '1px solid #ef444433', color: '#ef4444', padding: '7px 0', borderRadius: 6, cursor: 'pointer', fontFamily: "'Syne', sans-serif", fontSize: 13 },
  overlay: { position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100 },
  modal: { background: '#12121a', border: '1px solid #1e1e2e', borderRadius: 16, padding: 32, width: '90%', maxWidth: 480, maxHeight: '90vh', overflowY: 'auto' },
  modalTitle: { fontSize: 20, fontWeight: 700, marginBottom: 24, color: '#e2e8f0' },
  label: { display: 'block', fontSize: 12, fontWeight: 600, color: '#64748b', marginBottom: 6, marginTop: 16, textTransform: 'uppercase', letterSpacing: 0.5 },
  input: { width: '100%', background: '#0a0a0f', border: '1px solid #1e1e2e', borderRadius: 8, padding: '10px 12px', color: '#e2e8f0', fontFamily: "'Syne', sans-serif", fontSize: 14, outline: 'none' },
  row: { display: 'flex', gap: 12 },
  formActions: { display: 'flex', gap: 12, marginTop: 24 },
  cancelBtn: { flex: 1, background: 'none', border: '1px solid #1e1e2e', color: '#64748b', padding: 12, borderRadius: 8, cursor: 'pointer', fontFamily: "'Syne', sans-serif", fontSize: 14 },
  submitBtn: { flex: 2, background: '#7c3aed', border: 'none', color: '#fff', padding: 12, borderRadius: 8, cursor: 'pointer', fontFamily: "'Syne', sans-serif", fontSize: 14, fontWeight: 600 },
  centered: { textAlign: 'center', padding: 60, color: '#64748b' },
  empty: { textAlign: 'center', padding: 60, color: '#64748b', display: 'flex', flexDirection: 'column', gap: 12, alignItems: 'center' },
};
