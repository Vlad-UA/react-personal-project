// Instruments
import { MAIN_URL, TOKEN } from './config';

const callApi = async ({ method= 'GET', options={}, data={}, urlAddition='' }={}) => {
    const authHeaders = TOKEN ? { Authorization: TOKEN } : {};
    const body = method === 'POST' || method === 'PUT' ? { body: JSON.stringify(data) } : {};

    try {
        const response = await fetch(MAIN_URL + (urlAddition.length > 0 ? `/${urlAddition}` : ''), {
            method,
            headers: {
                "Content-Type": "application/json",
                ...authHeaders,
            },
            ...body,
            ...options,
        });

        if (response.status >= 200 && response.status < 300) {
            if (method !== 'DELETE') {
                const { data: json } = await response.json();

                return json;
            }
        } else {
            console.log("fetchTasks::response.status", response.status);
            // TODO check solution
            throw new Error(`fetchTasks:: incorrect status`);
        }
    } catch (error) {
        throw new Error(`fetchTasks::error: ${error}`);
    }
};

export const api = {
    fetchTasks: () => {
        return callApi();
    },

    createTask: (message) => {
        return callApi({ method: 'POST', data: { message }});
    },

    updateTask: (data) => {
        return callApi({ method: 'PUT', data: [data]});
    },

    removeTask: (id) => {
        return callApi({ method: 'DELETE', urlAddition: id });
    },

    completeAllTasks: async (tasks) => {
        const requests = tasks.map((task) => api.updateTask({ ...task, completed: true }));

        await Promise.all(requests);
    },
};
