import { executeQuery } from './userService'; // Reuse the shared `executeQuery`

// Fetch tasks from the database
export const fetchTasks = async (): Promise<any[]> => {
    const query = 'SELECT * FROM public.tb_source_leaguetasks'; // Replace with your actual table
    try {
      const tasks = await executeQuery(query, []);
      return tasks;
    } catch (error) {
      console.error('Error in fetchTasksService:', error.message);
      throw new Error('Failed to fetch tasks');
    }
};
