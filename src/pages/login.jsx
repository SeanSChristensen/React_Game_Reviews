import Layout from "../components/Layout";
import React, { useState } from 'react';
import { SubmitButton } from "../components/submitButton"
import STATUS from "../services/api/status";


async function postDataWithStatus(url, setFunction, requestBody, requestHeaders) {
    try {
        setFunction("submitting")
        const response = await fetch(url, {
            method: 'POST',
            headers: requestHeaders,
            body: requestBody
        })
        const result = await response.json()
        console.log(response.status)
        if (response.status != 200) {
            setFunction("invalid")
        }
        else {
            setFunction(result.access_token)
        }
    } catch (error) {
        setFunction(STATUS.ERROR);
    }
}


//todo this probably doesn't need state? to figure out
export default function Login() {
    const [userName, setUserName] = useState("")
    const [password, setPassword] = useState("")

    const [token, setToken] = useState("")

    const handlePostRequest = async () => {
        postDataWithStatus(
            `http://localhost:8080/realms/my-react-app/protocol/openid-connect/token`,
            setToken, `grant_type=password&client_id=my-react-app&username=${userName}&password=${password}`,
            { 'Content-Type': 'application/x-www-form-urlencoded' }
        )
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
                    <label class="form-label">Email address</label>
                    <input type="email" class="form-control" placeholder="name@example.com" value={userName} onChange={emailChange} />
                </div>
                <div class="passwordInput">
                    <div class="col-auto">
                        <label for="inputPassword6" class="col-form-label">Password</label>
                    </div>
                    <div class="col-auto">
                        <input type="password" id="inputPassword6" class="form-control" aria-describedby="passwordHelpInline" value={password} onChange={passwordChange} />
                    </div>
                    {password.length > 16
                        ? <div class="col-auto">
                            <span id="passwordHelpInline" class="form-text passwordRequirementText">
                                Cannot be longer than 15 characters
                            </span>
                        </div>
                        : <></>
                    }
                    {password.length < 11
                        ? <div class="col-auto">
                            <span id="passwordHelpInline" class="form-text passwordRequirementText">
                                Must be atleast 10 characters
                            </span>
                        </div>
                        : <></>
                    }
                    <div>
                        <SubmitButton value={"submit"} formSubmitFunction={handlePostRequest} cssClasses="registerButton" />
                    </div>
                </div>
            </div>
            <p>{token}</p>
        </Layout>
    )
}
