import React, {useEffect, useState} from 'react';
import {useNavigate} from 'react-router-dom';
import {useAuth} from '../context/auth';
import { getBoardContain, getOwnedBoards } from '../services/api';
const BoardListComponent = () => {
    const {isIn} = useAuth();
    const navigate = useNavigate();
    useEffect(()=>{
        if(!isIn())
            navigate("/auth");
    },[]);
    const [boards, setBoards] = useState([]);
    const [message, setMessage] = useState('');
    const statuses = [ 'FREE', 'OCCUPIED', 'INPROGRESS', 'FINISHED', 'CANCELED', 'BLOCKED', 'TROUBLES' ];
    const palitres = [[' #FFFFFF', ' #3498DB',' #E74C3C'],
                      [' #F5F5F5', ' #1ABC9C', ' #F1C40F'],
                      [' #FDFDFD', ' #2980B9', ' #27AE60'],
                      [' #F0F0F0', ' #95A5A6', ' #E74C3C'],
                      [' #F8B195', ' #F8B195', ' #355C7D'],
                      [' #FFFFFF', ' #E74C3C', ' #2ECC71'],
                      [' #FFFFFF', ' #3498D8', ' #E67E22'],
                      ['linear-gradient( #F5F7FA, #B8C6DB)', ' #FF7E5F', ' #FEB47B']];
    function fetchTasks() {
        // getOwnedBoards()
        // .then((resp) => {
        //     let c = 0;
        //     setBoards(
        //         resp.data.map((board) => {
        //             getBoardContain(board.id)
        //             .then((tasks)=> {
        //                     return {
        //                         'id': board.id,
        //                         'tasks': tasks['list'],
        //                         'name': board.name,
        //                         'show': false,
        //                         'seqNum': c++
        //                     }
        //             })
        //             .catch((err)=>{throw err});
        //         })
        //     )
        // })
        // .catch((err) => {setMessage('Не удалось загрузить доски')});
        function intToStatus(i) {
            return statuses[i]
        }
        function generateTask(id, status) {
            return {
                "id": id,
                "board": {
                    "id": 0,
                    "name": "Курсовая ИС",
                    "owner": "Векшин А.И."
                },
                "owner": "Козодой А.С.",
                "name": "Сделать фронтенд",
                "description": "Сделать фронтенд для курсовой работы по ИС",
                "duration": {
                    "seconds": 0,
                    "zero": true,
                    "nano": 0,
                    "negative": true,
                    "positive": true,
                    "units": [
                    {
                        "durationEstimated": true,
                        "duration": {
                        "seconds": 0,
                        "zero": true,
                        "nano": 0,
                        "negative": true,
                        "positive": true
                        },
                        "timeBased": true,
                        "dateBased": true
                    }
                    ]
                },
                "start": "2024-01-01T10:00:00.000Z",
                "finish": "2025-02-21T10:00:00.000Z",
                "repeatPeriod": {
                    "seconds": 0,
                    "zero": true,
                    "nano": 0,
                    "negative": true,
                    "positive": true,
                    "units": [
                    {
                        "durationEstimated": true,
                        "duration": {
                        "seconds": 0,
                        "zero": true,
                        "nano": 0,
                        "negative": true,
                        "positive": true
                        },
                        "timeBased": true,
                        "dateBased": true
                    }
                    ]
                },
                "keypoint": {
                    "id": 0,
                    "name": "string",
                    "description": "string",
                    "timestamp": "2025-02-02T10:31:40.621Z"
                },
                "status": status
                }
        }
        function generateTasks() {
            return [1,2,3,4,5,6,7].map((i)=>generateTask(i-1, intToStatus(i-1)));
        }
        let b = [
            {
                "id": 0,
                "name": "Курсовая ИС",
                "tasks": generateTasks(),
            },
            {
                "id": 1,
                "name": "ЛР2 ИС",
                "tasks": generateTasks(),
            },
            {
                "id": 2,
                "name": "ЛР3 ИС",
                "tasks": generateTasks(),
            },
            {
                "id": 4,
                "name": "ЛР3 ОС",
                "tasks": generateTasks(),
            },
            {
                "id": 5,
                "name": "ЛР4 ОС",
                "tasks": generateTasks(),
            },
            {
                "id": 6,
                "name": "Экзамен ОС",
                "tasks": generateTasks(),
            },
            {
                "id": 7,
                "name": "Экзамен ИС",
                "tasks": generateTasks(),
            },
            {
                "id": 8,
                "name": "Защита курсовой",
                "tasks": generateTasks(),
            }
          ];
        let c = 0;
        b = b.map((board)=>{return {...board, 'show': false, seqNum: c++}})
        setBoards(b);
    }
    useEffect(fetchTasks, []);
    function taskStatusToUnderstandableFormat(id, statusText) {
        const statusesColors = {
            'FREE': 'rgb(60, 255, 60)',
            'OCCUPIED': 'rgb(222, 21, 21)',
            'INPROGRESS': 'rgb(215, 240, 46)',
            'FINISHED': ' rgb(0, 167, 0)',
            'CANCELED': ' rgb(167, 0, 0)',
            'BLOCKED': ' rgb(216, 183, 62)',
            'TROUBLES': ' rgb(218, 91, 28)'
        }
        const statusesDescriptions = {
            'FREE': 'Задача ожидает выполнения',
            'OCCUPIED': 'Задача выполняется',
            'INPROGRESS': 'Задача выполняется',
            'FINISHED': 'Задача выполнена',
            'CANCELED': 'Задача отменена',
            'BLOCKED': 'Задача заблокирована',
            'TROUBLES': 'Проблемы при выполнении задачи'
        }
        return (<sup key={'task_sup'+id}>
                    <select style={{color: statusesColors[statusText], fontSize: 13, borderRadius: "10px"}} value={statusText} onChange={(e)=>{}} key={"task_select"+id}>
                        {statuses.map(status => 
                            (<option style={{color: statusesColors[status], fontSize: 13}} key={"task"+id+"_select_option"+status} title={statusesDescriptions[status]}>{status}</option>)
                        )}
                    </select>
                </sup>)
    }
    const inheritedStyles = {margin: 0};
    function toggleBoard(board) {
        board.show = !board.show;
        const newBoards = [...boards];
        setBoards(newBoards);
    }
    return (
        <div>
            {message && <p key="message">{message}</p>}
            {boards.length === 0 && <p key="no boards">Нет задач!</p>}
            <div key="boardsGrid" style={{display: "grid", gap: "10px"}}>
            {boards.map((board)=>(
                <div key={'board'+board.id} style={{background: palitres[board.seqNum%palitres.length][0], width: "30vw", gridRow: Math.floor(board.seqNum/3)+1, gridColumn: board.seqNum%3+1, border: "2px solid black"}}>
                    <div key={"board_header"+board.id} onClick={()=>toggleBoard(board)} style={{cursor: 'pointer', margin: 3}}>
                        <h1 style={{margin: 0}}><p style={{display:"inline", fontWeight: 'normal'}}>{board.show?'\u2228':'>'}</p>{board.name}</h1>
                    </div>
                    <div key={"board_body"+board.id} style={{maxHeight: '30vh', overflow: 'auto'}}>
                        {board.show && board.tasks.map((task)=>(
                            <div key={'task'+task.id} style={{background: task.id%2===0?palitres[board.seqNum%palitres.length][1]:palitres[board.seqNum%palitres.length][2], padding: 0, margin: 0}}>
                                <h2 style={{...inheritedStyles, textDecoration: ['FINISHED', 'CANCELED'].includes(task.status)?'line-through':''}}>{task.name}{taskStatusToUnderstandableFormat(task.id, task.status)}</h2>
                                <p style={inheritedStyles}>Начало: {task.start}</p>
                                <p style={inheritedStyles}>Конец: {task.finish}</p>
                            </div>
                        ))}
                    </div>
                </div>
            ))}
            </div>
        </div>
    );
}
export default BoardListComponent;
