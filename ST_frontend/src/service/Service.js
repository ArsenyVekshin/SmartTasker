import store from "../store/store";
import {showError, showSuccess} from "../view/components/ErrorMessage";

const API_URL = 'http://188.134.94.41:32810';
const AUTH_URL = API_URL + '/auth';
const USER_URL = API_URL + '/user';
const MEETINGS = API_URL + '/api/meetings';
const KANBAN = API_URL + '/api/kanban';
const BOARDS = KANBAN + '/boards';
const PLACE = API_URL + '/api/place';
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
        let data;
        try {
            data = await response.json();
        } catch (error) {
            data = null;
        }
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

export async function createMeeting(meeting) {
    return makeRequest(MEETINGS + '/new', 'POST', meeting, false);
}

export async function getMeetings() {
    return makeRequest(MEETINGS + '/list', 'GET');
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

export async function updatePlace(place) {
    return makeRequest(PLACE, 'PUT', place, false);
}

export async function createPlace(place) {
    return makeRequest(PLACE, 'POST', place, false);
}

export async function getPlaces() {
    return makeRequest(PLACE + '/list', 'GET');
}

export async function deletePlace(placeId) {
    return makeRequest(PLACE + `/${placeId}`, 'DELETE');
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

export async function allocateOccupiedTasks() {
    return makeRequest(SCHEDULE + '/task/chosen/generate', 'POST');
}

export async function getSchedule(date) {
    return makeRequest(SCHEDULE + `/${date}`, 'GET');
}

export async function initWorkday(start, end) {
    return makeRequest(SCHEDULE +"/workday?" + `dayStart=${start}:00` + `&dayEnd=${end}:00`, 'POST');
}

export async function getUsersList() {
    return makeRequest(USER_URL +"/list", 'GET');
}

export async function getSuitablePlaces(id) {
    return makeRequest(MEETINGS + `/${id}/find-place`, 'POST');
}

export async function allocateMeeting(id) {
    return makeRequest(SCHEDULE + `/meeting/allocate/all-members?id=${id}`, 'POST');
}

export async function allocateTask(id) {
    return makeRequest(SCHEDULE + `/task/allocate?id=${id}`, 'POST');
}

export async function allocateOccupiedTask(id) {
    return makeRequest(SCHEDULE + `/task/chosen/generate?id=${id}`, 'POST');
}
