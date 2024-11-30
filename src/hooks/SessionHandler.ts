"use client";

import { useEffect } from "react";
import useStore from "@/context/useStore";
import { useSession } from "next-auth/react";

const SessionHandler = () => {
    const { data: session } = useSession();
    const setUserData = useStore((state) => state.setUserData);
    const syncCartWithServer = useStore((state) => state.syncCartWithServer);

    useEffect(() => {
        if (session?.user) {
            setUserData({
                id: session.user.id!,
                email: session.user.email!,
                name: session.user.name!,
                seller: session.user.seller || false,
            });
            syncCartWithServer();
        }
    }, [session, syncCartWithServer, setUserData]);

    return null;
};

export default SessionHandler;
