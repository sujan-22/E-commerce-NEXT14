"use server";

import { auth } from "../../auth";
import { headers } from "next/headers";

export const getUserSession = () => {
    return Promise.resolve(
        auth.api
            .getSession({
                headers: headers(),
            })
            .then((data) => data?.session)
    );
};

export const getUser = () => {
    return Promise.resolve(
        auth.api
            .getSession({
                headers: headers(),
            })
            .then((data) => data?.user)
    );
};
