import refreshToken from "../keycloak/token";

export default async function ApiPostFetchHandler(url, requestBody, requestHeaders) {
    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                ...requestHeaders,
                token: localStorage.getItem("token")
            },
            body:  JSON.stringify(requestBody)  
        })
        const result = await response.json()
        if (response.ok) {
            return {loading: false, data: result.data, error: null}
        }
        else {
            if (response.status === 401) {
                const refreshTokenRequest = await refreshToken()
                if (refreshTokenRequest.status === 200) {
                    return ApiPostFetchHandler(url, requestBody, requestHeaders)
                }
                else { localStorage.clear() }
            }
            return { loading: false, data: null, error: result.error }
        }
    } catch (error) {
        return { loading: false, data: null, error: "network error" }
    }
}

