import React from "react";
import Head from "next/head";
import AppLayout from "../components/AppLayout";
const Home = () => {
    return (
        <>
            <AppLayout>
                <Head>
                    <meta charSet="utf-8"/>
                    <title>NodeBird</title>
                </Head>
                <div>
                    Home
                </div>
            </AppLayout>
        </>
    );
}

export default Home;
