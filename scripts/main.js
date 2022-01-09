let airport_origin = []
let airport_dest = []
let resultTextarea = ""
let flightQuantity = 0

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

const preSearchFlight = async () =>{
    document.getElementById("loadingSpinner").hidden = false

    airport_origin = document.getElementById("airport_origin").value.split(/[ ,]+/)
    airport_dest = document.getElementById("airport_dest").value.split(/[ ,]+/)
    outboundDateFrom = document.getElementById("outboundDateFrom").value
    outboundDateTo = document.getElementById("outboundDateTo").value

    airport_origin = ["KRK", "WRO", "POZ", "KTW"]
    airport_dest = ["RAK", "BGY"]
    outboundDateFrom = "2022-04-28"
    outboundDateTo = "2022-04-29"

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

const preSearchFlightAdvanced = async () =>{
    document.getElementById("loadingSpinner").hidden = false

    airport_origin = document.getElementById("airport_origin").value.split(/[ ,]+/)
    airport_dest = document.getElementById("airport_dest").value.split(/[ ,]+/)
    outboundDateFrom = document.getElementById("outboundDateFrom").value
    outboundDateTo = document.getElementById("outboundDateTo").value

    airport_origin = ["KRK", "WRO", "POZ", "KTW"]
    airport_dest = ["aho", "alc", "ath", "bcn", "bri", "bll", "bhx", "blq", "boh", "bts", "bds", "brs", "cag", "cah", "cta", "chq", "ork", "dub", "ema", "edi", "ein", "fao", "fez", "gro", "pik", "lpa", "kun", "suf", "ace", "lba", "lis", "ltn", "stn", "mad", "agp", "mla", "man", "rak", "mrs", "bgy", "ryg", "pmo", "pfo", "psr", "psa", "pdl", "opo", "cia", "fco", "svq", "snn", "nyo", "tfs", "tpf", "vlc", "zad"]
    flightList = ["2022-04-28", "2022-04-29", "2022-04-30"]
    
    await loopSearch(airport_origin, airport_dest, flightList[0])

    document.getElementById("loadingSpinner").hidden = true
}
const loopSearch = async (airport_origin, airport_dest, flightDate) =>{
    for(let origins = 0; origins < airport_origin.length; origins++){
        for(let dests = 0; dests < airport_dest.length; dests++){
            let foundFlight = await searchFlight(airport_origin[origins].toUpperCase(), airport_dest[dests].toUpperCase(), flightDate, flightDate)
            if(foundFlight != "No flights"){
                day = foundFlight.day
                arrivalDate = foundFlight.arrivalDate
                departureDate = foundFlight.departureDate
                price_value = foundFlight.price.value
                price_currency = foundFlight.price.currencyCode
                foundFlight.originAirport = airport_origin[origins].toUpperCase()
                foundFlight.destinationAirport = airport_dest[dests].toUpperCase()
                
                console.log(foundFlight)
            }
            else{return(null)}
        }
    }
}
const searchFlightAdvanced = async (airport_origin, airport_dest, flightIndex, flightDate, flightQuantity) =>{
    let response = await fetch(`https://www.ryanair.com/api/farfnd/3/oneWayFares/${airport_origin}/${airport_dest}/cheapestPerDay?outboundDateFrom=${flightDate}&outboundDateTo=${flightDate}`)
    let response_json = await response.json()

    if(response_json.outbound.minFare == null){return 1}

    for(let x = 0; x < response_json.outbound.fares.length; x++){
        let record = response_json.outbound.fares[x]
        if(record.unavailable == false){
            //cała logika
            day = record.day
            arrivalDate = record.arrivalDate
            departureDate = record.departureDate
            price_value = record.price.value
            price_currency = record.price.currencyCode

            if(flightIndex == 0){
                result = flightIndex + "Znaleziono: " + day + " (" + departureDate + "), za " + price_value + " " + price_currency
                console.log(result)
                flightQuantity++
                await searchFlightAdvanced(airport_origin, airport_dest, flightQuantity, flightDate, flightQuantity)
            }
            else if (flightIndex == flightQuantity-1){
                result = flightIndex + "Znaleziono: " + day + " (" + departureDate + "), za " + price_value + " " + price_currency
                console.log(result)
            }
            else{
                result = flightIndex + "Znaleziono: " + day + " (" + departureDate + "), za " + price_value + " " + price_currency
                console.log(result)
                flightQuantity++
                await searchFlightAdvanced(airport_dest, airport_dest, flightQuantity, flightDate, flightQuantity)
            }
        }
    }
}