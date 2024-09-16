import axios from 'axios';

const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoiYWNjZXNzIiwiZXhwIjoxNzI2NDcwOTAwLCJpYXQiOjE3MjY0NjczMDAsImp0aSI6IjVlNDYzOTRhYjFlZjQzZWRhNGFlODFmYTQzNWFhNjExIiwidXNlcl9pZCI6MX0.2BiaB7clzXxEFeBxxiY2d_m6sR12_B-oXGSeFjmtDvE"
export const config = {
    headers: { Authorization: `Bearer ${token}` }
};
console.log("used token:", token);

export function addPasswordItem(newItem, groupId) {
    return axios.post(`http://127.0.0.1:8000/api/groups/${groupId}/password-items/`,
        newItem,
        config)  // Use backticks for template literals
        .then(response => {
            return response.data;
        })
        .catch(error => {
            console.log('Error in adding a new password', error);
            throw error;
        });
}


export function updatePasswordItem(id, groupId, updatedData) {
    return axios.put(`http://127.0.0.1:8000/api/groups/${groupId}/password-items/${id}/`, updatedData, config)
        .then(response => {
            return response.data;
        })
        .catch(error => {
            console.error('Error updating the password item:', error);
            throw error;
        });
}

export function deleteData(id, groupId) {
    // delete password
    return axios.delete(`http://127.0.0.1:8000/api/groups/${groupId}/password-items/${id}/`, config)
        .then((response) => {
            if (response.status === 204) {
                console.log('Item deleted successfully');
                // Check if the groupId is null (unlisted)
                if (groupId === null || groupId === 'null') {
                    // Fetch unlisted password items (those with null groupId)
                    return axios.get('http://127.0.0.1:8000/api/password-items/unlisted/', config);
                } else {
                    // Fetch remaining password items for the group
                    return axios.get(`http://127.0.0.1:8000/api/groups/${groupId}/password-items/`, config);
                }
            }
        })
        .then(response => {
            const remainingPasswords = response.data;
            if (remainingPasswords.length === 0 && groupId !== null) {
                // If no passwords left in the group, delete the group
                return axios.delete(`http://127.0.0.1:8000/api/groups/${groupId}/`, config)
                    .then(() => {
                        console.log(`Group ${groupId} deleted because it became empty.`);
                    });
            }
        })
        .catch(error => {
            console.error('Error in deleteData', error);
            throw error;
        });
}



export function fetchAllPasswordItems(setData) {
    axios.get('http://127.0.0.1:8000/api/password-items/', config) // Adjust the endpoint if needed
        .then(response => {
            const mappedData = response.data.map(item => ({
                id: item.id,
                itemName: item.itemName,
                userName: item.userName,
                password: item.password,
                groupId: item.groupId,  // Assuming the groupId is part of the response
                userId: item.userId,
                comment: item.comment,
                url: item.url,
            }));
            setData(mappedData);
        })
        .catch(error => {
            console.error('Error fetching all password items:', error);
        });
}

export function fetchUnlistedPasswordItems(setData) {
    axios.get('http://127.0.0.1:8000/api/password-items/unlisted/', config) // Adjust the endpoint if needed
        .then(response => {
            const mappedData = response.data.map(item => ({
                id: item.id,
                itemName: item.itemName,
                userName: item.userName,
                password: item.password,
                groupId: item.groupId,  // Assuming the groupId is part of the response
                userId: item.userId,
                comment: item.comment,
                url: item.url,
            }));
            setData(mappedData);
        })
        .catch(error => {
            console.error('Error fetching unlisted password items:', error);
        });
}



export function dataFetching(groupId, setData) {
    axios.get(`http://127.0.0.1:8000/api/groups/${groupId}/password-items/`, config)
        .then(response => {
            const mappedData = response.data.map(item => ({
                id: item.id,
                itemName: item.itemName,
                userName: item.userName,
                password: item.password,
                groupId: item.groupId,
                userId: item.userId,
                comment: item.comment,
                url: item.url,
            }));
            setData(mappedData);
        })
        .catch(error => {
            console.error('Error fetching password items for group:', error);
        });
}


export const fetchHistory = async (passwordId) => {
    try {
        //const response = await fetch(`/api/passwords/${passwordId}/history`);
        if (!response.ok) {
            throw new Error('Failed to fetch history');
        }
        return await response.json();
    } catch (error) {
        console.error('Error fetching history:', error);
        throw error;
    }
};
