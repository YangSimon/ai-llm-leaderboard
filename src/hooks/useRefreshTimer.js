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
  const [dataUpdateInfo, setDataUpdateInfo] = useState('');

  // Load version info from the build-generated data
  useEffect(() => {
    const loadVersionInfo = async () => {
      try {
        const { dataVersion } = await import('../data/version');
        if (dataVersion && dataVersion.lastUpdate) {
          const date = new Date(dataVersion.lastUpdate);
          const hours = String(date.getHours()).padStart(2, '0');
          const minutes = String(date.getMinutes()).padStart(2, '0');
          setDataUpdateInfo(`数据上次更新于 ${hours}:${minutes} UTC (${dataVersion.modelCount} 个模型, ${dataVersion.newsCount} 条新闻)`);
        }
      } catch {
        // version.js may not exist in dev mode
        setDataUpdateInfo('');
      }
    };
    loadVersionInfo();
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      const seconds = getSecondsUntilMidnight();
      setSecondsRemaining(seconds);
      
      // Check if crossed midnight
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
  
  // Calculate progress percentage
  const totalSecondsInDay = 24 * 60 * 60;
  const progressPercent = ((totalSecondsInDay - secondsRemaining) / totalSecondsInDay) * 100;

  return {
    secondsRemaining,
    formattedTime,
    progressPercent,
    lastUpdateDate,
    needsRefresh,
    triggerRefresh,
    dataUpdateInfo,
  };
};

export default useRefreshTimer;
