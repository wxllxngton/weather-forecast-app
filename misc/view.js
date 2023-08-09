class View {
    // Variable to store the user's input location
    inputLocation;

    // DOM element references for various weather details
    _degreeAndCity = document.querySelector('.degree_and_city');
    _dateAndTime = document.querySelector('.date_and_time');
    _weatherSymbol = document.querySelector('.weather_symbol');
    _countryDetails = document.querySelector('.country');
    _latDetails = document.querySelector('.lat');
    _lonDetails = document.querySelector('.lon');
    _cloudDetails = document.querySelector('.cloudy');
    _humidityDetails = document.querySelector('.humidity');
    _windDetails = document.querySelector('.wind');
    _uvDetails = document.querySelector('.uv');
    _weatherIcon = document.querySelector('.weather_icon');
    _searchLocationInput = document.getElementById('location').value;

    // DOM element reference for the list of weather details for the upcoming days
    _nextDaysList = document.querySelector('.next-days.weather_details'); // Targets element with both classes

    // Loader element
    _loader = document.querySelector('.loader');

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
    setBackground(weather) {
        let backgroundImage;

        if (weather == 'Sunny') {
            backgroundImage = `url('https://wallpapers.com/images/hd/sunny-weather-with-cherry-blossom-fr2tn0f21evp0viw.jpg')`;
        } else if (weather == 'Partly cloudy') {
            backgroundImage = `url('https://s7d2.scene7.com/is/image/TWCNews/clouds_from_above')`;
        } else if (weather == 'Rainy') {
            backgroundImage = `url('https://rare-gallery.com/uploads/posts/541375-rain-hd-widescreen.jpg')`;
        } else if (weather == 'Patchy rain possible') {
            backgroundImage = `url('https://i.pinimg.com/736x/c4/cb/5a/c4cb5a4b31bae636381bdc24c7990531--rainy-days-creative-inspiration.jpg')`;
        }

        // Set the background-image of the body element
        document.body.style.backgroundImage = backgroundImage;
    }

    /**
     * Displays the loader gif on the screen.
     *
     * This function shows the loader gif by setting the display style of the element
     * with the class 'loader' to 'block'. The loader is typically used to indicate
     * that some background task is in progress, such as fetching data from an API.
     *
     * @returns {void}
     */
    showLoader() {
        this._loader = document.querySelector('.loader');
        this._loader.style.display = 'block';
    }

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
    hideLoader() {
        this._loader = document.querySelector('.loader');
        this._loader.style.display = 'none';
    }

    getSearchLocation(handler) {
        // Attach the event listener to the button with class 'btn'
        document.querySelector('.btn').addEventListener('click', function (e) {
            e.preventDefault();
            handler(this._searchLocationInput);
        });
    }

    renderView(cityData) {
        // Update the DOM elements with the retrieved cityData
        this._degreeAndCity.textContent = `${cityData.tempC}°C, ${inputLocation}`;
        this._dateAndTime.textContent = `${new Date(cityData.last_updated)}`;
        this._weatherSymbol.textContent = `${cityData.text}`;
        this._countryDetails.textContent = `${cityData.country}`;
        this._latDetails.textContent = `${cityData.lat}`;
        this._lonDetails.textContent = `${cityData.lon}`;
        this._cloudDetails.textContent = `${cityData.cloud}%`;
        this._humidityDetails.textContent = `${cityData.humidity}%`;
        this._windDetails.textContent = `${cityData.windKph} kph`;
        this._uvDetails.textContent = `${cityData.uv}`;
        this._weatherIcon.setAttribute('src', cityData.icon);
        this.setBackground(cityData.text);

        // Generate the forecast HTML
        let html = '';
        cityData.forecast.forEach((el) => {
            const dayOfWeek = String(new Date(el.date)).split(' ')[0];
            html += `<li>${dayOfWeek} <span>${el.day.condition.text}</span></li>`;
        });

        this._nextDaysList.innerHTML = '';
        this._nextDaysList.insertAdjacentHTML('afterbegin', html);
    }
}

export default new View();
