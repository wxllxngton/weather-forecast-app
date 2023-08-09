'use strict';

// Variable to store the user's input location
let inputLocation;

// DOM element references for various weather details
const degreeAndCity = document.querySelector('.degree_and_city');
const dateAndTime = document.querySelector('.date_and_time');
const weatherSymbol = document.querySelector('.weather_symbol');
const countryDetails = document.querySelector('.country');
const latDetails = document.querySelector('.lat');
const lonDetails = document.querySelector('.lon');
const cloudDetails = document.querySelector('.cloudy');
const humidityDetails = document.querySelector('.humidity');
const windDetails = document.querySelector('.wind');
const uvDetails = document.querySelector('.uv');

// DOM element reference for the list of weather details for the upcoming days
const nextDaysList = document.querySelector('.next-days.weather_details'); // Targets element with both classes

/**
 * Callback function for obtaining the current geolocation position.
 *
 * This function is invoked when the browser successfully retrieves the user's current geolocation position.
 * It logs the coordinates (latitude and longitude) to the console for debugging purposes.
 * The function then makes a request to the Geonames API to find the nearest location based on the obtained coordinates.
 * After receiving the data from the API, it extracts the name of the administrative region (adminName1) from the response,
 * and sets the `inputLocation` variable to the first part of the administrative region name (before the first space).
 * Finally, it calls the `updateView` function to update the view with weather data for the nearest location.
 *
 * @param {GeolocationPosition} position - The object containing the user's current geolocation position.
 * @returns {void}
 * @throws {Error} If there is an issue fetching data from the Geonames API.
 */
const geolocationCallback = async function (position) {
    const { latitude, longitude } = position.coords;
    const data = await getJSON(
        `http://api.geonames.org/findNearbyPlaceNameJSON?lat=${latitude}&lng=${longitude}&username=wxllxngton`
    );

    inputLocation = data.geonames[0].name;

    // Updates view after closest location is found
    updateView();
};

// Get the user's current geolocation position and invoke the callback function
navigator.geolocation.getCurrentPosition(geolocationCallback);

/**
 * Changes the background image of the body element based on the weather condition.
 *
 * This function takes a `weather` parameter representing the weather condition.
 * It sets the `backgroundImage` of the body element to a specific URL based on the
 * provided `weather` value. The function supports the following weather conditions:
 * - 'Sunny': Sets the background image to a sunny weather image with cherry blossoms.
 * - 'Partly cloudy': Sets the background image to a clouds from above image.
 * - 'Rainy': Sets the background image to a rainy weather image.
 * - 'Patchy rain possible': Sets the background image to a creative inspiration rainy days image.
 *
 * @param {string} weather - The weather condition to determine the background image.
 * @return {void}
 */
const setBackground = function (weather) {
    let backgroundImage;

    if (weather == 'Sunny') {
        backgroundImage = `url('https://wallpapers.com/images/hd/sunny-weather-with-cherry-blossom-fr2tn0f21evp0viw.jpg')`;
    } else if (weather == 'Partly cloudy') {
        backgroundImage = `url('https://s7d2.scene7.com/is/image/TWCNews/clouds_from_above')`;
    } else if (weather == 'Rainy') {
        backgroundImage = `url('https://rare-gallery.com/uploads/posts/541375-rain-hd-widescreen.jpg')`;
    } else if (weather == 'Patchy rain possible') {
        backgroundImage = `url('https://i.pinimg.com/736x/c4/cb/5a/c4cb5a4b31bae636381bdc24c7990531--rainy-days-creative-inspiration.jpg')`;
    } else if (weather == 'Mist') {
        backgroundImage = `url('https://c1.wallpaperflare.com/preview/263/621/319/trees-fog-forest-forrest.jpg')`;
    }

    // Set the background-image of the body element
    document.body.style.backgroundImage = backgroundImage;
};

/**
 * Fetches JSON data from the provided URL and returns the parsed response.
 *
 * This function takes a `url` parameter representing the URL to fetch JSON data from.
 * It sends a fetch request to the specified URL and checks if the response is successful (status 200-299).
 * If the response is not successful, it throws an error with the provided `errorMsg` and the response status.
 * If the response is successful, it parses the JSON data and returns the parsed response as a Promise.
 *
 * @param {string} url - The URL to fetch JSON data from.
 * @param {string} [errorMsg='Something went wrong'] - The error message to use in case of fetch error.
 * @returns {Promise} A Promise that resolves to the parsed JSON response.
 * @throws {Error} If the fetch response is not successful.
 */
const getJSON = function (url, errorMsg = 'Something went wrong') {
    return fetch(url).then((response) => {
        if (!response.ok) {
            throw new Error(`${errorMsg} (${response.status})`);
        }

        return response.json();
    });
};

