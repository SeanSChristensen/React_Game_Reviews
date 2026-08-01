import Layout from "../components/Layout";
import React, { useState } from 'react';
import { SubmitButton } from "../components/submitButton"
import ApiPostFetchHandler from "../services/api/POST";

export default function Register() {
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [registrationStatus, setRegistrationStatus] = useState({ loading: false, data: null, error: null });

    const emailChange = (e) => {
        setEmail(e.target.value)
    };

    const passwordChange = (e) => {
        setPassword(e.target.value)
    };

    const placeHolderButtonFunction = async() => {
        console.log(email, password)
        setRegistrationStatus({ loading: true, data: null, error: null });
        const result = await ApiPostFetchHandler(`http://localhost:3000/api/register`, {
            username: email,
            firstName: "Test",
            lastName: "Test",
            enabled: true,
            credentials: [
                {
                    type: "password",
                    value: password
                }
            ]
        }, { 'Content-Type': 'application/json' })
        setRegistrationStatus(result)
    }

    return (
        <Layout>
            <div className="registerBox">
                <div className="emailInput">
                    <label class="form-label">Email address</label>
                    <input type="email" class="form-control" placeholder="name@example.com" value={email} onChange={emailChange} />
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
                        <SubmitButton disabled={password.length < 11 || password.length > 16 ? true : false} value={"submit"} formSubmitFunction={placeHolderButtonFunction} cssClasses="registerButton"/>
                    </div>
                    {registrationStatus.data !== null ? <p>{registrationStatus.data}</p> : <p>{registrationStatus.error}</p>   }
                </div>
            </div>
        </Layout>
    )
}
