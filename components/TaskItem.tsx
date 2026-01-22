import React from 'react';
import { Check, Trash2, Edit2, X, Clock } from 'lucide-react';
import { Task } from '../types';

interface TaskItemProps {
  task: Task;
  isEditing: boolean;
  editValue: string;
  onToggle: (id: string) => void;
  onRemove: (id: string) => void;
  onStartEdit: (task: Task) => void;
  onSaveEdit: () => void;
  onCancelEdit: () => void;
  onEditChange: (val: string) => void;
  formatDate: (ts: number) => string;
}

export const TaskItem: React.FC<TaskItemProps> = ({
  task, isEditing, editValue, onToggle, onRemove, onStartEdit, onSaveEdit, onCancelEdit, onEditChange, formatDate
}) => {
  return (
    <div 
      className={`group flex items-center gap-4 p-4 rounded-2xl border border-black/5 dark:border-white/5 bg-white/40 dark:bg-white/5 hover:bg-white/80 dark:hover:bg-white/10 transition-all duration-300 animate-slide-up shadow-sm hover:shadow-md ${task.completed ? 'opacity-60' : ''}`}
    >
      <button
        onClick={() => onToggle(task.id)}
        className={`flex-shrink-0 w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all duration-300 ${
          task.completed 
            ? 'bg-emerald-500 border-emerald-500 shadow-lg shadow-emerald-500/20' 
            : 'border-slate-300 dark:border-white/20 hover:border-emerald-400'
        }`}
      >
        {task.completed && <Check className="w-3.5 h-3.5 text-white" />}
      </button>

      <div className="flex-grow min-w-0">
        {isEditing ? (
          <div className="flex items-center gap-2">
            <input
              type="text"
              value={editValue}
              onChange={(e) => onEditChange(e.target.value)}
              onKeyDown={(e) => {
                  if (e.key === 'Enter') onSaveEdit();
                  if (e.key === 'Escape') onCancelEdit();
              }}
              autoFocus
              className="w-full bg-transparent border-b-2 border-pink-500/50 dark:border-white/20 focus:border-pink-500 text-slate-800 dark:text-white focus:outline-none py-1"
            />
            <button onClick={onSaveEdit} className="p-1.5 hover:bg-emerald-500/10 rounded-lg transition-colors"><Check className="w-4 h-4 text-emerald-500" /></button>
            <button onClick={onCancelEdit} className="p-1.5 hover:bg-red-500/10 rounded-lg transition-colors"><X className="w-4 h-4 text-red-500" /></button>
          </div>
        ) : (
          <div className="flex flex-col">
            <span 
              className={`truncate text-base transition-all font-medium ${task.completed ? 'line-through text-slate-400 dark:text-white/30' : 'text-slate-700 dark:text-white/90'}`}
              onDoubleClick={() => onStartEdit(task)}
            >
              {task.text}
            </span>
            <div className="flex items-center gap-3 mt-1.5">
              {task.dueAt && (
                <span className={`text-[11px] font-semibold flex items-center gap-1 px-1.5 py-0.5 rounded-md bg-black/5 dark:bg-white/5 ${task.dueAt < Date.now() && !task.completed ? 'text-red-500 dark:text-red-400' : 'text-slate-500 dark:text-white/40'}`}>
                   <Clock className="w-3 h-3" /> {formatDate(task.dueAt)}
                </span>
              )}
              <span className="text-[10px] uppercase tracking-wider font-bold text-slate-300 dark:text-white/10">
                 {new Date(task.createdAt).toLocaleDateString()}
              </span>
            </div>
          </div>
        )}
      </div>

      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
        {!isEditing && (
          <>
            <button 
              onClick={() => onStartEdit(task)}
              className="p-2 rounded-xl hover:bg-black/5 dark:hover:bg-white/10 text-slate-400 hover:text-slate-700 dark:text-white/40 dark:hover:text-white transition-all"
            >
              <Edit2 className="w-4 h-4" />
            </button>
            <button 
              onClick={() => onRemove(task.id)}
              className="p-2 rounded-xl hover:bg-red-500/10 text-slate-400 hover:text-red-500 dark:text-white/40 dark:hover:text-red-400 transition-all"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </>
        )}
      </div>
    </div>
  );
};