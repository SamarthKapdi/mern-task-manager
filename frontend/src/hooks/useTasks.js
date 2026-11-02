import { useCallback, useEffect, useState } from 'react';
import { taskService } from '../services/api.js';

export function useTasks(filters) {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const loadTasks = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const response = await taskService.list(filters);
      setTasks(response.data.data);
    } catch (requestError) {
      setError(requestError.response?.data?.message || 'Unable to load tasks.');
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => { loadTasks(); }, [loadTasks]);
  return { tasks, loading, error, reload: loadTasks };
}
