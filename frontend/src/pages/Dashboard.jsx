import { useEffect, useMemo, useState } from 'react';
import TaskCard from '../components/TaskCard.jsx';
import TaskForm from '../components/TaskForm.jsx';
import { taskService } from '../services/api.js';
import { useTasks } from '../hooks/useTasks.js';

export default function Dashboard() {
  const [status, setStatus] = useState('');
  const [sortBy, setSortBy] = useState('');
  const [sortOrder, setSortOrder] = useState('asc');
  const [editing, setEditing] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [notice, setNotice] = useState('');
  const taskQuery = useMemo(() => ({}), []);
  const { tasks, loading, error, reload } = useTasks(taskQuery);
  const counts = { total: tasks.length, todo: tasks.filter((task) => task.status === 'todo').length, progress: tasks.filter((task) => task.status === 'in_progress').length, done: tasks.filter((task) => task.status === 'done').length };
  const visibleTasks = useMemo(() => {
    const filtered = status ? tasks.filter((task) => task.status === status) : [...tasks];
    if (sortBy === 'dueDate') {
      return filtered.sort((left, right) => (new Date(left.dueDate || 8640000000000000) - new Date(right.dueDate || 8640000000000000)) * (sortOrder === 'desc' ? -1 : 1));
    }
    if (sortBy === 'priority') {
      const priorityOrder = { low: 1, medium: 2, high: 3 };
      return filtered.sort((left, right) => (priorityOrder[left.priority] - priorityOrder[right.priority]) * (sortOrder === 'desc' ? -1 : 1));
    }
    return filtered;
  }, [tasks, status, sortBy, sortOrder]);
  const flash = (message) => { setNotice(message); window.setTimeout(() => setNotice(''), 3000); };
  const save = async (payload) => { setSubmitting(true); try { if (editing) await taskService.update(editing._id, payload); else await taskService.create(payload); setEditing(null); flash(editing ? 'Task updated.' : 'Task created.'); await reload(); } catch (requestError) { flash(requestError.response?.data?.message || 'Operation failed.'); } finally { setSubmitting(false); } };
  const remove = async (task) => { if (!window.confirm(`Delete "${task.title}"?`)) return; try { await taskService.remove(task._id); flash('Task deleted.'); await reload(); } catch (requestError) { flash(requestError.response?.data?.message || 'Unable to delete task.'); } };
  const changeStatus = async (task, nextStatus) => { try { await taskService.update(task._id, { status: nextStatus }); flash('Status updated.'); await reload(); } catch (requestError) { flash(requestError.response?.data?.message || 'Unable to update status.'); } };
  return <main className="app-shell"><header className="header"><div className="brand-mark">✓</div><div><p className="eyebrow">Personal workspace</p><h1>Task flow</h1></div><div className="header-date">{new Date().toLocaleDateString(undefined, { weekday: 'long', month: 'long', day: 'numeric' })}</div></header>
    <section className="welcome"><div><p className="eyebrow">Good to see you</p><h2>Make progress on what matters.</h2><p className="muted">A clear view of your priorities, one task at a time.</p></div><div className="progress-ring"><strong>{counts.done}</strong><span>completed</span></div></section>
    <section className="stats"><div><span className="stat-label">Total tasks</span><strong>{counts.total}</strong><small>In your workspace</small></div><div><span className="stat-label">Todo</span><strong>{counts.todo}</strong><small>Ready to start</small></div><div><span className="stat-label">In progress</span><strong>{counts.progress}</strong><small>Currently active</small></div><div><span className="stat-label">Completed</span><strong>{counts.done}</strong><small>Nice work</small></div></section>
    <div className="content-grid"><TaskForm task={editing} onSubmit={save} onCancel={() => setEditing(null)} submitting={submitting} /><section className="tasks-section"><div className="section-heading"><div><p className="eyebrow">Your workload</p><h2>{status ? `${status === 'in_progress' ? 'In progress' : status} tasks` : 'All tasks'}</h2></div><div className="controls"><select value={status} onChange={(event) => setStatus(event.target.value)}><option value="">All tasks</option><option value="todo">Todo</option><option value="in_progress">In progress</option><option value="done">Done</option></select><select value={sortBy} onChange={(event) => setSortBy(event.target.value)}><option value="">Newest</option><option value="dueDate">Due date</option><option value="priority">Priority</option></select>{sortBy && <button className="sort-button" onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}>{sortOrder === 'asc' ? '↑' : '↓'}</button>}</div></div>{notice && <div className="notice">{notice}</div>}{error && <div className="error-banner">{error}</div>}{loading ? <div className="empty-state">Loading your tasks...</div> : visibleTasks.length ? <div className="task-list">{visibleTasks.map((task) => <TaskCard key={task._id} task={task} onEdit={setEditing} onDelete={remove} onStatusChange={changeStatus} />)}</div> : <div className="empty-state"><span>✦</span><h3>No tasks here yet</h3><p>Add a task to start shaping your day.</p></div>}</section></div>
  </main>;
}
