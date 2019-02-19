let countryHolder;
let amountHolder;
let notificationHolder;

const localKey = 'travel-planner';

// (true or false) ? 'true' : 'false';

const hasItem = key => {
    //return ~getAllItems().indexOf(key); // -1 not found, anders de positie, DE TILDE MAAKT ER TRUE OF FALSE VAN
    return getAllItems().includes(key); // moderner
}; //truefalse

const addItem = key => {
    let countries = getAllItems();
    countries.push(key);
    localStorage.setItem(localKey, JSON.stringify(countries));
}; //void (true || false)?


const removeItem = key => {
    const index = getAllItems().indexOf(key);
    let savedCountries = JSON.parse(localStorage.getItem(localKey));
    savedCountries.splice(index, 1);
    localStorage.setItem(localKey, JSON.stringify(savedCountries));
}; //void (true || false)?

const countItems = value => {
    return getAllItems().length;
}; //integer

const getAllItems = () => {
    return JSON.parse(localStorage.getItem(localKey)) || [];
}; 

const updateCounter = () => {
    amountHolder.innerHTML = countItems();

}

const showNotification = (element) => {
    // 1 Show in js-notification-holder
    let notification = document.createElement('div');
    notification.classList.add('c-notification');
    notification.innerHTML = `
    <h2 class="c-notification__header">You have Selected ${element.dataset.countryName}</h2>
    <button class="c-notification__action">undo</button>`
    notificationHolder.append (notification);
    // 2 fade out after 800ms;
    setTimeout(()=>{
        fadeAndRemoveNotification(notification);
    }, 1500);
}

const fadeAndRemoveNotification = (notification) => {
        //notification.addEventListener('transitionend', function(){
        //    document.querySelector('.js-notification-holder').remove(notification);
        //});

        notification.classList.add('u-fade-out');
        setTimeout(()=>{
            document.querySelector('.js-notification-holder').removeChild(notification);
        }, 800);
}

const addEventListenersToCountries = function(classSelector){
    const countryButtons = document.querySelectorAll(classSelector);

    for(const button of countryButtons){
        button.addEventListener('click', function(){
            console.log({button}); /* curly brackets voor als object weer te geven */
            console.info(this.getAttribute('for'));
            const countryKey = this.getAttribute('for');
            if(hasItem(countryKey)){
                removeItem(countryKey);
            }
            else{
                addItem(countryKey);
                showNotification(button);
            }
            updateCounter();
        });
    }
}

const showCountries = data => {
    console.log(data);
    // #1 loop the data
    // #2 build an HTML-string for each country
    // #3 adjust CSS -> screen.css
    // - Click on country: checked
    // - Flag correct height
    let countries = '';

    for (const country of data) {
        countries += 
        `<article class="js-country-select">  
        <input id="${country.cioc}-${country.alpha2Code}" class="o-hide c-country-input" type="checkbox" ${(hasItem(country.cioc + '-' + country.alpha2Code)) ? 'checked="checked"' : ''}/>
        <label for="${country.cioc}-${country.alpha2Code}" class="c-country js-country" data-country-name=${country.name}>
            <div class="c-country-header">
                <h2 class="c-country-header__name">${country.name}</h2>
                <img class="c-country-header__flag" src="${country.flag}" alt="The flag of Belgium.">
            </div>
            <p class="c-country__native-name">${country.nativeName}</p>
        </label>
    </article>`;

    countryHolder.innerHTML = countries;

    }
    
    addEventListenersToCountries('.js-country');
};

const fetchCountries = region => {
    //backticks
    fetch(`https://restcountries.eu/rest/v2/region/${region}`)
    .then(response => response.json())
    .then(data => showCountries(data))
    .catch(err => console.error(`An error occured, ${err}`));
};

const enableListeners = () => {
    // #1 Get some buttons
    // #2 Listen to the clicks
    // #2.1 Look up the data property
    // #2.2 Get data from the API

    const regionButtons = document.querySelectorAll('.js-region-select');

    for (const button of regionButtons) {
        button.addEventListener('click', function(){
            const region = this.getAttribute('data-region');
            fetchCountries(region);
        });
    }
    countryHolder = document.querySelector('.js-country-holder');
    amountHolder = document.querySelector('.js-amount');
    notificationHolder = document.querySelector('.js-notification-holder');

    //Always start with Europe.
    fetchCountries('Europe');
};

const init = () => {
    console.log("Init (DOM is geladen)")

    enableListeners();
};

function toggleNav() {
    let toggleTrigger = document.querySelectorAll(".js-toggle-nav");
    for (let i = 0; i < toggleTrigger.length; i++) {
        toggleTrigger[i].addEventListener("click", function() {
            document.querySelector("html").classList.toggle("has-mobile-nav");
        })
    }
}

document.addEventListener('DOMContentLoaded', init);