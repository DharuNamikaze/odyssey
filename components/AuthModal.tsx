'use client';
import React, { useState } from 'react';
import { Dialog } from "../components/ui/Dialog";

export const AuthModal = () => {
    const [open, setOpen] = useState(false);

    return (
        <section>
        <Dialog open={open} onOpenChange={setOpen}>
            Hi
        </Dialog>

        </section>
    )
}
