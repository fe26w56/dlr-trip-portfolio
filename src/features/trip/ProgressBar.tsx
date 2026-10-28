type ProgressBarProps = {
  progress: number;
  editMode: boolean;
  onToggleEdit: () => void;
};

export function ProgressBar({ progress, editMode, onToggleEdit }: ProgressBarProps) {
  return (
    <div className="bg-white dark:bg-slate-900 px-4 py-3 border-b border-slate-100 dark:border-slate-800">
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm font-medium text-slate-600 dark:text-slate-300">{progress}% Complete</span>
        <button
          onClick={onToggleEdit}
          className={`text-xs px-3 py-1 rounded-full transition-colors ${editMode ? "bg-blue-500 text-white" : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300"}`}
        >
          {editMode ? "完了" : "編集"}
        </button>
      </div>
      <div className="h-2 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-blue-400 to-blue-500 rounded-full transition-all duration-500"
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
}
