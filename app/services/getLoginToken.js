import {apiBaseUrl} from '../utils';

export const getLoginToken = async (payload) => {
    try {
        const response = await fetch(`${apiBaseUrl}/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(payload)
        });
        return await response.json();
    } catch (error) {
        console.error('Something went wrong fetching division data');
        console.info(error);
    }
}
