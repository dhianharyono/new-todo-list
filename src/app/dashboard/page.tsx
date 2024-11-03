'use client'

import { useEffect, useState } from 'react';
import { taskStore } from '../../lib/taskStore';
import TaskList from '../../components/TaskList';
import { v4 as uuidv4 } from 'uuid';
import { Task } from '@/types/task';
import { useRouter } from 'next/navigation';
import FormModal from '@/components/FormModal';
import TaskSummary from '@/components/TaskSummary';
import LogModal from '@/components/LogModal';

export default function DashboardPage() {
  const router = useRouter();
  const username = localStorage.getItem('username');
  const [tasks, setTasks] = useState<Task[]>([]);
  const [editingTask, setEditingTask] = useState<Task | undefined>(undefined);
  const [role, setRole] = useState<'Lead' | 'Team' | null>(null);
  const [openFormTask, setOpenFormTask] = useState(false);
  const [teamMembers, setTeamMembers] = useState<{ id: string; name: string }[]>([]);
  const [isModalForm, setModalForm] = useState(false);
  const [isModalOpen, setModalOpen] = useState(false);
  const [selectedTaskLogs, setSelectedTaskLogs] = useState<{ timestamp: Date; message: string }[]>([]);
  
  const [notification, setNotification] = useState<string | null>(null);
  const [notificationColor, setNotificationColor] = useState<string>('bg-green-600');

  useEffect(() => {
    const userRole = localStorage.getItem('userRole');
    if (!userRole) {
      router.push('/login');
    } else {
      setRole(userRole as 'Lead' | 'Team');
      setTasks(taskStore.getTasks());
      setTeamMembers(taskStore.getTeamMembers());
    }
  }, [router]);

  const handleSaveTask = (taskData: Partial<Task>) => {
    if (role === 'Lead') {
      if (editingTask) {
        taskStore.updateTask(editingTask.id, taskData);
        setNotification("Task updated successfully!");
        setNotificationColor('bg-green-600'); 
      } else {
        taskStore.addTask({
          id: uuidv4(),
          createdBy: 'Lead',
          assignedTo: taskData.assignedTo || 'Alice',
          logs: [{ timestamp: new Date(), message: 'Task created' }],
          title: taskData.title ?? 'Untitled Task',
          description: taskData.description ?? '',
          status: taskData.status ?? 'Not Started',
        });
        setNotification("Task added successfully!");
        setNotificationColor('bg-green-600');  
      }
      setTasks([...taskStore.getTasks()]);
      setEditingTask(undefined);
      setOpenFormTask(false);
      
      setTimeout(() => setNotification(null), 3000);
    }
  };

  const handleUpdateTaskStatus = (taskId: string, updatedData: Partial<Task>) => {
    if (role === 'Team') {
      const task = taskStore.getTaskById(taskId);
      if (task) {
        const newLogs = [
          ...task.logs,
          { timestamp: new Date(), message: `Status updated to ${updatedData.status}` },
        ];

        taskStore.updateTask(taskId, {
          status: updatedData.status,
          description: updatedData.description ?? task.description,
          logs: newLogs,
        });
        setTasks([...taskStore.getTasks()]);
        setNotification("Task status updated successfully!");
        setNotificationColor('bg-green-600');  
        
        setTimeout(() => setNotification(null), 3000);
      }
    }
  };

  const handleEditTask = (task: Task) => {
    if (role === 'Lead') {
      setOpenFormTask(true);
      setEditingTask(task);
    }
  };

  const handleDeleteTask = (taskId: string) => {
    if (role === 'Lead') {
      taskStore.deleteTask(taskId);
      setTasks([...taskStore.getTasks()]);
      setNotification("Task deleted successfully!");
      setNotificationColor('bg-red-600');  
      
      setTimeout(() => setNotification(null), 3000);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('userRole');
    router.push('/login');
  };

  const handleAddTask = () => {
    setOpenFormTask(true);
  };

  const handleCloseModal = () => {
    setOpenFormTask(false);
    setEditingTask(undefined);
  };

  const handleCloseModalForm = () => {
    setModalForm(false);
  };

  const capitalizeFirstLetter = (val: string | null) => {
    return String(val).charAt(0).toUpperCase() + String(val).slice(1);
  };

  return (
    <div className="px-4 py-4 sm:px-6 lg:px-10 lg:py-5">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-xl sm:text-2xl font-bold text-gray-400">
          Dashboard {role} {role !== 'Lead' && `(${capitalizeFirstLetter(username)})`}
        </h1>
        <button
          onClick={handleLogout}
          className="bg-red-800 px-2 py-1 text-white rounded-lg w-20 sm:w-24 font-bold hover:bg-red-600"
        >
          LOGOUT
        </button>
      </div>
      
      {notification && (
        <div className={`fixed top-5 left-1/2 sm:left-auto sm:top-10 sm:right-10 transform -translate-x-1/2 sm:translate-x-0 ${notificationColor} text-white px-4 py-2 rounded-lg shadow-lg z-10 text-center sm:text-left`}>
          {notification}
        </div>
      )}

      <div className="m-4 sm:m-10 lg:m-20">
        {role === 'Lead' && (
          <>
            <div className="flex justify-end mb-4">
              <button
                onClick={handleAddTask}
                className="bg-green-800 px-3 py-2 text-white rounded-lg font-bold hover:bg-green-600 w-full sm:w-auto"
              >
                CREATE TASK
              </button>
            </div>
            <TaskSummary tasks={tasks} />
          </>
        )}
        <TaskList
          tasks={tasks}
          onEdit={role === 'Lead' ? handleEditTask : undefined}
          onDelete={role === 'Lead' ? handleDeleteTask : undefined}
          onUpdateStatus={role === 'Team' ? handleUpdateTaskStatus : undefined}
          isModalOpen={isModalOpen}
          setModalOpen={setModalOpen}
          selectedTaskLogs={selectedTaskLogs}
          setSelectedTaskLogs={setSelectedTaskLogs}
        />
        {openFormTask && (
          <FormModal
            initialData={editingTask}
            onSave={handleSaveTask}
            isEditing={!!editingTask}
            onClose={handleCloseModal}
            teamMembers={teamMembers}
          />
        )}
        {isModalForm &&
          <LogModal
            logs={selectedTaskLogs}
            onClose={handleCloseModalForm}
          />
        }
      </div>
    </div>
  );
}
