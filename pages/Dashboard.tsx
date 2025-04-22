"use client";
import React from "react";
import '../src/app/globals.css';
import { Sidebar } from "../components/ui/Sidebar";
const Dashboard = () => {
    const day = new Date();
    const time = day.getHours();
    const greeting = () => {
        if (time >= 1 && time < 12) { return "Good Morning" }
        else if (time >= 12 && time < 16) { return "Good Afternoon" }
        else if (time >= 16 && time < 19) { return "Good Evening" }
        else { return "Good Night" }
    }
    return (
        <>
            <section className="bg-blue-200 w-screen h-screen">

                <main className="bg-blue-700-700 w-screen h-screen p-2">
                    <Sidebar />
                    <span> {greeting()} </span>

                </main>
            </section>
        </>
        // {/* <FullSidebar /> */ }
        // <section>
        //     <div className='px-10 py-10 mx-10 my-10 bg-amber-500' >
        //         Logout
        //         <button>Logout</button>
        //         <div></div>
        //     </div>
        // </section>
    )
}

export default Dashboard


