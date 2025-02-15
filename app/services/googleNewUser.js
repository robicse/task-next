import { apiBaseUrl } from "../utils";

export const googleNewUser = async (payload) => {
    try {
        const response = await fetch(`${apiBaseUrl}/google-new-user`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(payload),
        });

        return await response.json();
    } catch (error) {
        console.error("Something went wrong creating user");
        console.info(error);
    }
};
