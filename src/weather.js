const WEATHER_API_KEY = 'a905177aba65edc1b5a0650a68ae1d20';

export async function getWeather() {
  return new Promise((resolve) => {
    if (!navigator.geolocation) {
      resolve(null);
      return;
    }
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        try {
          const { latitude, longitude } = pos.coords;

          const [currentRes, forecastRes] = await Promise.all([
            fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${WEATHER_API_KEY}&units=metric`),
            fetch(`https://api.openweathermap.org/data/2.5/forecast?lat=${latitude}&lon=${longitude}&appid=${WEATHER_API_KEY}&units=metric&cnt=8`)
          ]);

          const current = await currentRes.json();
          const forecast = await forecastRes.json();

          const temp = Math.round(current.main.temp);
          const condition = current.weather[0].main;
          const city = current.name;

          const rainWarning = getRainWarning(forecast.list);

          resolve({ temp, condition, city, rainWarning });
        } catch {
          resolve(null);
        }
      },
      () => resolve(null)
    );
  });
}

function getRainWarning(forecastList) {
  if (!forecastList) return null;

  const rainyConditions = ['Rain', 'Drizzle', 'Thunderstorm', 'Snow'];

  for (const item of forecastList) {
    const condition = item.weather[0].main;
    if (rainyConditions.includes(condition)) {
      const date = new Date(item.dt * 1000);
      const hours = date.getHours();
      const minutes = date.getMinutes();
      const timeStr = `${hours}:${minutes.toString().padStart(2, '0')}`;
      const isSnow = condition === 'Snow';
      const isStorm = condition === 'Thunderstorm';
      return {
        time: timeStr,
        condition,
        isSnow,
        isStorm
      };
    }
  }
  return null;
}

export function weatherToTags(weather) {
  if (!weather) return [];
  const tags = [];
  const { temp, condition } = weather;

  if (temp >= 25) tags.push('Hot');
  else if (temp >= 18) tags.push('Warm');
  else if (temp >= 10) tags.push('Cool');
  else tags.push('Cold');

  if (condition === 'Rain' || condition === 'Drizzle' || condition === 'Thunderstorm') tags.push('Rain');
  else if (condition === 'Snow') tags.push('Snow');
  else if (condition === 'Clear') tags.push('Sunny');
  else tags.push('Cloudy');

  return tags;
}