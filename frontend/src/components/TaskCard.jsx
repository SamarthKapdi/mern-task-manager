const labels = { todo: 'Todo', in_progress: 'In progress', done: 'Done' };
export default function TaskCard({ task, onEdit, onDelete, onStatusChange }) {
  return <article className={`task-card ${task.status === 'done' ? 'is-done' : ''}`}>
    <div className="task-top"><span className={`priority priority-${task.priority}`}>{task.priority}</span><button className="more-button" onClick={() => onEdit(task)} aria-label="Edit task">•••</button></div>
    <h3>{task.title}</h3><p className="description">{task.description || 'No description provided.'}</p>
    <div className="task-meta"><span>◷ {task.dueDate ? new Date(task.dueDate).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' }) : 'No due date'}</span><span>Added {new Date(task.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}</span></div>
    <div className="task-footer"><select value={task.status} onChange={(event) => onStatusChange(task, event.target.value)} aria-label={`Status for ${task.title}`}>{Object.entries(labels).map(([value, label]) => <option key={value} value={value}>{label}</option>)}</select><button className="delete-button" onClick={() => onDelete(task)}>Delete</button></div>
  </article>;
}
