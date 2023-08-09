import View from './view.js';
import * as model from './model.js';

/**
 * Event listener function for the click event on the specified button.
 *
 * This function listens for a click event on the button with the class 'btn'.
 * When the button is clicked, it prevents the default form submission behavior,
 * retrieves the location entered in the input field, and updates the view
 * with weather data for the formatted location. The input location is capitalized,
 * with the first letter of each word in upper case.
 *
 * @returns {void}
 */
const controlSearchLocation = function (searchLocation) {
    View.inputLocation = searchLocation
        .split(' ')
        .map((word) => word[0].toUpperCase() + word.slice(1))
        .join(' ');
    controlView();
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
const controlView = async function () {
    try {
        View.showLoader(); // Show the loader before fetching data

        const cityData = await model.getCityData(View.inputLocation);

        if (!cityData) {
            // Handle the case where there is no data (e.g., API call failed).
            View.hideLoader(); // Hide the loader if there's no data
            return;
        }

        View.renderView(cityData);

        View.hideLoader(); // Hide the loader after all data has been retrieved
    } catch (error) {
        console.error('Error fetching data:', error);
        View.hideLoader(); // Hide the loader in case of an error
    }
};

const init = function () {
    View.inputLocation = model.geolocationCallback();
    View.getSearchLocation(controlSearchLocation);
};

init();
