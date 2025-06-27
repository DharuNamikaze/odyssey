'use client'
import React, { useState, useEffect } from 'react';
import '../src/app/globals.css';
import { IconCirclePlus } from '@tabler/icons-react'

const CreateButton = () => {
    const [open, setOpen] = useState<boolean>(false)
    useEffect(() => {
        const op = () => setOpen(!open)
        console.log("Opened")
        return () => op();
    }, [open])

    function handleOpen (){
        () => { }
    }

    return (
        <>
            <button className="z-50 fixed right-[2vh] top-[90.5vh] bg-black p-[0.5] border rounded-full create-btn " onClick={handleOpen}>
                <IconCirclePlus width={50} height={50} />
            </button>
        </>
    )
}
export default CreateButton;