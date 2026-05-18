//location for API POST functions


export default async function postDataWithStatus(url, setFunction, requestBody, requestHeaders) {
    try {
        setFunction("submitting")
        const response = await fetch(url, {
            method: 'POST',
            headers: requestHeaders,
            body:  JSON.stringify(requestBody)  
        })
        const result = await response.json()
        if (result.status == "success") {
            setFunction("success");
        }
        else {
            setFunction("error");
        }
    } catch (error) {
        setFunction("error");
    }
}