import { useState, useEffect, useCallback } from 'react';
import { getSecondsUntilMidnight, formatTime, getTodayString, shouldRefreshData } from '../utils/timeUtils';

const LAST_UPDATE_KEY = 'ai-leaderboard-last-update';

export const useRefreshTimer = () => {
  const [secondsRemaining, setSecondsRemaining] = useState(() => getSecondsUntilMidnight());
  const [lastUpdateDate, setLastUpdateDate] = useState(() => {
    const stored = localStorage.getItem(LAST_UPDATE_KEY);
    return stored || getTodayString();
  });
  const [needsRefresh, setNeedsRefresh] = useState(() => shouldRefreshData(lastUpdateDate));

  useEffect(() => {
    const timer = setInterval(() => {
      const seconds = getSecondsUntilMidnight();
      setSecondsRemaining(seconds);
      
      // 检查是否跨天
      const today = getTodayString();
      if (today !== lastUpdateDate) {
        setLastUpdateDate(today);
        setNeedsRefresh(true);
        localStorage.setItem(LAST_UPDATE_KEY, today);
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [lastUpdateDate]);

  const triggerRefresh = useCallback(() => {
    const today = getTodayString();
    setLastUpdateDate(today);
    setNeedsRefresh(false);
    localStorage.setItem(LAST_UPDATE_KEY, today);
    setSecondsRemaining(getSecondsUntilMidnight());
  }, []);

  const formattedTime = formatTime(secondsRemaining);
  
  // 计算百分比进度
  const totalSecondsInDay = 24 * 60 * 60;
  const progressPercent = ((totalSecondsInDay - secondsRemaining) / totalSecondsInDay) * 100;

  return {
    secondsRemaining,
    formattedTime,
    progressPercent,
    lastUpdateDate,
    needsRefresh,
    triggerRefresh
  };
};

export default useRefreshTimer;
