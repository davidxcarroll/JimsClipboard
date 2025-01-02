// Set PST as our base timezone
export const APP_TIMEZONE = 'America/Los_Angeles';

export const formatToPST = (date) => {
    if (!date) return null;
    return new Date(date.toLocaleString('en-US', { timeZone: APP_TIMEZONE }));
};

export const formatGameTime = (date) => {
    if (!date) return '';
    return date.toLocaleTimeString('en-US', {
        timeZone: APP_TIMEZONE,
        hour: 'numeric',
        minute: '2-digit',
        hour12: true
    });
};

export const formatGameDate = (date) => {
    if (!date) return '';
    return date.toLocaleDateString('en-US', {
        timeZone: APP_TIMEZONE,
        weekday: 'short',
        month: 'short',
        day: 'numeric'
    });
};

export const getDateKey = (date) => {
    if (!date) return '';
    return date.toLocaleDateString('en-US', {
        timeZone: APP_TIMEZONE,
        year: 'numeric',
        month: '2-digit',
        day: '2-digit'
    });
};

export const isPSTDateInFuture = (date) => {
    if (!date) return false;
    const now = new Date();
    const pstNow = formatToPST(now);
    const pstDate = formatToPST(date);
    return pstDate > pstNow;
};

export const formatToTimeZone = (date, timeZone = 'America/Los_Angeles') => {
    if (!date) return '';
    
    try {
        return new Date(date).toLocaleString('en-US', {
            timeZone,
            weekday: 'short',
            month: 'short',
            day: 'numeric',
            hour: 'numeric',
            minute: '2-digit',
            hour12: true
        });
    } catch (error) {
        console.error('Error formatting date:', error);
        return date.toString();
    }
}