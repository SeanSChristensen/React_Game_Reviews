import STATUS from "./status";

export default async function postDataWithStatus(url, setFunction, requestBody, requestHeaders) {
    try {
        setFunction("submitting")
        const response = await fetch(url, {
            method: 'POST',
            headers: requestHeaders,
            body:  JSON.stringify(requestBody)  
        })
        const result = await response.json()
        if (result.status == STATUS.SUCCESS) {
            setFunction(STATUS.SUCCESS);
        }
        else {
            setFunction(STATUS.ERROR);
        }
    } catch (error) {
        setFunction(STATUS.ERROR);
    }
}