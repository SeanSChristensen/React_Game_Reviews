
export default async function setDataFromAPI(url, setFunction, requestHeaders) {
    const response = await fetch(url, {
        method: 'GET',
        headers: requestHeaders
    })
    const data = await response.json()
    data.status = response.status;
    setFunction(data)
}
