import axios from 'axios';
const host = 'http://localhost:8080'
const authApi = axios.create({
    baseURL: host + '/auth',
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
    if(token) {
        kanbanApi.defaults.headers.common.Authorization = 'Bearer '+token;
        tasksApi.defaults.headers.common.Authorization = 'Bearer '+token;
        scheduleApi.defaults.headers.common.Authorization = 'Bearer '+token;
    }
    else {
        kanbanApi.defaults.headers.common.Authorization = null;
        tasksApi.defaults.headers.common.Authorization = null;
        scheduleApi.defaults.headers.common.Authorization = null;
    }
}

export const getOwnedBoards = () => kanbanApi.get('/owned');
export const getBoardContain = (board_id) => kanbanApi.get(`/${board_id}/tasks`);
export const getMyBoards = () => kanbanApi.get('/my');
export const getMyTasksOnBoard = (board_id) => kanbanApi.get(`/${board_id}/tasks/my`);

export const createBoard = (name, owner) => kanbanApi.post('', {name: name, owner: owner});
export const updateBoard = (id, name, owner) => kanbanApi.put('', {id: id, name: name, owner: owner});
export const deleteBoard = (id) => kanbanApi.delete(`/${id}`);

const tasksApi = axios.create({
    baseURL: host+'/api/kanban/tasks',
    headers: {
        'Content-Type': 'application/json',
    }
});

export const createTask = (task) => tasksApi.post('', task);
export const updateTask = (task) => tasksApi.put('', task)
export const deleteTask = (id) => tasksApi.delete(`/${id}`)

export const getTask = (id) => tasksApi.get(`/${id}`);

const scheduleApi = axios.create({
    baseURL: host+'/api/schedule',
    headers: {
        'Content-Type': 'application/json',
    }
});

export const generateSchedule = () => scheduleApi.post('/generate');
export const getSchedule = (date) => scheduleApi.get(`/${date}`);
export const setWorkday = (dayStart, dayEnd) => scheduleApi.post(`/workday?dayStart=${dayStart}&dayEnd=${dayEnd}`)
