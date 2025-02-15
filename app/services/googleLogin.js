import { apiBaseUrl } from "../utils";

export const googleLoginAPI = async (payload) => {
    try {
        const response = await fetch(`${apiBaseUrl}/google-login`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(payload),
        });
        return await response.json();
    } catch (error) {
        console.error("Something went wrong fetching google login");
        console.info(error);
    }
};
