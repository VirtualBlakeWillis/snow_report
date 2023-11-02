document.addEventListener('DOMContentLoaded', () => {
  const Mountains = {
    'Snowmass': 'https://api.weather.gov/points/39.2085,-106.9405',
    'Steamboat': 'https://api.weather.gov/points/40.490429,-106.842384',
    'Copper': 'https://api.weather.gov/points/39.501419,-106.1516265',
    'Keystone': 'https://api.weather.gov/points/39.590052,-105.938305',
    'Breckenridge': 'https://api.weather.gov/points/39.4783,-106.0723',
    'Arapahoe Basin': 'https://api.weather.gov/points/39.64167,-105.87167',
    'Eldora Mountain': 'https://api.weather.gov/points/39.9372,-105.5827',
    'Steamboat Springs': 'https://api.weather.gov/points/40.4538,-106.7709',
    'Monarch Mountain': 'https://api.weather.gov/points/38.5102745,-106.3394693',
    'Telluride': 'https://api.weather.gov/points/37.9167,-107.8375',
    'Winter Park': 'https://api.weather.gov/points/39.8628,-105.7787'
 
  };
  const coCorners = {
    'topLeft': 'https://api.weather.gov/points/40.995561,-109.043394',
    'topRight': 'https://api.weather.gov/points/40.986726,-102.080593',
    'bottomLeft': 'https://api.weather.gov/points/37.006031,-109.037998',
    'bottomRight': 'https://api.weather.gov/points/36.998309,-102.051818'
  }

  //const ForecastDetails = []

resp = []

  for (const [key, value] of Object.entries(Mountains)) {
    retrieveJsonData(value)
    .then((data) => {
      console.log(data.properties.forecastZone);
      return [data.properties.forecast, data.properties.forecastGridData, key]
    })
    .then((x) => buildCard(x))
    .catch((err) => console.error(err));
  }
});

async function retrieveJsonData(link) {
  const data = await fetch(link, {
    headers: { 'User-Agent': 'VirtualBlakeWillis'}
  });
  return data.json();
}

async function buildCard(data) {
  const cardTemplate = document.querySelector('#list .card');
  let card;
  let mtnName = data[2];
  let snowPredResults;
  const forecastData = await retrieveJsonData(data[0])
  const GridData = await retrieveJsonData(data[1])
  snowPredResults = snowfallPrediction(GridData)

  card = cardTemplate.cloneNode(true);

  card.style.visibility = 'visible';
  card.setAttribute('id', mtnName)
  card.querySelector('.mountain-identifier-wrapper .mountain-name').innerHTML = mtnName;
  card.querySelector('.mountain-weather').innerHTML =  forecastData.properties.periods[0].shortForecast;
  card.querySelector('#twenty-four-hour span').innerHTML = snowPredResults[0]
  card.querySelector('#forty-eight-hour span').innerHTML = snowPredResults[1]
  card.querySelector('#seventy-two-hour span').innerHTML = snowPredResults[2]



  document.querySelector('#list').appendChild(card);

  // console.log(data[2])
  // console.log(snowPredResults);
  // console.log(forecastData)
  // console.log(GridData)
}

function snowfallPrediction(gridData) {
  let predictions = []
  let temp;
  temp = 0;

  for (i = 0; i < 4; i++) {
    temp += mmToInch(gridData.properties.snowfallAmount.values[i].value)
  }
  predictions.push(Math.round(temp * 100) / 100);
  temp = 0;

  for (i = 4; i < 8; i++) {
    temp += mmToInch(gridData.properties.snowfallAmount.values[i].value)
  }
  predictions.push(Math.round(temp * 100) / 100);
  temp = 0;

  for (i = 8; i < 12; i++) {
    temp += mmToInch(gridData.properties.snowfallAmount.values[i].value)
  }
  predictions.push(Math.round(temp * 100) / 100);

  return (predictions)
}
function mmToInch(mm) {
  return (mm / 25.4)
}
//   const card = document.querySelector('#list #card');


//   for (const [key, value] of Object.entries(Mountains)) {
//     fetch(value, {
//     headers: { 'User-Agent': 'VirtualBlakeWillis'}
//   }).then(function (response) {
// 	// The API call was successful!
// 	if (response.ok) {
// 		return response;
// 	} else {
// 		return Promise.reject(response);
// 	}
//   }).then(function (response) {
//   	// This is the JSON from our response
//     return response.json();
//   }).then(function (data) {
//   if (data.properties.forecast) {
//     return data.properties.forecast;
//   } else {
//     return Promise.reject(response);
//   }
// }).then(function (forecast) {
//   fetch(forecast).then(function (response) {
//     if (response.ok) {
//       return response;
//     } else {
//       return Promise.reject(response);
//     }
//   }).then(function (response) {
//     // This is the JSON from our response
//     return response.json();
//   }).then(function(data) {

//     // Get forecast info and append it to new forecast dictionary
//     let temp = {
//       'mountain': key,
//       'tempature': data.properties.periods[0].temperature,
//       'shortForecast': data.properties.periods[0].shortForecast
//     }
//     ForecastDetails.push(Object.assign({},temp));

//     let newCard = card.cloneNode(true);
//     newCard.style.visibility = 'visible';
//     newCard.setAttribute('id', key)
//     newCard.querySelector('.mountain-identifier-wrapper .mountain-name').innerHTML = key;
//     newCard.querySelector('.mountain-weather').innerHTML =  data.properties.periods[0].shortForecast;

//     document.querySelector('#list').appendChild(newCard);

//   })
  
// }).catch(function (err) {
// 	// There was an error
// 	console.warn('Something went wrong.', err);
// });

// }

// });

// async function retrieveWeatherData(link) {

// }
