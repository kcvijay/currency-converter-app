const dropList = document.querySelectorAll(".drop-list select"),
  fromCurrency = document.querySelector(".from select"),
  toCurrency = document.querySelector(".to select"),
  getBtn = document.querySelector("form button");

for (let i = 0; i < dropList.length; i++) {
  for (currency_code in country_code) {
    //Selection of USD by Default and "From" and NPR as "To" currencies.
    let selected;
    if (i == 0) {
      selected = currency_code == "USD" ? "selected" : "";
    } else if (i == 1) {
      selected = currency_code == "NPR" ? "selected" : "";
    }

    //Creating option tags passing currency code as a text and value.
    let optionTag = `<option value="${currency_code}" ${selected}>${currency_code}</option>`;

    //Inserting options tags inside select tag.(https://developer.mozilla.org/en-US/docs/Web/API/Element/insertAdjacentHTML)
    dropList[i].insertAdjacentHTML("beforeend", optionTag);
  }
  //Change of flag icons according to the country code on selection tab.
  dropList[i].addEventListener("change", (e) => {
    loadFlag(e.target);
  });
}

function loadFlag(element) {
  for (code in country_code) {
    if (code === element.value) {
      let imgTag = element.parentElement.querySelector("img");

      let countryCode = `${country_code[code]}`; // Lowercase for case sensitive country code url.
      let lowerCountryCode = countryCode.toLowerCase();

      imgTag.src = `https://flagcdn.com/28x21/${lowerCountryCode}.png`; //Fetching country codes for flag image tag.
    }
  }
}

/*window.addEventListener("load", () => {
  getExchangeRate();
});*/ //Fetching exchange rate readily on pageload but, disabled because needed to save limited API calls.

getBtn.addEventListener("click", (e) => {
  e.preventDefault(); //Preventing form from submitting.
  getExchangeRate();
});

// Reversing the currencies
const exchangeIcon = document.querySelector(".drop-list .icon-exchange");

exchangeIcon.addEventListener("click", () => {
  const temporaryCode = fromCurrency.value; // reversing the value of both input selection field.
  fromCurrency.value = toCurrency.value;
  toCurrency.value = temporaryCode;

  getExchangeRate();
  loadFlag(fromCurrency); //Flags changing accordingly.
  loadFlag(toCurrency);
});

function getExchangeRate() {
  const amount = document.querySelector(".amount input");
  let amountVal = amount.value;

  if (amountVal == "" || amountVal == "0") {
    amount.value = "1";
    amountVal = 1; // Setting 1 as a default amount value
  }
  let url = `https://v6.exchangerate-api.com/v6/${apiKey}/latest/${fromCurrency.value}`;
  fetch(url)
    .then((response) => response.json())
    .then((result) => {
      let exchangeRate = result.conversion_rates[toCurrency.value];
      let totalExchangeRate = (amountVal * exchangeRate).toFixed(2);

      let exchangeRateResult = document.querySelector(".exchange-rate");

      exchangeRateResult.innerHTML = `${amountVal} ${fromCurrency.value} = ${totalExchangeRate} ${toCurrency.value}`;
    })
    .catch(() => {
      // Message to show in ERROR occurring.
      exchangeRateResult.innerHTML = `Something went wrong!`;
      exchangeRateResult.style.color = "red";
    });
}
