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
export const getJSON = function (url, errorMsg = 'Something went wrong') {
    return fetch(url).then((response) => {
        if (!response.ok) {
            throw new Error(`${errorMsg} (${response.status})`);
        }

        return response.json();
    });
};

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
export const geolocationCallback = async function (position) {
    const { latitude, longitude } = position.coords;
    const data = await getJSON(
        `http://api.geonames.org/findNearbyPlaceNameJSON?lat=${latitude}&lng=${longitude}&username=wxllxngton`
    );

    return data.geonames[0].name;

    // // Updates view after closest location is found
    // updateView();
};

// Get the user's current geolocation position and invoke the callback function
navigator.geolocation.getCurrentPosition(geolocationCallback);

export const getCityData = async function (city) {
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
