let lat, lon;

const loc = document.getElementById('w-location');
const desc = document.getElementById('w-desc');
const temp = document.getElementById('w-string');
const hum = document.getElementById('w-humidity');
const vis = document.getElementById('w-visibility');
const wind = document.getElementById('w-wind-speed');
const city = document.getElementById('city');
const state = document.getElementById('state');
const save = document.getElementById('save');
const modal = document.getElementById('locModal');

loadEventListeners();
function loadEventListeners() {
  window.addEventListener('load', getDbEntry);
  save.addEventListener('click', getCoordinates);
}

async function getDbEntry() {
  const api = '/api';
  const lastEntry = await fetch(api);
  const result = await lastEntry.json();

  let lat = result.lat;
  let lon = result.lon;

  const api_url = `weather/${lat},${lon}`;
  const response = await fetch(api_url);
  const json = await response.json();

  let location = json.timezone;
  let mlocation = location.substring(8);
  let temperature = Math.floor(json.currently.temperature);
  let summary = json.currently.summary;
  let humidity = json.currently.humidity;
  let visibility = json.currently.visibility;
  let windSpeed = json.currently.windSpeed;

  loc.textContent = mlocation;
  desc.textContent = summary;
  temp.textContent = `${temperature} F`;
  hum.textContent = `Humidity: ${humidity}`;
  vis.textContent = `Visibility: ${visibility}`;
  wind.textContent = `Wind Speed: ${windSpeed} `;
}

async function getCoordinates(e) {
  if (city.value === '' || state.value === '') {
    alert('Please enter a city and state!');
  } else {
    cityInput = city.value;
    stateInput = state.value;
    const gapi_url = `coordinates/${cityInput},${stateInput}`;
    const response = await fetch(gapi_url);
    const json = await response.json();

    const lat = json.results[0].geometry.location.lat;
    const lon = json.results[0].geometry.location.lng;

    const api_url = `weather/${lat},${lon}`;
    const wresponse = await fetch(api_url);
    const wjson = await wresponse.json();

    let location = json.results[0].formatted_address;
    let temperature = Math.floor(wjson.currently.temperature);
    let summary = wjson.currently.summary;
    let humidity = wjson.currently.humidity;
    let visibility = wjson.currently.visibility;
    let windSpeed = wjson.currently.windSpeed;

    loc.textContent = location;
    desc.textContent = summary;
    temp.textContent = `${temperature} F`;
    hum.textContent = `Humidity: ${humidity}`;
    vis.textContent = `Visibility: ${visibility}`;
    wind.textContent = `Wind Speed: ${windSpeed} `;

    const data = { lat, lon, temperature, summary };

    const options = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    };
    await fetch('/api', options);
  }
  city.value = '';
  state.value = '';
  e.preventDefault();
}
