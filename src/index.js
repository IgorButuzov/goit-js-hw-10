import './css/styles.css';
import { fetchCountries } from '../src/fetchCountries.js';
import debounce from 'lodash.debounce';
import Notiflix from 'notiflix';

const DEBOUNCE_DELAY = 300;
const refs = {
    counrtyName: document.querySelector('#search-box'),
    countryList: document.querySelector('.country-list'),
    countryInfo: document.querySelector('.country-info'),
}
let inputCountry = '';

refs.counrtyName.addEventListener('input',
    debounce(onInputCounrty, DEBOUNCE_DELAY));
refs.counrtyName.classList.add('input');

function onInputCounrty(e) {
    inputCountry = e.target.value.trim();
    if (inputCountry === '') {
        emptyRender();
        return;
    };
    fetchCountries(inputCountry)
        .then(countriesRender)
        .catch(onError)
};

function emptyRender() {
    refs.countryList.innerHTML = '';
    refs.countryInfo.innerHTML = '';
};

function onError(err) {
    if (err) {
        Notiflix.Notify.failure('Oops, there is no country with that name');
    }
};

function countriesRender(countries) {
    emptyRender();
    if (countries.length > 10) {
        emptyRender();
        Notiflix.Notify.info("Too many matches found. Please enter a more specific name.");
        return;
    } else if (countries.length < 10 && countries.length > 1) {
        emptyRender();
        createCountryList(countries);
        return;
    } else if (countries.length === 1) {
        emptyRender();
        createCountryCard(countries);
        return;
    }    
};

function createCountryCard(countries) {
    const language = countries.map(({ languages }) => Object.values(languages).join(', '));
    const countryCard = countries.map(({ name, capital, population, flags }) => {
        return `<div class="js-country-card">
                <img src="${flags.svg}" alt="flag" class="js-country-flag">
                <h1 class="js-country-name">${name.official}</h1>
                </div>
                <p class="js-country-info">Capital: ${capital}</p>
                <p class="js-country-info">Population: ${population}</p>
                <p class="js-country-info">Language: ${language}</p>`
    }).join('');
    refs.countryInfo.insertAdjacentHTML('beforeend', countryCard)
};

function createCountryList(countries) {
    const countryList = countries.map(({ name, flags }) => {
        return ` <li class="js-country-card">
                <img src="${flags.svg}" alt="flag-mini" width="32" height="20">
                <p>${name.official}</p>
                </li> `
    }).join('');
    refs.countryList.insertAdjacentHTML('beforeend', countryList);
};