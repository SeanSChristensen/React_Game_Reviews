import { createRemoteJWKSet, jwtVerify } from 'jose'

function getKeycloakJsonWebKeySet() {
    const result = createRemoteJWKSet(new URL('http://localhost:8080/realms/my-react-app/protocol/openid-connect/certs'))
    return result
}


async function verifyToken(token, keycloakJsonWebKeySet) {
    const result = await jwtVerify(token, keycloakJsonWebKeySet, { issuer: 'http://localhost:8080/realms/my-react-app' })
    console.log(result);
}


export default { getKeycloakJsonWebKeySet, verifyToken }