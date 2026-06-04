import refreshToken from "../keycloak/token";

//TODO firstly tokens in the header needs to be removed from the review page function call and should be got from local storage here instead.
//TODO ensure the logic around the token refresh works properly, mainly cases such as token refresh done however there is a 500
//TODO look into making this less repetative
export default async function ApiFetchHandler(url, requestHeaders, requestBody) {
    try {
        const response = await fetch(url, {
            method: 'GET',
            headers: {
                ...requestHeaders,
                token: localStorage.getItem("token")
            },
            body: JSON.stringify(requestBody)
        })
        const result = await response.json()
        if (response.ok) {
            return { loading: false, data: result.data, error: null }
        }
        else {
            if (response.status === 401) {
                const refreshTokenRequest = await refreshToken()
                if (refreshTokenRequest.status === 200) {
                    return ApiFetchHandler(url, requestHeaders, requestBody)
                }
                else { localStorage.clear() }
            }
            return { loading: false, data: null, error: result.error }
        }
    } catch (e) {
        return { loading: false, data: null, error: "network error" }
    }
}