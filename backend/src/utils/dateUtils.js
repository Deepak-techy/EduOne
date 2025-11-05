const getDateRange = (days) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const endDate = new Date(today);
    endDate.setDate(endDate.getDate() + days);

    return { startDate: today, endDate };
};

const isToday = (date) => {
    const today = new Date();
    const compareDate = new Date(date);
    return today.toDateString() === compareDate.toDateString();
};

const getWeekRange = () => {
    const today = new Date();
    const startOfWeek = new Date(today);
    startOfWeek.setDate(today.getDate() - today.getDay());
    startOfWeek.setHours(0, 0, 0, 0);

    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(startOfWeek.getDate() + 6);
    endOfWeek.setHours(23, 59, 59, 999);

    return { startOfWeek, endOfWeek };
};

const getPriorityColor = (priority) => {
    const colorMap = {
        High: '#FF5252',
        Medium: '#FFC107',
        Low: '#4CAF50'
    };
    return colorMap[priority] || '#4CAF50';
};

export {
    getDateRange,
    isToday,
    getWeekRange,
    getPriorityColor,
};
