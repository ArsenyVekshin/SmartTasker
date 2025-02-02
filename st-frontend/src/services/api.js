import axios from 'axios';
const host = 'http://localhost:8080/'
const authApi = axios.create({
    baseURL: host + '/auth/',
    headers: {
        'Content-Type': 'application/json',
    },
});
export const auth = (login, password) => authApi.post('/sign-in', {username: login, password: password});
export const register = (login, password, role) => authApi.post('/sign-up', {username: login, password: password, role: role});

const kanbanApi = axios.create({
    baseURL: host+'/api/kanban/boards',
    headers: {
        'Content-Type': 'application/json',
    }
});

export function changeToken(token) {
    if(token)
        kanbanApi.defaults.headers.common.Authorization = 'Bearer '+token;
    else kanbanApi.defaults.headers.common.Authorization = null;
}

export function getToken() {
    return kanbanApi.defaults.headers.common.Authorization;
}

export const getOwnedBoards = () => kanbanApi.get('/owned');
export const getBoardContain = (board_id) => kanbanApi.get(`/${board_id}/tasks`);
export const getMyBoards = () => kanbanApi.get('/my');
export const getBoardTasks = (board_id) => kanbanApi.get(`/${board_id}/tasks/my`);
