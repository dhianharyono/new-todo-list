import { Task } from '../types/task';

const TASKS_KEY = 'tasks';
let tasks: Task[] = [];

function saveTasksToLocalStorage() {
  const data = JSON.stringify(tasks);

  // Cek ukuran data sebelum menyimpan
  const dataSize = new Blob([data]).size; // Ukuran dalam byte
  console.log('Data size:', dataSize);

  if (dataSize > 5000000) { // Jika lebih dari 5MB
    console.error('Data exceeds localStorage quota');

    // Logika untuk menghapus tugas lama
    // Misalnya, hapus tugas yang lebih tua dari 1 minggu
    const now = new Date();
    tasks = tasks.filter(task => {
      const taskDate = new Date(task.logs[0].timestamp); // Asumsi log pertama adalah waktu pembuatan
      return (now.getTime() - taskDate.getTime()) < 7 * 24 * 60 * 60 * 1000; // Tugas lebih baru dari 1 minggu
    });

    // Coba simpan lagi setelah menghapus tugas lama
    const newData = JSON.stringify(tasks);
    if (new Blob([newData]).size <= 5000000) {
      localStorage.setItem(TASKS_KEY, newData);
    } else {
      console.error('Still exceeds localStorage quota after cleanup');
    }

    return;
  }

  // Jika ukuran data aman, simpan ke localStorage
  localStorage.setItem(TASKS_KEY, data);
}


function loadTasksFromLocalStorage() {
  const savedTasks = localStorage.getItem(TASKS_KEY);
  if (savedTasks) {
    tasks = JSON.parse(savedTasks);
  }
}

// Memuat data saat modul pertama kali diimpor
if (typeof window !== 'undefined') {
  loadTasksFromLocalStorage();
}

export const taskStore = {
  teamMembers: [
    { id: 'team1', name: 'Alice' },
    { id: 'team2', name: 'Bob' },
  ],

  getTasks: () => tasks,

  addTask: (task: Task) => {
    tasks.push(task);
    saveTasksToLocalStorage();
  },
  
  updateTask: (id: string, updates: Partial<Task>) => {
    const task = tasks.find((t) => t.id === id);
    if (task) {
      Object.assign(task, updates);
      task.logs.push({
        timestamp: new Date(),
        message: `Task updated: ${JSON.stringify(updates)}`,
      });
      saveTasksToLocalStorage();
    }
  },

  deleteTask: (id: string) => {
    tasks = tasks.filter((task) => task.id !== id);
    saveTasksToLocalStorage();
  },

  getTaskById: (id: string): Task | undefined => {
    return tasks.find((task) => task.id === id);
  },

  getTeamMembers() {
    return this.teamMembers;
  },
};
