'use client'
import { useState } from "react";
import ProtectedRoute from '../../../components/ProtectedRoute';

const Inbox = () => {
    const [notifications, SetNotifications] = useState<null | string>(null)

    return (
        <ProtectedRoute>
            <section>
                {notifications ?
                    <div> Hi this the msg recieved from Odyssey</div> :
                    <div>HI, no msgs so far</div>
                }
            </section>
        </ProtectedRoute>
    )
}
export default Inbox;