API_KEY = '1b361b825b4cf013f391a151558e2766';

const getLocation = document.getElementById('getLocation');
const displayCurrentWeatherIcon = document.getElementById('currentWeatherIcon');
const body = document.getElementById('body');
const icon = document.getElementById('icon');
const cityName = document.getElementById('cityName');
const searchWeather = document.getElementById('searchWeather');
const searchCityBtn = document.getElementById('searchCityButton');
const table = document.getElementById('table');
const results = document.getElementById('results');

// to get the current location och display weather info
function weather() {
  navigator.geolocation.getCurrentPosition(success, error);

  function success(position) {
    const latitude = position.coords.latitude;
    const longitude = position.coords.longitude;
    //console.log('latitude: ', latitude);
    //console.log('longitude: ', longitude);

    // getLocation.innerHTML =
    //   'Latitude is ' + latitude + '° Longitude is ' + longitude + '°';

    fetch(
      `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${API_KEY}`
    )
      .then((response) => {
        return response.json();
      })
      .then((json) => {
        //console.log(json.name);

        // get the temperature and convert from Kelvin to Celsius and with non decimal
        const tempCelsius = (json.main.temp - 273.15).toFixed(0);

        // display the name of the current location, temperature (Celsius) and the weather description
        getLocation.innerHTML = `
          <p class="current-location">${json.name}</p>
          <p class ="current-temp">${tempCelsius}°C</p>
          <p class="current-description">${json.weather[0].description}</p>
          `;

        //console.log(json.weather[0].icon);
        const currentWeatherIconID = json.weather[0].icon;
        displayCurrentWeatherIcon.innerHTML += `
          <img src="http://openweathermap.org/img/wn/${currentWeatherIconID}@2x.png" alt="weather icon"/>
          `;
        // json.weather[0].main = 'Rain';

        if (json.weather[0].main === 'Clouds') {
          body.style.background = '#F4F7F8';
          body.style.color = '#F47775';
          icon.innerHTML += `
          <img src=./Designs/Design-2/icons/noun_Cloud_1188486.svg alt="cloud icon"/>
          `;
        } else if (json.weather[0].main === 'Clear') {
          body.style.background = '#F7E9B9';
          body.style.color = '#2A5510';
          icon.innerHTML += `
          <img src=./Designs/Design-2/icons/noun_Sunglasses_2055147.svg alt="cloud icon"/>
          `;
        } else if (json.weather[0].main === 'Rain') {
          body.style.background = '#A3DEF7';
          body.style.color = '#164A68';
          icon.innerHTML += `
          <img src=./Designs/Design-2/icons/noun_Umbrella_2030530.svg alt="cloud icon"/>
          `;
        } else {
          body.style.background = '#BEB2C8';
          body.style.color = '#493B54';
        }
      });
  }

  function error() {
    getLocation.innerHTML = 'Unable to retrieve your location';
  }
  getLocation.innerHTML = 'Locating...';
}
weather();

// to search for a city name and display weather info for the next five days

// cityName.addEventListener('keyup', (event) => {
//   if (event.key === 'Enter') {
//     console.log(event.target.value);

