

export default async function refreshToken() {
    const refresh_token = localStorage.getItem("refresh_token")

    try {
        const response = await fetch(`http://localhost:8080/realms/my-react-app/protocol/openid-connect/token`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: new URLSearchParams({                'grant_type': 'refresh_token',
                'client_id': 'my-react-app',
                'refresh_token':  refresh_token }) 
        })
        const result = await response.json()
        if (response.status == 200) {
            localStorage.setItem("token", result.access_token)
            localStorage.setItem("refresh_token", result.refresh_token)
            const userDetails = JSON.parse(atob(result.access_token.split('.')[1]))
            localStorage.setItem("first_name", userDetails.given_name)
            localStorage.setItem("last_name", userDetails.family_name)
        }
        return response
    } catch (error) {
        console.log(error)
        return error
    }
}