let airport_origin = []
let airport_dest = []
let resultTextarea = ""

const convertCurrency = (value, currency) =>{
    switch (currency) {
        case "EUR":
            value = value * 4.63
            break;
        case "GBP":
            value = value * 5.45
            break;
        case "USD":
            value = value * 4.12
            break;
        default:
            value = "Policz samemu :/"
            break;
    }
    return Math.round(value * 100) / 100
}

const clearTextarea = () => {
    document.getElementById("resultTextarea").value = ""
}

const updateTextarea = (newValue) => {
    resultTextarea = document.getElementById("resultTextarea").value
    document.getElementById("resultTextarea").value = resultTextarea + newValue + "\n"
}   

const preSearchFlight = async () =>{
    airport_origin = document.getElementById("airport_origin").value.split(/[ ,]+/)
    airport_dest = document.getElementById("airport_dest").value.split(/[ ,]+/)
    outboundDateFrom = document.getElementById("outboundDateFrom").value
    outboundDateTo = document.getElementById("outboundDateTo").value

    // airport_origin = ["KRK", "WRO", "POZ", "KTW"]
    // airport_dest = ["RAK", "BGY"]
    // outboundDateFrom = "2022-04-28"
    // outboundDateTo = "2022-04-29"

    for(let origins = 0; origins < airport_origin.length; origins++){
        for(let dests = 0; dests < airport_dest.length; dests++){
            result = "Szukam lotów z: " + airport_origin[origins].toUpperCase() + " do: " + airport_dest[dests].toUpperCase()
            updateTextarea(result)
            await searchFlight(airport_origin[origins].toUpperCase(), airport_dest[dests].toUpperCase(), outboundDateFrom, outboundDateTo)
        }
    }
}

const searchFlight = async (airport_origin, airport_dest, outboundDateFrom, outboundDateTo) =>{
    let response = await fetch(`https://www.ryanair.com/api/farfnd/3/oneWayFares/${airport_origin}/${airport_dest}/cheapestPerDay?outboundDateFrom=${outboundDateFrom}&outboundDateTo=${outboundDateTo}`)
    let response_json = await response.json()

    if(response_json.outbound.minFare == null){updateTextarea("Brak lotów")}

    for(let x = 0; x < response_json.outbound.fares.length; x++){
        let record = response_json.outbound.fares[x]
        if(record.unavailable == false){
            day = record.day
            arrivalDate = record.arrivalDate
            departureDate = record.departureDate
            price_value = record.price.value
            price_currency = record.price.currencyCode

            if(price_currency == "PLN"){
                result = "Znaleziono: " + day + " (" + departureDate + "), za " + price_value + " " + price_currency
            }
            else{
                price_pln = convertCurrency(price_value, price_currency)
                result = "Znaleziono: " + day + " (" + departureDate + "), za " + price_value + " " + price_currency + " (" + price_pln + " PLN)"
            }

            updateTextarea(result)
        }
    }
}