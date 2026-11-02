import { useEffect, useRef, useState } from 'react';

const labels = { todo: 'Todo', in_progress: 'In progress', done: 'Done' };
const dateLabels = { overdue: 'Overdue', today: 'Due today', upcoming: 'Upcoming' };

function localDateKey(date) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
}

function dueState(value, status) {
  if (!value || status === 'done') return '';
  const due = new Date(value);
  if (Number.isNaN(due.getTime())) return '';
  const today = new Date();
  const dueKey = localDateKey(due);
  const todayKey = localDateKey(today);
  if (dueKey < todayKey) return 'overdue';
  if (dueKey === todayKey) return 'today';
  return 'upcoming';
}

export default function TaskCard({ task, onEdit, onDelete, onStatusChange }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);
  const menuButtonRef = useRef(null);
  const dueStatus = dueState(task.dueDate, task.status);
  useEffect(() => {
    if (!menuOpen) return undefined;
    const closeMenu = (event) => {
      if (!menuRef.current?.contains(event.target)) setMenuOpen(false);
    };
    document.addEventListener('mousedown', closeMenu);
    return () => document.removeEventListener('mousedown', closeMenu);
  }, [menuOpen]);
  const edit = () => { setMenuOpen(false); onEdit(task, menuButtonRef.current); };
  const remove = () => { setMenuOpen(false); onDelete(task); };
  return <article className={`task-card ${task.status === 'done' ? 'is-done' : ''}`}>
    <div className="task-top"><span className={`priority priority-${task.priority}`}>{task.priority}</span><div className="task-actions" ref={menuRef}><button ref={menuButtonRef} type="button" className="more-button" onClick={() => setMenuOpen((open) => !open)} aria-label={`Actions for ${task.title}`} aria-expanded={menuOpen} aria-haspopup="menu">•••</button>{menuOpen && <div className="action-menu" role="menu"><button type="button" role="menuitem" onClick={edit}>Edit task</button><button type="button" role="menuitem" onClick={remove}>Delete task</button></div>}</div></div>
    <h3>{task.title}</h3><p className="description">{task.description || 'No description provided.'}</p>
    <div className="task-meta"><span>◷ {task.dueDate ? new Date(task.dueDate).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' }) : 'No due date'}</span><span>Added {new Date(task.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}</span></div>
    <div className="task-footer"><select value={task.status} onChange={(event) => onStatusChange(task, event.target.value)} aria-label={`Status for ${task.title}`}>{Object.entries(labels).map(([value, label]) => <option key={value} value={value}>{label}</option>)}</select>{dueStatus && <span className={`due-indicator due-${dueStatus}`}>{dueStatus === 'overdue' ? '!' : '•'} {dateLabels[dueStatus]}</span>}<button className="delete-button" onClick={remove}>Delete</button></div>
  </article>;
}