const getCityData = async function (city) {
    try {
        const data = await getJSON(
            `https://api.weatherapi.com/v1/forecast.json?key=5a238c47eb944dec95d105204230408&q=${city}&days=7`
        );
        console.log(data);
        const cityData = {
            cloud: data.current.cloud,
            icon: data.current.condition.icon,
            text: data.current.condition.text,
            tempC: Math.round(data.current.temp_c),
            windKph: data.current.wind_kph,
            forecast: data.forecast.forecastday.splice(1),
            humidity: data.current.humidity,
            last_updated: data.current.last_updated,
            country: data.location.country,
            lat: data.location.lat,
            lon: data.location.lon,
            uv: data.current.uv,
        };

        return cityData;
    } catch (error) {
        console.log(error.message);
        return null; // Return a default value or handle the error appropriately.
    }
};

/**
 * Displays the loader gif on the screen.
 *
 * This function shows the loader gif by setting the display style of the element
 * with the class 'loader' to 'block'. The loader is typically used to indicate
 * that some background task is in progress, such as fetching data from an API.
 *
 * @returns {void}
 */
const showLoader = () => {
    const loader = document.querySelector('.loader');
    loader.style.display = 'block';
};

/**
 * Hides the loader gif from the screen.
 *
 * This function hides the loader gif by setting the display style of the element
 * with the class 'loader' to 'none'. The loader is typically hidden after a task,
 * such as data retrieval from an API, is completed. This indicates that the task
 * has been finished and the actual content is ready to be displayed.
 *
 * @returns {void}
 */
const hideLoader = () => {
    const loader = document.querySelector('.loader');
    loader.style.display = 'none';
};

/**
 * Updates the view with weather data for the specified location.
 *
 * This function fetches weather data for the specified location using the `getCityData` function
 * and then updates the view with the retrieved data. It sets the temperature, date and time,
 * weather symbol, cloud details, humidity details, wind details, and the weather icon.
 * Additionally, it sets the background image based on the weather condition.
 * Finally, it populates the 'nextDaysList' element with forecast data for the upcoming days.
 *
 * If the API call fails or no data is returned for the specified location, the view is not updated.
 *
 * @returns {void}
 */
const updateView = async function () {
    try {
        showLoader(); // Show the loader before fetching data

        const cityData = await getCityData(inputLocation);

        if (!cityData) {
            // Handle the case where there is no data (e.g., API call failed).
            hideLoader(); // Hide the loader if there's no data
            return;
        }

        // Update the DOM elements with the retrieved cityData
        degreeAndCity.textContent = `${cityData.tempC}°C, ${inputLocation}`;
        dateAndTime.textContent = `${new Date(cityData.last_updated)}`;
        weatherSymbol.textContent = `${cityData.text}`;
        countryDetails.textContent = `${cityData.country}`;
        latDetails.textContent = `${cityData.lat}`;
        lonDetails.textContent = `${cityData.lon}`;
        cloudDetails.textContent = `${cityData.cloud}%`;
        humidityDetails.textContent = `${cityData.humidity}%`;
        windDetails.textContent = `${cityData.windKph} kph`;
        uvDetails.textContent = `${cityData.uv}`;

        document
            .querySelector('.weather_icon')
            .setAttribute('src', cityData.icon);

        setBackground(cityData.text);

        // Generate the forecast HTML
        let html = '';
        cityData.forecast.forEach((el) => {
            const dayOfWeek = String(new Date(el.date)).split(' ')[0];
            html += `<li>${dayOfWeek} <span>${el.day.condition.text}</span></li>`;
        });

        // Update the 'nextDaysList' element with forecast data
        if (!nextDaysList) {
            console.log("Error: 'next_days' element not found!");
            hideLoader(); // Hide the loader in case of an error
            return;
        }

        nextDaysList.innerHTML = '';
        nextDaysList.insertAdjacentHTML('afterbegin', html);

        hideLoader(); // Hide the loader after all data has been retrieved
    } catch (error) {
        console.error('Error fetching data:', error);
        hideLoader(); // Hide the loader in case of an error
    }
};

/**
 * Event listener function for the click event on the specified button.
 *
 * This function listens for a click event on the button with the class 'btn'.
 * When the button is clicked, it prevents the default form submission behavior,
 * retrieves the location entered in the input field, and updates the view
 * with weather data for the formatted location. The input location is capitalized,
 * with the first letter of each word in upper case.
 *
 * @param {Event} e - The click event object.
 * @returns {void}
 */
const buttonClickListener = function (e) {
    e.preventDefault();
    const location = document.getElementById('location').value;
    inputLocation = location
        .split(' ')
        .map((word) => word[0].toUpperCase() + word.slice(1))
        .join(' ');
    updateView();
};

// Attach the event listener to the button with class 'btn'
document.querySelector('.btn').addEventListener('click', buttonClickListener);
