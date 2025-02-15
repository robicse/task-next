

// For Localhost 2 way
export const apiBaseUrl = "http://127.0.0.1:8000/api";
export const NagadhatPublicUrl = "http://127.0.0.1:8000";



export function requestPage(route) {
    if (typeof window !== "undefined") {
        localStorage.setItem("requestPage", JSON.stringify(route));
    }
}

//getUserAgent function retrieves the user agent from local storage.
export function getRequestPath() {
    if (typeof window !== "undefined") {
        const requestRoute =
            (localStorage.getItem("requestPage") &&
                JSON.parse(localStorage.getItem("requestPage"))) ||
            "/dashboard";
        return requestRoute;
    }
    return null;
}
export function removeRequestPath() {
    if (typeof window !== "undefined") {
        const requestRoute = localStorage.removeItem("requestPage");
        return requestRoute;
    }
    return null;
}