"use client";
import React from "react";
import FullSidebar from '../components/FullSideBar';
import '../src/app/globals.css'

const Dashboard = () => {
    const day = new Date();
    const time = day.getHours();
    const greeting = () => {
        if (time >= 5 && time < 12) { return "Good Morning" }
        else if (time >= 12 && time < 16) { return "Good Afternoon" }
        else if (time >= 16 && time < 19) { return "Good Evening" }
        else { return "Good Night" }
    }
    return (
        <>
            <div className="flex justify-center items-center fixed greeting">{greeting()} da! </div>
            <FullSidebar />

        </>
        // <section>
        //     <div className='px-10 py-10 mx-10 my-10 bg-amber-500' >
        //         Logout
        //         <button>Logout</button>
        //         <div>{greeting()}</div>
        //     </div>
        // </section>
    )
}

export default Dashboard


