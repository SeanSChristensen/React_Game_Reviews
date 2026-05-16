
export default function setDataFromAPI(url, setFunction, requestHeaders) {
    fetch(url, {
        method: 'GET',
        headers: requestHeaders
    })
        .then(response => response.json())
        .then(json => {
            setFunction(json)
        })

}
