import { useEffect, useRef, useState } from 'react';

const empty = { title: '', description: '', priority: 'medium', status: 'todo', dueDate: '' };
export default function TaskForm({ task, onSubmit, onCancel, submitting, externalError = '' }) {
  const [form, setForm] = useState(empty);
  const [error, setError] = useState('');
  const titleRef = useRef(null);
  useEffect(() => {
    setForm(task ? { ...task, dueDate: task.dueDate ? task.dueDate.slice(0, 10) : '' } : empty);
    setError('');
  }, [task]);
  useEffect(() => {
    if (task) titleRef.current?.focus();
  }, [task]);
  const update = (event) => setForm((current) => ({ ...current, [event.target.name]: event.target.value }));
  const submit = async (event) => {
    event.preventDefault();
    if (!form.title.trim()) return setError('A title is required.');
    setError('');
    await onSubmit({ ...form, title: form.title.trim(), dueDate: form.dueDate || null });
    if (!task) setForm(empty);
  };
  return <form className="task-form" onSubmit={submit}>
    <div className="form-heading"><div><p className="eyebrow">{task ? 'Update task' : 'New task'}</p><h2 id={task ? 'edit-task-title' : undefined}>{task ? 'Edit task' : 'Capture an idea'}</h2></div>{task && <button type="button" className="icon-button" onClick={onCancel} disabled={submitting} aria-label="Close edit task dialog">×</button>}</div>
    <label>Title<input ref={titleRef} name="title" value={form.title} onChange={update} placeholder="What needs to be done?" maxLength="120" /></label>
    <label>Description<textarea name="description" value={form.description} onChange={update} placeholder="Add useful context..." rows="4" maxLength="1000" /></label>
    <div className="form-grid"><label>Priority<select name="priority" value={form.priority} onChange={update}><option value="low">Low</option><option value="medium">Medium</option><option value="high">High</option></select></label><label>Due date<input type="date" name="dueDate" value={form.dueDate} onChange={update} /></label></div>
    {task && <label>Status<select name="status" value={form.status} onChange={update}><option value="todo">Todo</option><option value="in_progress">In progress</option><option value="done">Done</option></select></label>}
    {(error || externalError) && <p className="form-error" role="alert">{error || externalError}</p>}
    <button className="primary-button" disabled={submitting}>{submitting ? 'Saving...' : task ? 'Save changes' : 'Add task'}</button>
  </form>;
}
