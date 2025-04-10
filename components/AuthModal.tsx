'use client';
import React, { useState } from 'react';
import { Dialog } from "../components/ui/Dialog";
// import { Button } from "@/components/ui/button";
// import { useMutation } from "convex/react";
// import { api } from "@/convex/_generated/api";

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
