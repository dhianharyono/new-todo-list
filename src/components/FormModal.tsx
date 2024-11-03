import React, { useEffect, useState } from 'react';
import { Task } from '@/types/task';
import { IoMdClose } from "react-icons/io";

interface FormModalProps {
  initialData: Partial<Task> | undefined;
  isEditing: boolean;
  onSave: (e: Partial<Task>) => void;
  onClose: () => void;
  teamMembers: { id: string; name: string }[];
}

const FormModal = ({ initialData, isEditing, onSave, onClose, teamMembers }: FormModalProps) => {
  const [title, setTitle] = useState(initialData?.title || '');
  const [description, setDescription] = useState(initialData?.description || '');
  const [assignedTo, setAssignedTo] = useState(initialData?.assignedTo || '');
  const [titleError, setTitleError] = useState('');
  const [descriptionError, setDescriptionError] = useState('');
  const [assignedToError, setAssignedToError] = useState('');

  useEffect(() => {
    setTitle(initialData?.title || '');
    setDescription(initialData?.description || '');
    setAssignedTo(initialData?.assignedTo || '');
  }, [initialData]);

  const handleSave = () => {
    let valid = true;

    if (title.trim() === '') {
      setTitleError('Title is required');
      valid = false;
    } else {
      setTitleError('');
    }

    if (description.trim() === '') {
      setDescriptionError('Description is required');
      valid = false;
    } else {
      setDescriptionError('');
    }

    if (assignedTo.trim() === '') {
      setAssignedToError('Assignee is required');
      valid = false;
    } else {
      setAssignedToError('');
    }

    if (valid) {
      onSave({ title, description, assignedTo });
      setTitle('');
      setDescription('');
      setAssignedTo('');
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4 sm:p-6 md:p-10">
      <div className="bg-gray-900 rounded-lg p-4 sm:p-6 md:p-8 max-w-lg w-full max-h-[80%] overflow-auto">
        <div className="flex justify-end cursor-pointer text-gray-400">
          <IoMdClose onClick={onClose} />
        </div>
        <div className="px-2 sm:px-6 md:px-8 py-4">
          <p className="text-gray-400 mb-5 font-bold text-lg sm:text-xl">
            {isEditing ? 'Edit Task' : 'Create New Task'}
          </p>
          <div className="mb-4">
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Title"
              className="p-2 w-full text-gray-400 rounded-lg bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {titleError && <p className="text-red-500 text-sm mt-1">{titleError}</p>}
          </div>
          <div className="mb-4">
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Description"
              className="p-2 w-full h-24 text-gray-400 rounded-lg bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
            />
            {descriptionError && <p className="text-red-500 text-sm mt-1">{descriptionError}</p>}
          </div>
          <div className="mb-4">
            <select
              value={assignedTo}
              onChange={(e) => setAssignedTo(e.target.value)}
              className="w-full p-2 text-gray-400 bg-gray-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="" disabled>Select Assignee</option>
              {teamMembers.map((member) => (
                <option key={member.id} value={member.name}>
                  {member.name}
                </option>
              ))}
            </select>
            {assignedToError && <p className="text-red-500 text-sm mt-1">{assignedToError}</p>}
          </div>
          <div className="flex justify-end">
            <button
              className={`${
                isEditing ? 'bg-blue-800 hover:bg-blue-600' : 'bg-green-800 hover:bg-green-600'
              } text-white px-4 py-2 rounded-lg font-bold`}
              onClick={handleSave}
            >
              {isEditing ? 'Update Task' : 'Save Task'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FormModal;
