'use client'
import React, { useState, useEffect } from 'react';
import '../src/app/globals.css';
import { IconPlus } from '@tabler/icons-react'

const CreateButton = () => {
    const [open, setOpen] = useState<boolean>(false)
    useEffect(() => {
        const op = () => setOpen(!open)
        console.log("Opened")
        return () => op();
    }, [open])

    function handleOpen() {
        () => { }
    }

    return (
        <>
            <button className={`z-50 fixed right-[2vh] top-[90.5vh] bg-black p-1 rounded-full createLogBtn`} onClick={handleOpen}>
                <IconPlus width={45} height={45} />
            </button>
        </>
    )
}
export default CreateButton;