'use strict';
/* global $ */

//Model URL:
//https://developer.nps.gov/api/v1/parks?parkCode=acad&api_key=THE_API_KEY

const apiKey = 'RajfA5zxMaYqhNAK8tPrPckv9HmMjmZpmzeeuS0l';
const searchURL = 'https://developer.nps.gov/api/v1/parks';

// const testObject = {
//   foo: 'bar',
//   fizz: 'buzz'
// };

// const testQuery = 'Vancouver'
// const testStates = 'MN,OH'

function formatQueryParams(params) {
  //Get ordered array of keys from params.
  const queryItems = Object.keys(params)
  //Map the query in proper format for the API
    .map(key => `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`);
  console.log(queryItems);
  //Return string of params!
  return queryItems.join('&');
}

function displayResults(responseJson) {
  $('.js-park-result').empty();
  for (let i=0; i < responseJson.data.length; i++) {
    $('.js-park-result').append(
      `<ul>
        <li>
          <h3>${responseJson.data[i].fullName}</h3>
          <p>${responseJson.data[i].description}</p>
          <span><a href="${responseJson.data[i].url}">${responseJson.data[i].url}</a></span>
        </li>
      </ul>`
    );
  }
  $('.js-park-result').removeClass('hidden');
}

function getParks(stateCode, limit) {
  const params = {
    api_key: apiKey,
    stateCode,
    limit,
  };
  const queryString = formatQueryParams(params);
  const url = searchURL + '?' + queryString;
  console.log(url);

  fetch(url)
    .then(response => {
      if (response.ok) {
        return response.json();
      }
      throw new Error(response.statusText);
    })
    .then(responseJson => displayResults(responseJson))
    .catch( error => {
      $('.js-park-error').text(`Error: ${error.message}`);
    });
}

function watchForm() {
  $('#park-search').submit(event => {
    event.preventDefault();
    let stateTerm = $('#state-query').val();
    let resultLimit = $('#limit').val();
    if (!resultLimit) {resultLimit = 10;}
    getParks(stateTerm, resultLimit);
  });
}

$(watchForm);