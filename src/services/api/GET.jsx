
export default async function ApiFetchHandler(url, requestHeaders, requestBody) {
    try {
        const response = await fetch(url, {
            method: 'GET',
            headers: requestHeaders,
            body: JSON.stringify(requestBody)
        })
        const result = await response.json()
        if (response.ok) {
            return { loading: false, data: result.data, error: null }
        }
        else {
            if (response.status === 401) {
                localStorage.clear();
            }
            return { loading: false, data: null, error: result.error }
        }
    } catch (e) {
        return { loading: false, data: null, error: "network error" }
    }
}