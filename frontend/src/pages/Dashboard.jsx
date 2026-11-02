import { useEffect, useMemo, useRef, useState } from 'react';
import TaskCard from '../components/TaskCard.jsx';
import TaskForm from '../components/TaskForm.jsx';
import { taskService } from '../services/api.js';
import { useTasks } from '../hooks/useTasks.js';

export default function Dashboard() {
  const [status, setStatus] = useState('');
  const [sortBy, setSortBy] = useState('');
  const [sortOrder, setSortOrder] = useState('asc');
  const [search, setSearch] = useState('');
  const [editing, setEditing] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [notice, setNotice] = useState('');
  const [formError, setFormError] = useState('');
  const lastTrigger = useRef(null);
  const taskQuery = useMemo(() => ({}), []);
  const { tasks, loading, error, reload } = useTasks(taskQuery);
  const counts = {
    total: tasks.length,
    todo: tasks.filter((task) => task.status === 'todo').length,
    progress: tasks.filter((task) => task.status === 'in_progress').length,
    done: tasks.filter((task) => task.status === 'done').length
  };
  const visibleTasks = useMemo(() => {
    const query = search.trim().toLowerCase();
    const filtered = tasks.filter((task) => {
      const matchesStatus = !status || task.status === status;
      const matchesSearch = !query || `${task.title} ${task.description || ''}`.toLowerCase().includes(query);
      return matchesStatus && matchesSearch;
    });
    if (sortBy === 'dueDate') {
      return filtered.sort((left, right) => (new Date(left.dueDate || 8640000000000000) - new Date(right.dueDate || 8640000000000000)) * (sortOrder === 'desc' ? -1 : 1));
    }
    if (sortBy === 'priority') {
      const priorityOrder = { low: 1, medium: 2, high: 3 };
      return filtered.sort((left, right) => (priorityOrder[left.priority] - priorityOrder[right.priority]) * (sortOrder === 'desc' ? -1 : 1));
    }
    return filtered;
  }, [tasks, status, search, sortBy, sortOrder]);

  const closeEditor = () => {
    if (!submitting) {
      setFormError('');
      setEditing(null);
      window.setTimeout(() => lastTrigger.current?.focus(), 0);
    }
  };
  useEffect(() => {
    if (!editing) return undefined;
    const handleKeyDown = (event) => {
      if (event.key === 'Escape') return closeEditor();
      if (event.key !== 'Tab') return;
      const dialog = document.querySelector('.edit-modal');
      const focusable = dialog ? [...dialog.querySelectorAll('button:not(:disabled), input, textarea, select')] : [];
      if (!focusable.length) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [editing, submitting]);

  const flash = (message) => {
    setNotice(message);
    window.setTimeout(() => setNotice(''), 3000);
  };
  const save = async (payload) => {
    setSubmitting(true);
    setFormError('');
    try {
      if (editing) await taskService.update(editing._id, payload);
      else await taskService.create(payload);
      setEditing(null);
      flash(editing ? 'Task updated.' : 'Task created.');
      await reload();
      window.setTimeout(() => lastTrigger.current?.focus(), 0);
    } catch (requestError) {
      const message = requestError.response?.data?.message || 'Operation failed.';
      if (editing) setFormError(message);
      else flash(message);
    } finally {
      setSubmitting(false);
    }
  };
  const openEditor = (task, trigger) => {
    setFormError('');
    lastTrigger.current = trigger || document.activeElement;
    setEditing(task);
  };
  const remove = async (task) => {
    if (!window.confirm(`Delete "${task.title}"?`)) return;
    try {
      await taskService.remove(task._id);
      flash('Task deleted.');
      await reload();
    } catch (requestError) {
      flash(requestError.response?.data?.message || 'Unable to delete task.');
    }
  };
  const changeStatus = async (task, nextStatus) => {
    try {
      await taskService.update(task._id, { status: nextStatus });
      flash('Status updated.');
      await reload();
    } catch (requestError) {
      flash(requestError.response?.data?.message || 'Unable to update status.');
    }
  };
  const hasFilters = Boolean(search.trim() || status);

  return <main className="app-shell">
    <header className="header"><div className="brand-mark">✓</div><div><p className="eyebrow">Personal workspace</p><h1>Task flow</h1></div><div className="header-date">{new Date().toLocaleDateString(undefined, { weekday: 'long', month: 'long', day: 'numeric' })}</div></header>
    <section className="welcome"><div><p className="eyebrow">Good to see you</p><h2>Make progress on what matters.</h2><p className="muted">A clear view of your priorities, one task at a time.</p></div><div className="progress-ring"><strong>{counts.done}</strong><span>completed</span></div></section>
    <section className="stats"><div><span className="stat-label">Total tasks</span><strong>{counts.total}</strong><small>In your workspace</small></div><div><span className="stat-label">Todo</span><strong>{counts.todo}</strong><small>Ready to start</small></div><div><span className="stat-label">In progress</span><strong>{counts.progress}</strong><small>Currently active</small></div><div><span className="stat-label">Completed</span><strong>{counts.done}</strong><small>Nice work</small></div></section>
    <div className="content-grid">
      <TaskForm onSubmit={save} submitting={submitting} />
      <section className="tasks-section">
        <div className="section-heading"><div><p className="eyebrow">Your workload</p><h2>{status ? `${status === 'in_progress' ? 'In progress' : status} tasks` : 'All tasks'}</h2></div><div className="controls"><label className="search-field"><span>Search tasks</span><input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Title or description" /></label><select value={status} onChange={(event) => setStatus(event.target.value)} aria-label="Filter by status"><option value="">All tasks</option><option value="todo">Todo</option><option value="in_progress">In progress</option><option value="done">Done</option></select><select value={sortBy} onChange={(event) => setSortBy(event.target.value)} aria-label="Sort tasks"><option value="">Newest</option><option value="dueDate">Due date</option><option value="priority">Priority</option></select>{sortBy && <button className="sort-button" onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')} aria-label={`Sort ${sortOrder === 'asc' ? 'descending' : 'ascending'}`}>{sortOrder === 'asc' ? '↑' : '↓'}</button>}</div></div>
        {notice && <div className="notice">{notice}</div>}{error && <div className="error-banner">{error}</div>}
        {loading ? <div className="empty-state">Loading your tasks...</div> : visibleTasks.length ? <div className="task-list">{visibleTasks.map((task) => <TaskCard key={task._id} task={task} onEdit={openEditor} onDelete={remove} onStatusChange={changeStatus} />)}</div> : <div className="empty-state"><span>✦</span><h3>{hasFilters ? 'No matching tasks' : 'No tasks here yet'}</h3><p>{hasFilters ? 'Try another search or clear your filters.' : 'Add a task to start shaping your day.'}</p>{!hasFilters && <button type="button" className="empty-action" onClick={() => document.querySelector('.task-form input[name="title"]')?.focus()}>Create your first task</button>}</div>}
      </section>
    </div>
    {editing && <div className="modal-backdrop" onMouseDown={(event) => { if (event.target === event.currentTarget) closeEditor(); }}><div className="edit-modal" role="dialog" aria-modal="true" aria-labelledby="edit-task-title"><TaskForm task={editing} onSubmit={save} onCancel={closeEditor} submitting={submitting} externalError={formError} /></div></div>}
  </main>;
}
