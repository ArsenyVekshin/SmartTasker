import store from "../store/store";
import {showError, showSuccess} from "../view/components/ErrorMessage";

const API_URL = 'http://188.134.94.41:32810';
const AUTH_URL = API_URL + '/auth';
const USER_URL = API_URL + '/user';
const MEETINGS = API_URL + '/api/meetings';
const KANBAN = API_URL + '/api/kanban';
const BOARDS = KANBAN + '/boards';
const TASKS = KANBAN + '/tasks';
const SCHEDULE = API_URL + '/api/schedule';

const token = store.getState().user.token;

async function makeRequest(url, method, body = null, fileFlag = null) {
    const headers = {};

    if (!fileFlag) headers['Content-Type'] = 'application/json';
    if (token && token !== '') headers['Authorization'] = 'Bearer ' + token;

    let response;
    if (fileFlag && body) {
        const formData = new FormData();
        formData.append('file', body);
        response = await fetch(url, {
            method,
            headers,
            body: formData,
        });
    } else if (method === 'POST' || method === 'PUT') {
        response = await fetch(url, {
            method,
            headers,
            body: JSON.stringify(body),
        });
    } else {
        response = await fetch(url, {
            method,
            headers,
        });
    }

    try {
        const data = await response.json();
        if (!response.ok) {
            showError(`Server returned an error ${response.status}`, data.message);
            throw new Error(`Error: ${response.status} ${data.message}`);
        } else showSuccess(response.message);
        return data;
    } catch (error) {
        throw error;
    }
}


export async function signUpRequest(user) {
    return makeRequest(AUTH_URL + "/sign-up", 'POST', {
        username: user.username,
        password: user.password,
        role: user.role
    });
}

export async function signInRequest(user) {
    return makeRequest(AUTH_URL + "/sign-in", 'POST', {
        username: user.username,
        password: user.password,
    });
}

export async function approveUserRequest(user) {
    return makeRequest(USER_URL + "/approve", 'POST', {
        'message': user
    });
}

export async function getMeeting(id) {
    return makeRequest(MEETINGS + `/${id}`, 'GET');
}

export async function updateMeeting(id, meeting) {
    return makeRequest(MEETINGS + `/${id}`, 'PUT', meeting, false);
}

export async function deleteMeeting(id) {
    return makeRequest(MEETINGS + `/${id}`, 'DELETE');
}

export async function meeting_find_place(id) {
    return makeRequest(MEETINGS + `/${id}/find-place`, 'POST');
}

export async function createMetting(id) {
    return makeRequest(MEETINGS + `/${id}`, 'DELETE');
}

export async function updateBoard(board) {
    return makeRequest(BOARDS, 'PUT', board, false);
}

export async function createBoard(board) {
    return makeRequest(BOARDS, 'POST', board, false);
}

export async function deleteBoard(boardId) {
    return makeRequest(BOARDS + `/${boardId}`, 'DELETE');
}

export async function getTasksOnBoard(boardId) {
    return makeRequest(BOARDS + `/${boardId}/tasks`, 'GET');
}

export async function getMyTasksOnBoard(boardId) {
    return makeRequest(BOARDS + `/${boardId}/tasks/my`, 'GET');
}

export async function getOwnedBoards() {
    return makeRequest(BOARDS + "/owned", 'GET');
}

export async function getMyTasksOnBoards() {
    return makeRequest(BOARDS + "/my", 'GET');
}

export async function updateTask(task) {
    return makeRequest(TASKS, 'PUT', task, false);
}

export async function createTask(task) {
    return makeRequest(TASKS, 'POST', task, false);
}

export async function getTask(taskId) {
    return makeRequest(TASKS + `/${taskId}`, 'GET');
}

export async function deleteTask(taskId) {
    return makeRequest(TASKS + `/${taskId}`, 'DELETE');
}

export async function setWorkday(dayStart, dayEnd) {
    return makeRequest(SCHEDULE + '/workday', 'POST', {dayStart: dayStart, dayEnd: dayEnd}, false);
}

export async function generateScheduleOnWeek() {
    return makeRequest(SCHEDULE + '/generate', 'GET');
}

export async function getSchedule(date) {
    return makeRequest(SCHEDULE + `/${date}`, 'GET');
}
