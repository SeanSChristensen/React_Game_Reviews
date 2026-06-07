import Layout from "../components/Layout";
import React, { useState, useEffect } from 'react';
import { SubmitButton } from "../components/submitButton"
import STATUS from "../services/api/status";
import { useNavigate } from "react-router";

async function postDataWithStatus(url, requestBody, requestHeaders) {
    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: requestHeaders,
            body: requestBody
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


export default function Login() {
    const [userName, setUserName] = useState("")
    const [password, setPassword] = useState("")

    const [isLoginSuccessful, setIsLoginSuccessful] = useState(null)

    const navigate = useNavigate();

    const handlePostRequest = async () => {
        const result = await postDataWithStatus(
            `http://localhost:8080/realms/my-react-app/protocol/openid-connect/token`,
            `grant_type=password&client_id=my-react-app&username=${userName}&password=${password}`,
            { 'Content-Type': 'application/x-www-form-urlencoded' }
        )
        if (result.status == 200) {
            navigate("/");
        }
        else {
            setIsLoginSuccessful(false)
        }
    }


    const emailChange = (e) => {
        setUserName(e.target.value)
    };

    const passwordChange = (e) => {
        setPassword(e.target.value)
    };

    return (
        <Layout>
            <div className="registerBox">
                <div className="emailInput">
                    <label class="form-label">Username</label>
                    <input type="email" class="form-control" value={userName} onChange={emailChange} />
                </div>
                <div class="passwordInput">
                    <div class="col-auto">
                        <label for="inputPassword6" class="col-form-label">Password</label>
                    </div>
                    <div class="col-auto">
                        <input type="password" id="inputPassword6" class="form-control" aria-describedby="passwordHelpInline" value={password} onChange={passwordChange} />
                    </div>
                    <div>
                        <SubmitButton value={"submit"} formSubmitFunction={handlePostRequest} cssClasses="loginButton" />
                    </div>
                </div>
            </div>
            {isLoginSuccessful === false ?<p>Invalid login details</p> :null}
        </Layout>
    )
}
