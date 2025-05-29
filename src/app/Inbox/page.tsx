'use client'
import { useState } from "react";

const Inbox = () => {
    const [notifications, SetNotifications] = useState<null | string>(null)

    return (
        <>
            <section>
                {notifications ?
                    <div> Hi this the msg recieved from Odyssey</div> :
                    <div>HI, no msgs so far</div>
                }
            </section>
        </>
    )
}
export default Inbox;