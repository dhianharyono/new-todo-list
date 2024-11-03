import React, { useState } from 'react';
import { Task, TaskStatus } from '@/types/task';
import LogModal from './LogModal';

interface TaskListProps {
  tasks: Task[];
  onEdit?: (task: Task) => void;
  onDelete?: (taskId: string) => void;
  onUpdateStatus?: (taskId: string, updatedData: Partial<Task>) => void;
  isModalOpen: boolean;
  setModalOpen: (isOpen: boolean) => void;
  selectedTaskLogs: { timestamp: Date; message: string }[];
  setSelectedTaskLogs: (logs: { timestamp: Date; message: string }[]) => void;
}

const TaskList = ({
  tasks, onEdit, onDelete, onUpdateStatus, isModalOpen, setModalOpen, selectedTaskLogs, setSelectedTaskLogs
}: TaskListProps) => {
  const username = localStorage.getItem('username')?.toLowerCase();
  const role = localStorage.getItem('userRole');
  const [selectedUser, setSelectedUser] = useState<string | 'All'>('All');
  const [isFiltered, setIsFiltered] = useState(false);

  const teamMembers = Array.from(new Set(tasks.map(task => task.assignedTo))).sort();

  const filteredTasks = tasks.filter(task => {
    if (isFiltered && task.assignedTo.toLowerCase() !== username) {
      return false; 
    }
    if (selectedUser !== 'All' && task.assignedTo !== selectedUser) {
      return false; 
    }
    return true; 
  });

  const groupedTasks = filteredTasks.reduce((acc: Record<TaskStatus, Task[]>, task) => {
    acc[task.status as TaskStatus] = acc[task.status as TaskStatus] || [];
    acc[task.status as TaskStatus].push(task);
    return acc;
  }, {
    'Not Started': [],
    'On Progress': [],
    'Done': [],
    'Reject': [],
  });

  const handleShowLogs = (task: Task) => {
    setSelectedTaskLogs(task.logs); 
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
  };

  const getStatusColorBg = (status: TaskStatus) => {
    switch (status) {
      case 'Not Started':
        return 'bg-gray-700 text-white-500';
      case 'On Progress':
        return 'bg-yellow-800 text-white-500';
      case 'Done':
        return 'bg-green-800 text-white-500';
      case 'Reject':
        return 'bg-red-800 text-white-500';
      default:
        return 'bg-gray-800 text-white-500';
    }
  };

  const getStatusColorClass = (status: TaskStatus) => {
    switch (status) {
      case 'Not Started':
        return 'text-gray-500';
      case 'On Progress':
        return 'text-yellow-500';
      case 'Done':
        return 'text-green-500';
      case 'Reject':
        return 'text-red-500';
      default:
        return 'text-gray-500';
    }
  };

  const capitalizeFirstLetter = (val: string) => {
    return String(val).charAt(0).toUpperCase() + String(val).slice(1);
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-4 animate-fadeIn">
        <p className="text-gray-400 mb-2 font-bold text-lg sm:text-xl">
          All Tasks
        </p>
        {role === 'Team' ? (
          <button
            onClick={() => setIsFiltered(!isFiltered)}
            className="bg-blue-800 text-white-500 px-4 py-2 rounded-lg  font-bold cursor-pointer"
          >
            {isFiltered ? 'Show All Tasks' : 'Filter by My Tasks'}
          </button>
        ) : (
          <select
            value={selectedUser}
            onChange={(e) => setSelectedUser(e.target.value)}
            className="bg-blue-800 text-white-500 px-4 py-2 rounded-lg  font-bold cursor-pointer"
          >
            <option value="All">All Team</option>
            {teamMembers.map((member) => (
              <option key={member} value={member}>{member}</option>
            ))}
          </select>
        )}
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {Object.keys(groupedTasks).map((status) => (
          <div key={status} className="bg-gray-900 p-4 rounded-xl h-full animate-fadeIn">
            <h2 className="font-bold text-lg text-gray-500 mb-4">{status}</h2>
            {groupedTasks[status as TaskStatus].length === 0 ? (
              <p className='text-gray-700'>No tasks available</p>
            ) : (
              groupedTasks[status as TaskStatus].map(task => (
                <div key={task.id} className="bg-gray-800 p-4 mb-4 rounded-xl">
                  <h3 className="font-bold text-gray-400 text-base md:text-lg">{capitalizeFirstLetter(task.title)}</h3>
                  <p className='text-gray-500 text-sm md:text-base'>{task.description}</p>
                  <p className={`font-bold text-sm md:text-base text-gray-400`}>
                    Status :
                    <span className={getStatusColorClass(task.status)}>{` ${task.status}`}</span>
                  </p>
                  <p className='text-gray-400 text-sm md:text-base font-bold'>
                    Team :
                    <span className='text-gray-400'>{` ${task.assignedTo}`}</span>
                  </p>
                  <div className="flex flex-wrap gap-2 mt-4 place-content-end">
                    {onEdit && (
                      <button 
                        className="bg-blue-800 px-2 py-1 rounded-lg text-white-500 text-xs md:text-sm w-full sm:w-auto hover:bg-blue-600 font-bold"
                        onClick={() => onEdit(task)}
                      >
                        Edit
                      </button>
                    )}
                    {onDelete && (
                      <button 
                        className="bg-red-800 px-2 py-1 rounded-lg text-white-500 text-xs md:text-sm w-full sm:w-auto hover:bg-red-600 font-bold"
                        onClick={() => onDelete(task.id)}
                      >
                        Delete
                      </button>
                    )}
                    {(onUpdateStatus && username === task.assignedTo.toLowerCase()) && (
                      <select
                        value={task.status}
                        onChange={(e) =>
                          onUpdateStatus(task.id, { 
                            status: e.target.value as TaskStatus 
                          })
                        }
                        className={`rounded-lg px-2 py-1 text-xs md:text-sm w-full font-bold sm:w-auto cursor-pointer ${getStatusColorBg(task.status)}`}
                      >
                        <option value="Not Started">Not Started</option>
                        <option value="On Progress">On Progress</option>
                        <option value="Done">Done</option>
                        <option value="Reject">Reject</option>
                      </select>
                    )}
                    <button
                      onClick={() => handleShowLogs(task)}
                      className="bg-orange-800 px-2 py-1 text-white-500 text-xs md:text-sm rounded-lg w-full sm:w-auto hover:bg-orange-600 font-bold"
                    >
                      Riwayat
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        ))}
        {isModalOpen && <LogModal logs={selectedTaskLogs} onClose={handleCloseModal} />}
      </div>
    </div>
  );
};

export default TaskList;
