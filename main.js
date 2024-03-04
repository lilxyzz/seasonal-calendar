document.addEventListener("DOMContentLoaded", function () {
  async function fetchData() {
    const currentMonth = new Date().getMonth() + 1;
    let season;

    if (currentMonth >= 12 || currentMonth < 2) {
      season = "first-summer";
    } else if (currentMonth >= 2 && currentMonth < 4) {
      season = "second-summer";
    } else if (currentMonth >= 4 && currentMonth < 6) {
      season = "autumn";
    } else if (currentMonth >= 6 && currentMonth < 8) {
      season = "winter";
    } else if (currentMonth >= 8 && currentMonth < 10) {
      season = "first-spring";
    } else {
      season = "second-spring";
    }

    try {
      const response = await fetch(`./noongar-calendar/${season}.json`);
      const data = await response.json();

      const seasonContainer = document.getElementById("season-container");
      const seasonTitle = document.getElementById("season-title");
      const seasonSubtitle = document.getElementById("season-subtitle");
      const seasonDate = document.getElementById("season-date");

      const originalTitle = data.title;
      const originalSubtitle = data.subtitle;
      const originalDate = data.date;
      const extra1 = data.extra1;
      const description = data.description;
      const extra = data.extra;

      seasonTitle.textContent = originalTitle;
      seasonSubtitle.textContent = originalSubtitle;
      seasonDate.textContent = originalDate;

      // Set the tooltip content
      const tooltipContent = `${extra1}\n${originalDate}\n${description}\n${extra}`;
      seasonTitle.setAttribute("data-tooltip", tooltipContent);

      const isMobile = window.innerWidth <= 580;

      function handleInteraction() {
        if (isMobile || !isMobile) {
          // Toggle the content on click/tap or hover on desktop
          if (seasonTitle.textContent === originalTitle) {
            seasonTitle.textContent = extra1;
            seasonSubtitle.textContent = description;
            seasonDate.textContent = extra;
          } else {
            seasonTitle.textContent = originalTitle;
            seasonSubtitle.textContent = originalSubtitle;
            seasonDate.textContent = originalDate;
          }
        }
      }

      // Add interaction event based on device type
      seasonContainer.addEventListener(
        isMobile ? "click" : "mouseenter",
        handleInteraction
      );
      if (!isMobile) {
        // On desktop, use mouseleave event to change content back
        seasonContainer.addEventListener("mouseleave", handleInteraction);
      }
    } catch (error) {
      console.error("Error fetching or parsing data:", error);
      const seasonTitle = document.getElementById("season-title");
      const seasonSubtitle = document.getElementById("season-subtitle");
      const seasonDate = document.getElementById("season-date");
      seasonTitle.textContent = "Error Loading Data";
      seasonSubtitle.textContent = "";
      seasonDate.textContent = "";
    }
  }

  async function fetchWeatherData() {
    const apiKey = "2dad9baf8d4368d2ab19f7dec7d0617d";
    const city = "Perth";
    const apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;

    try {
      const response = await fetch(apiUrl);
      const data = await response.json();

      const temperature = Math.round(data.main.temp); // Rounded temperature
      document.getElementById(
        "temperature-info"
      ).textContent = `${temperature}°C`;

      // Get the weather icon and display it
      const iconCode = data.weather[0].icon;
      const iconUrl = `https://openweathermap.org/img/wn/${iconCode}.png`;

      const weatherIcon = document.getElementById("weather-icon");
      weatherIcon.src = iconUrl; // Set the actual weather icon URL
    } catch (error) {
      console.error("Error fetching or parsing weather data:", error);
      document.getElementById("temperature-info").textContent =
        "Error fetching weather data.";
    }
  }

  fetchData(); // Fetch seasonal data
  fetchWeatherData(); // Fetch weather data
  setInterval(fetchWeatherData, 3600000); // Refresh weather data every hour (3600000 ms)
});
