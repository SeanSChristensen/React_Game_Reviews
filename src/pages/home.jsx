import Layout from "../components/Layout";

export default function Home() {
    if (localStorage.getItem("first_name") !== null && localStorage.getItem("last_name") !== null) {
        return (
            <Layout>
                <LoggedInHomePage/>
            </Layout>
        )
    }
    else {
        return (<Layout>
            <NotLoggedInHomePage />
        </Layout>)
    }
}

function NotLoggedInHomePage() {
    return (
        <>
            <h2>Welcome to the homepage</h2>
        </>
    )
}

function LoggedInHomePage() {
    return (
        <>
            <h2>Welcome {localStorage.getItem("first_name")}  {localStorage.getItem("last_name")}</h2>
        </>
    )
}