export async function fetchWeather(lat, lon) {
  try {
    const key = "cb28818e636422ed6c19c6306e8ab1cb"; // <-- phải là STRING !!!

    const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&lang=vi&appid=${key}`;

    const res = await fetch(url);

    if (!res.ok) {
      console.error("Weather API error:", res.status, await res.text());
      return null;
    }

    const data = await res.json();

    return {
      temp: Math.round(data.main.temp),
      humidity: data.main.humidity,
      condition: data.weather?.[0]?.main || "unknown",
      icon: data.weather?.[0]?.icon || "",
      description: data.weather?.[0]?.description || "",
    };
  } catch (err) {
    console.error("Weather API exception:", err);
    return null;
  }
}