let fetchForecast = (city) => {
  console.log('city: ', city);

  table.innerHTML = '';
  const API_URL = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${API_KEY}`;
  fetch(API_URL)
    .then((response) => {
      return response.json();
    })
    .then((json) => {
      console.log(json);

      if (json.cod === '404') {
        results.innerHTML = '<p>city not found  :(</p>';
      } else {
        results.innerHTML = `
          <div>
          <p class="current-location">${json.city.name}</p>
          </div>
          `;

        const newTableRow = () => {
          table.innerHTML += `
              <tr>
                <td class="day"></td>
                <td class="icons"></td>
                <td class="temp"></td>
              </tr>
            `;
        };

        for (i = 0; i < 5; i++) {
          newTableRow();
        }

        const filteredDateAndTime = json.list.filter((item) =>
          item.dt_txt.includes('21:00')
        );
        //console.log(filteredForecast);
        const allDateAndTime = [];
        const allDayNames = [];
        const weekday = [
          'Sunday',
          'Monday',
          'Tuesday',
          'Wednesday',
          'Thursday',
          'Friday',
          'Saturday',
        ];

        filteredDateAndTime.map((item, index) => {
          allDateAndTime[index] = item.dt_txt;
        });
        //console.log(allDateAndTime);

        allDateAndTime.forEach((container, index) => {
          allDayNames[index] = new Date(container).getDay();
          //console.log(weekday[allDayNames[index]]);
        });

        document.querySelectorAll('.day').forEach((name, index) => {
          name.innerHTML += `
            ${weekday[allDayNames[index]]}
            `;
        });

        const filteredTwelveClock = json.list.filter((item) =>
          item.dt_txt.includes('12:00')
        );
        const filteredWeatherIcons = [];
        filteredTwelveClock.forEach((item, index) => {
          filteredWeatherIcons[index] = item.weather[0].icon;
        });

        console.log(filteredTwelveClock);
        console.log(filteredWeatherIcons);

        document.querySelectorAll('.icons').forEach((icon, index) => {
          icon.innerHTML += `
            <img src="http://openweathermap.org/img/wn/${filteredWeatherIcons[index]}@2x.png" alt="weather icon"/>
            `;
        });

        // const filteredTempMax = json.list.map(
        //   (item, index) => item[index].main.temp_max
        // );
        const filteredAllTempMax = [];
        json.list.forEach((_, index) => {
          // store all of the temp_max in Celsius, 8 temp_max per day, total 40
          filteredAllTempMax[index] = json.list[index].main.temp_max - 273.15;
        });
        // console.log('temp max: ', filteredTempMax);
        //console.log('temp max all: ', filteredAllTempMax);

        let tempMaxDayOne = filteredAllTempMax[0];
        for (i = 0; i < 8; i++) {
          if (tempMaxDayOne < filteredAllTempMax[i]) {
            tempMaxDayOne = filteredAllTempMax[i];
          }
        }

        let tempMaxDayTwo = filteredAllTempMax[8];
        for (i = 8; i < 16; i++) {
          if (tempMaxDayTwo < filteredAllTempMax[i]) {
            tempMaxDayTwo = filteredAllTempMax[i];
          }
        }

        let tempMaxDayThree = filteredAllTempMax[16];
        for (i = 16; i < 24; i++) {
          if (tempMaxDayThree < filteredAllTempMax[i]) {
            tempMaxDayThree = filteredAllTempMax[i];
          }
        }

        let tempMaxDayFour = filteredAllTempMax[24];
        for (i = 24; i < 32; i++) {
          if (tempMaxDayFour < filteredAllTempMax[i]) {
            tempMaxDayFour = filteredAllTempMax[i];
          }
        }

        let tempMaxDayFive = filteredAllTempMax[32];
        for (i = 32; i < 40; i++) {
          if (tempMaxDayFive < filteredAllTempMax[i]) {
            tempMaxDayFive = filteredAllTempMax[i];
          }
        }
        // console log and display the number with non decimal
        //console.log('temp max day one: ', tempMaxDayOne.toFixed(0));

        const filteredAllTempMin = [];
        json.list.forEach((_, index) => {
          // store all of the temp_min in Celsius, 8 temp_min per day, total 40
          filteredAllTempMin[index] = json.list[index].main.temp_min - 273.15;
        });
        //console.log('temp min all: ', filteredAllTempMin);
        let tempMinDayOne = filteredAllTempMin[0];
        for (i = 0; i < 8; i++) {
          if (tempMinDayOne > filteredAllTempMax[i]) {
            tempMinDayOne = filteredAllTempMax[i];
          }
        }

        let tempMinDayTwo = filteredAllTempMin[8];
        for (i = 8; i < 16; i++) {
          if (tempMinDayTwo > filteredAllTempMax[i]) {
            tempMinDayTwo = filteredAllTempMax[i];
          }
        }

        let tempMinDayThree = filteredAllTempMin[16];
        for (i = 16; i < 24; i++) {
          if (tempMinDayThree > filteredAllTempMax[i]) {
            tempMinDayThree = filteredAllTempMax[i];
          }
        }

        let tempMinDayFour = filteredAllTempMin[24];
        for (i = 24; i < 32; i++) {
          if (tempMinDayFour > filteredAllTempMax[i]) {
            tempMinDayFour = filteredAllTempMax[i];
          }
        }

        let tempMinDayFive = filteredAllTempMin[32];
        for (i = 32; i < 40; i++) {
          if (tempMinDayFive > filteredAllTempMax[i]) {
            tempMinDayFive = filteredAllTempMax[i];
          }
        }
        //console.log('temp min day one: ', tempMinDayOne.toFixed(0));

        const allMaxMinTemp = [
          `${tempMaxDayOne.toFixed(0)}° / ${tempMinDayOne.toFixed(0)} °C`,
          `${tempMaxDayTwo.toFixed(0)}° / ${tempMinDayTwo.toFixed(0)} °C`,
          `${tempMaxDayThree.toFixed(0)}° / ${tempMinDayThree.toFixed(0)} °C`,
          `${tempMaxDayFour.toFixed(0)}° / ${tempMinDayFour.toFixed(0)} °C`,
          `${tempMaxDayFive.toFixed(0)}° / ${tempMinDayFive.toFixed(0)} °C`,
        ];

        document.querySelectorAll('.temp').forEach((max_min, index) => {
          max_min.innerHTML += `
            ${allMaxMinTemp[index]}
            `;
        });
      }
    });
};
// });

searchCityBtn.addEventListener('click', () => {
  fetchForecast(cityName.value);
  cityName.value = '';
});

cityName.addEventListener('keyup', (event) => {
  if (event.key === 'Enter') {
    fetchForecast(event.target.value);
    event.target.value = '';
  }
});
