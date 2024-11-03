import React from 'react';
import { Task } from '@/types/task';

interface TaskSummaryProps {
  tasks: Task[];
}

const TaskSummary: React.FC<TaskSummaryProps> = ({ tasks }) => {
  const taskCounts = tasks.reduce(
    (acc, task) => {
      acc.total += 1;
      acc[task.status] += 1;
      return acc;
    },
    { total: 0, 'Not Started': 0, 'On Progress': 0, 'Done': 0, 'Reject': 0 }
  );

  return (
    <div className='animate-fadeIn'>
      <h2 className="text-xl font-bold text-gray-400 mb-4">Task Summary</h2>
      <div className="bg-gray-900 p-4 rounded-lg shadow-md mb-6">
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
          <div className="flex flex-col items-center">
            <p className="text-gray-500 text-center">Total Tasks</p>
            <p className="text-2xl font-bold text-blue-400">{taskCounts.total}</p>
          </div>
          <div className="flex flex-col items-center">
            <p className="text-gray-500 text-center">Not Started</p>
            <p className="text-2xl font-bold text-gray-500">{taskCounts['Not Started']}</p>
          </div>
          <div className="flex flex-col items-center">
            <p className="text-gray-500 text-center">On Progress</p>
            <p className="text-2xl font-bold text-yellow-500">{taskCounts['On Progress']}</p>
          </div>
          <div className="flex flex-col items-center">
            <p className="text-gray-500 text-center">Done</p>
            <p className="text-2xl font-bold text-green-500">{taskCounts['Done']}</p>
          </div>
          <div className="flex flex-col items-center">
            <p className="text-gray-500 text-center">Rejected</p>
            <p className="text-2xl font-bold text-red-500">{taskCounts['Reject']}</p>
          </div>
        </div>
      </div>  
    </div>
  );
};

export default TaskSummary;
