const calculateProgress = (tasks) => {
    if (tasks.length === 0) return 0;
    const completedTasks = tasks.filter(task => task.isCompleted).length;
    return Math.round((completedTasks / tasks.length) * 100);
};

const getTaskStats = (tasks) => {
    const total = tasks.length;
    const completed = tasks.filter(task => task.isCompleted).length;
    const pending = total - completed;

    return {
        total,
        completed,
        pending,
        progress: calculateProgress(tasks)
    };
};

export {
    calculateProgress,
    getTaskStats,
};
