import React, { useState, useEffect, useCallback } from 'react';
import { Plus, Sparkles, Loader2, Sun, Moon, Github } from 'lucide-react';
import { GlassCard } from './components/GlassCard';
import { Background } from './components/Background';
import { TaskItem } from './components/TaskItem';
import { Task, FilterType } from './types';
import { suggestSubtasks } from './services/geminiService';

const STORAGE_KEY = 'glassdo_tasks_v1';
const THEME_KEY = 'glassdo_theme_v1';

const App: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [dateValue, setDateValue] = useState('');
  const [filter, setFilter] = useState<FilterType>(FilterType.ALL);
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [theme, setTheme] = useState<'light' | 'dark'>('dark');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editValue, setEditValue] = useState('');

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try { setTasks(JSON.parse(saved)); } catch (e) { console.error(e); }
    }
    const savedTheme = localStorage.getItem(THEME_KEY) as 'light' | 'dark';
    if (savedTheme) setTheme(savedTheme);
    else if (window.matchMedia('(prefers-color-scheme: light)').matches) setTheme('light');
  }, []);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
    localStorage.setItem(THEME_KEY, theme);
  }, [tasks, theme]);

  const addTask = useCallback((text: string, dateStr?: string) => {
    if (!text.trim()) return;
    const newTask: Task = {
      id: crypto.randomUUID(),
      text: text.trim(),
      completed: false,
      createdAt: Date.now(),
      dueAt: dateStr ? new Date(dateStr).getTime() : null,
    };
    setTasks(prev => [newTask, ...prev]);
    setInputValue('');
    setDateValue('');
  }, []);

  const handleAiSuggest = async () => {
    if (!inputValue.trim()) return;
    setIsAiLoading(true);
    try {
      const currentTaskText = inputValue;
      const currentTaskDate = dateValue;
      addTask(currentTaskText, currentTaskDate);
      const suggestions = await suggestSubtasks(currentTaskText);
      if (suggestions.length > 0) {
        const subtasks = suggestions.map((s, idx) => ({
            id: crypto.randomUUID(),
            text: `↳ ${s}`,
            completed: false,
            createdAt: Date.now() + idx + 1,
            dueAt: currentTaskDate ? new Date(currentTaskDate).getTime() : null,
        }));
        setTasks(prev => [...subtasks, ...prev]);
      }
    } catch (error) {
      console.error(error);
      alert("AI suggestion failed. Check console for details.");
    } finally {
      setIsAiLoading(false);
    }
  };

  const filteredTasks = tasks.filter(t => {
    if (filter === FilterType.ACTIVE) return !t.completed;
    if (filter === FilterType.COMPLETED) return t.completed;
    return true;
  });

  return (
    <div className={theme}>
      <Background />
      <div className="flex flex-col items-center justify-start min-h-screen pt-12 px-4 pb-12 font-sans text-slate-800 dark:text-white transition-colors duration-500">
        
        <GlassCard className="w-full max-w-2xl p-8 relative overflow-hidden animate-fade-in">
          {/* MacOS Controls */}
          <div className="flex gap-2 mb-6 absolute top-6 left-6">
            <div className="w-3 h-3 rounded-full bg-[#ff5f57] shadow-sm"></div>
            <div className="w-3 h-3 rounded-full bg-[#ffbd2e] shadow-sm"></div>
            <div className="w-3 h-3 rounded-full bg-[#28c840] shadow-sm"></div>
          </div>

          <div className="absolute top-6 right-6 flex items-center gap-3">
            <button onClick={() => setTheme(t => t === 'dark' ? 'light' : 'dark')} className="p-2 rounded-full hover:bg-black/5 dark:hover:bg-white/10 text-slate-500 dark:text-white/60 transition-all">
              {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>
            <a href="https://github.com" target="_blank" rel="noreferrer" className="p-2 rounded-full hover:bg-black/5 dark:hover:bg-white/10 text-slate-500 dark:text-white/60 transition-all">
              <Github className="w-5 h-5" />
            </a>
          </div>

          <div className="mt-10 mb-10 flex flex-col items-center">
            <h1 className="text-5xl font-light tracking-tight mb-2 bg-gradient-to-r from-slate-900 via-slate-700 to-slate-900 dark:from-white dark:via-white/70 dark:to-white bg-clip-text text-transparent">GlassDo</h1>
            <p className="text-slate-400 dark:text-white/40 text-sm font-medium tracking-wide uppercase">Clarity in Every Task</p>
          </div>

          {/* Input */}
          <div className="flex flex-col sm:flex-row gap-3 mb-10">
            <div className="relative flex-grow">
               <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && addTask(inputValue, dateValue)}
                placeholder="Next mission..."
                className="w-full bg-black/5 dark:bg-white/5 border border-black/5 dark:border-white/10 rounded-2xl py-4 px-5 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-white/20 focus:outline-none focus:ring-4 focus:ring-pink-500/10 focus:border-pink-500/30 transition-all backdrop-blur-md"
              />
            </div>
            <div className="flex gap-2">
               <input
                type="datetime-local"
                value={dateValue}
                onChange={(e) => setDateValue(e.target.value)}
                className="bg-black/5 dark:bg-white/5 border border-black/5 dark:border-white/10 rounded-2xl py-4 px-4 text-slate-600 dark:text-white/70 text-sm focus:outline-none focus:ring-4 focus:ring-pink-500/10 transition-all backdrop-blur-md [color-scheme:light] dark:[color-scheme:dark]"
              />
              <button
                onClick={() => addTask(inputValue, dateValue)}
                disabled={!inputValue.trim()}
                className="bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-2xl px-5 py-4 hover:scale-105 active:scale-95 transition-all disabled:opacity-30 flex items-center justify-center"
              >
                <Plus className="w-6 h-6" />
              </button>
              <button
                onClick={handleAiSuggest}
                disabled={!inputValue.trim() || isAiLoading}
                className={`bg-gradient-to-br from-pink-500 to-purple-600 text-white rounded-2xl px-5 py-4 hover:scale-105 active:scale-95 transition-all disabled:opacity-30 shadow-lg shadow-pink-500/20 ${isAiLoading ? 'animate-pulse' : ''}`}
              >
                {isAiLoading ? <Loader2 className="w-6 h-6 animate-spin" /> : <Sparkles className="w-6 h-6" />}
              </button>
            </div>
          </div>

          {/* Filters */}
          <div className="flex justify-center gap-2 mb-8 p-1.5 bg-black/5 dark:bg-black/30 rounded-2xl w-fit mx-auto backdrop-blur-xl">
            {[FilterType.ALL, FilterType.ACTIVE, FilterType.COMPLETED].map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-5 py-2 rounded-xl text-[11px] font-bold tracking-widest uppercase transition-all duration-300 ${
                  filter === f 
                    ? 'bg-white dark:bg-white/10 text-slate-900 dark:text-white shadow-xl shadow-black/5' 
                    : 'text-slate-400 dark:text-white/30 hover:text-slate-600 dark:hover:text-white/60'
                }`}
              >
                {f}
              </button>
            ))}
          </div>

          {/* Task List */}
          <div className="space-y-4 max-h-[450px] overflow-y-auto pr-2 custom-scrollbar">
            {filteredTasks.length === 0 ? (
              <div className="text-center py-16 text-slate-300 dark:text-white/10 italic text-lg font-light">
                No active tasks. Take a breath.
              </div>
            ) : (
              filteredTasks.map((task) => (
                <TaskItem 
                  key={task.id}
                  task={task}
                  isEditing={editingId === task.id}
                  editValue={editValue}
                  onToggle={(id) => setTasks(prev => prev.map(t => t.id === id ? { ...t, completed: !t.completed } : t))}
                  onRemove={(id) => setTasks(prev => prev.filter(t => t.id !== id))}
                  onStartEdit={(t) => { setEditingId(t.id); setEditValue(t.text); }}
                  onSaveEdit={() => { 
                    if (editingId && editValue.trim()) setTasks(prev => prev.map(t => t.id === editingId ? { ...t, text: editValue.trim() } : t));
                    setEditingId(null); 
                  }}
                  onCancelEdit={() => setEditingId(null)}
                  onEditChange={setEditValue}
                  formatDate={(ts) => new Date(ts).toLocaleDateString(undefined, { month: 'short', day: 'numeric', hour: '2-digit', minute:'2-digit' })}
                />
              ))
            )}
          </div>
        </GlassCard>

        <div className="mt-12 flex flex-col items-center gap-3">
          <div className="px-4 py-2 bg-white/10 dark:bg-black/20 rounded-full border border-black/5 dark:border-white/5 backdrop-blur-md text-[10px] font-bold tracking-[0.2em] uppercase text-slate-400 dark:text-white/20">
            Open Source • MIT Licensed
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;