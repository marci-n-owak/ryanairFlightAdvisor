let airport_origin = []
let airport_dest = []

const colorTextareaText = (text) =>{
    let myDistance = "#"
    let coloredText = myDistance + text + myDistance
    return coloredText
}

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
        case "HUF":
            value = value * 0.013
            break;
        case "UAH":
            value = value * 0.15
            break;
        case "SEK":
            value = value * 0.45
            break;
        case "NOK":
            value = value * 0.45
            break;
        default:
            value = "Policz samemu :/"
            break;
    }
    return Math.round(value * 100) / 100
}

const clearTextarea = () => {
    document.getElementById("resultTextarea").innerHTML = ""
}

const updateTextarea = (newValue) => {
    resultTextarea = document.getElementById("resultTextarea").innerHTML
    document.getElementById("resultTextarea").innerHTML = resultTextarea + newValue + "\n"
}   

const validInputs = async () =>{
    let input_1 = document.getElementById("outboundDateFrom")
    let input_2 = document.getElementById("outboundDateTo")
    let input_3 = document.getElementById("airport_origin")
    let input_4 = document.getElementById("airport_dest")
    if(input_1.value == ""){
        input_1.classList.add("is-invalid")
    }
    else{
        input_1.classList.remove("is-invalid")
    }
    if(input_2.value == ""){
        input_2.classList.add("is-invalid")
    }
    else{
        input_2.classList.remove("is-invalid")
    }
    if(input_3.value == ""){
        input_3.classList.add("is-invalid")
    }
    else{
        input_3.classList.remove("is-invalid")
    }
    if(input_4.value == ""){
        input_4.classList.add("is-invalid")
    }
    else{
        input_4.classList.remove("is-invalid")
    }

    if(input_1.value != "" && input_2.value != "" && input_3.value != "" && input_4.value != ""){
        await preSearchFlight()
    }
}

const preSearchFlight = async () =>{
    document.getElementById("loadingSpinner").hidden = false

    airport_origin = document.getElementById("airport_origin").value.split(/[ ,]+/)
    airport_dest = document.getElementById("airport_dest").value.split(/[ ,]+/)
    outboundDateFrom = document.getElementById("outboundDateFrom").value
    outboundDateTo = document.getElementById("outboundDateTo").value

    //airport_origin = ["KRK", "WRO", "POZ", "KTW"]
    //airport_dest = ["RAK", "BGY"]
    //outboundDateFrom = "2022-04-28"
    //outboundDateTo = "2022-04-29"

    for(let origins = 0; origins < airport_origin.length; origins++){
        for(let dests = 0; dests < airport_dest.length; dests++){
            let foundFlight = await searchFlight(airport_origin[origins].toUpperCase(), airport_dest[dests].toUpperCase(), outboundDateFrom, outboundDateTo)
            if(foundFlight != "No flights"){
                day = foundFlight.day
                arrivalDate = foundFlight.arrivalDate
                departureDate = foundFlight.departureDate
                price_value = foundFlight.price.value
                price_currency = foundFlight.price.currencyCode
                
                let resultSearching = "Lot z: " + airport_origin[origins].toUpperCase() + " do: " + airport_dest[dests].toUpperCase()

                if(price_currency == "PLN"){
                    resultFlight = "Znaleziono: " + day + " (" + departureDate + "), za " + price_value + " " + price_currency
                    
                    if(price_value <= 100){
                        resultFlight = colorTextareaText(result)
                    }
                }
                else{
                    price_pln = convertCurrency(price_value, price_currency)
                    resultFlight = "Znaleziono: " + day + " (" + departureDate + "), za " + price_value + " " + price_currency + " (" + price_pln + " PLN)"
                    
                    if(price_pln <= 100){
                        resultFlight = colorTextareaText(result)
                    }
                }


                updateTextarea(resultSearching)
                updateTextarea(resultFlight)
            }
        }
    }
    document.getElementById("loadingSpinner").hidden = true
}

const searchFlight = async (airport_origin, airport_dest, outboundDateFrom, outboundDateTo) =>{
    let response = await fetch(`https://www.ryanair.com/api/farfnd/3/oneWayFares/${airport_origin}/${airport_dest}/cheapestPerDay?outboundDateFrom=${outboundDateFrom}&outboundDateTo=${outboundDateTo}`)
    let response_json = await response.json()

    if(response_json.outbound.minFare == null){return("No flights")}

    for(let x = 0; x < response_json.outbound.fares.length; x++){
        let record = response_json.outbound.fares[x]
        if(record.unavailable == false){
            return(record)
        }
    }
}