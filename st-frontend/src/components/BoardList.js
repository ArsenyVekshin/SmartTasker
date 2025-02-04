import React, {useEffect, useState} from 'react';
import {useNavigate} from 'react-router-dom';
import {useAuth} from '../context/auth';
import { createBoard, createTask, deleteBoard, deleteTask, getBoardContain, getOwnedBoards, updateBoard, updateTask } from '../services/api';
const BoardListHeader = ({buttonCallback}) => {
    return (
        <div style={{background: 'rgb(231, 231, 231)', float: 'right'}}>
            <button onClick={buttonCallback} style={{background: 'rgb(218, 255, 178)'}}>+</button>
        </div>
    )
}

const PopupComponent = ({children, closeCallback}) => {
    return (
        <div style={{
            position: 'fixed',
            height: '100vh',
            width: '100%',
            zIndex: '20',
            background: 'rgba(0,0,0,0.32)'
        }}>
            <div style={{
                background: 'white',
                width: '600px',
                maxWidth: '100%',
                margin: '10vh auto auto auto',
                placeItems: 'center',
                padding: 10,
            }}>
                <button onClick={closeCallback} style={{float: 'right'}}>X</button>
                {children}
            </div>
        </div>
    )
}

const BoardSettinsComponent = ({board, closeCallback}) => {
    const [name, setName] = useState('');
    const [owner, setOwner] = useState('');
    const [message, setMessage] = useState(null);
    useEffect(() => {
        if(board == null) return;
        setName(board.name);
    }, [board]);
    function handleCreate() {
        return createBoard(name, owner);
    }
    function handleUpdate() {
        return updateBoard(board.id, name, owner);
    }
    function handleDelete() {
        if(board !== null)
            deleteBoard(board.id).then(closeCallback).catch((e)=>setMessage('Ошибочка'));
        else
            throw 'delete without id!';
    }
    return (
        <PopupComponent closeCallback={closeCallback}>
        {message && <p>{message}</p>}
        <form onSubmit={(e)=>{e.preventDefault(); setMessage(null); (board===null?handleCreate(e):handleUpdate(e)).then(closeCallback).catch((e)=>{if(e.response.status < 500) setMessage(e.response.data.message); else setMessage('Ошибочка')})}}>
            {board === null && <h1>Создание доски</h1>}
            {board !== null && <h1>Редактирование доски</h1>}
            <label>Название доски:<input type="text" name="name" value={name} onChange={(e)=>{setName(e.target.value)}} required></input></label><br/>
            <label>Владелец:<input type="text" name="owner" value={owner} onChange={(e)=>{setOwner(e.target.value)}}></input></label><br/>
            {board === null && <button style={{background: 'lime', borderRadius: 10, padding: '10px 20px', color: 'white', fontSize: 18}}>Создать доску</button>}
            {board !== null && <button style={{background: 'yellow', borderRadius: 10, padding: '10px 20px', color: 'black', fontSize: 18}}>Редактировать доску</button>}
        </form>
        {board !== null && <button style={{background: 'red', borderRadius: 10, padding: '10px 20px', color: 'white', fontSize: 18}} onClick={handleDelete}>Удалить доску</button>}
        </PopupComponent>
    )
}

const TaskSettingsComponent = ({task, board, closeCallback}) => {
    const [name, setName] = useState('');
    const [owner, setOwner] = useState('');
    const [description, setDescription] = useState('');
    const [start, setStart] = useState(new Date().toISOString());
    const [finish, setFinish] = useState(new Date().toISOString());
    const [message, setMessage] = useState(null);
    useEffect(() => {
        if(task == null) return;
        setName(task.name);
        setOwner(task.owner);
        setDescription(task.description);
        setStart(task.start);
        setFinish(task.finish);
    }, [task]);
    function handleCreate() {
        return createTask({
            name: name,
            board: {
                id: board.id,
                name: board.name,
                owner: board.owner
            },
            description: description,
            start: start,
            finish: finish,
            owner: owner
        });
    }
    function handleUpdate() {
        return updateTask({
            id: task.id,
            name: name,
            board: {
                id: board.id,
                name: board.name,
                owner: board.owner
            },
            description: description,
            start: start,
            finish: finish,
            owner: owner
        });
    }
    function handleDelete() {
        if(task !== null)
            deleteTask(task.id).then(closeCallback).catch((e)=>setMessage('Ошибочка'));
        else
            throw 'delete without id!';
    }
    return (
        <PopupComponent closeCallback={closeCallback}>
        {message && <p>{message}</p>}
        <form onSubmit={(e)=>{e.preventDefault(); setMessage(null); (task===null?handleCreate(e):handleUpdate(e)).then(closeCallback).catch((e)=>{if(e.response.status < 500) setMessage(e.response.data.message); else setMessage('Ошибочка'); console.log(e)})}}>
            {task === null && <h1>Создание задачи</h1>}
            {task !== null && <h1>Редактирование задачи</h1>}
            <label>Название:<input type="text" name="name" value={name} onChange={(e)=>{setName(e.target.value)}} required></input></label><br/>
            <label>Владелец:<input type="text" name="owner" value={owner} onChange={(e)=>{setOwner(e.target.value)}}></input></label><br/>
            <label>Начало:<input type="datetime-local" name="start" value={start} onChange={(e)=>{setStart(e.target.value)}} required></input></label><br/>
            <label>Конец:<input type="datetime-local" name="finish" value={finish} onChange={(e)=>{setFinish(e.target.value)}} required></input></label><br/>
            <label>Описание:<textarea name="description" value={description} onChange={(e)=>{setDescription(e.target.value)}}></textarea></label><br/>
            {task === null && <button style={{background: 'lime', borderRadius: 10, padding: '10px 20px', color: 'white', fontSize: 18}}>Создать задачу</button>}
            {task !== null && <button style={{background: 'yellow', borderRadius: 10, padding: '10px 20px', color: 'black', fontSize: 18}}>Редактировать задачу</button>}
        </form>
        {task !== null && <button style={{background: 'red', borderRadius: 10, padding: '10px 20px', color: 'white', fontSize: 18}} onClick={handleDelete}>Удалить задачу</button>}
        </PopupComponent>
    )
}

function TaskComponent({task}) {
    const id = task.id;
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
    const statuses = [ 'FREE', 'OCCUPIED', 'INPROGRESS', 'FINISHED', 'CANCELED', 'BLOCKED', 'TROUBLES' ];
    function handleUpdateTaskState(ev) {
        task.status = ev.target.value;
    }
    return (<sup key={'task_sup'+id}>
                <select style={{color: statusesColors[task.status], fontSize: 13, borderRadius: "10px"}} value={task.status} onChange={handleUpdateTaskState} key={"task_select"+id}>
                    {statuses.map(status => 
                        (<option style={{color: statusesColors[status], fontSize: 13}} key={"task"+id+"_select_option"+status} title={statusesDescriptions[status]}>{status}</option>)
                    )}
                </select>
            </sup>)
}
const BoardListComponent = () => {
    const {isIn} = useAuth();
    const navigate = useNavigate();
    useEffect(()=>{
        if(!isIn())
            navigate("/auth");
    },[]);
    const [boards, setBoards] = useState([]);
    const [message, setMessage] = useState('');
    const palitres = [[' #FFFFFF', ' #3498DB',' #E74C3C'],
                      [' #F5F5F5', ' #1ABC9C', ' #F1C40F'],
                      [' #FDFDFD', ' #2980B9', ' #27AE60'],
                      [' #F0F0F0', ' #95A5A6', ' #E74C3C'],
                      [' #F8B195', ' #F8B195', ' #355C7D'],
                      [' #FFFFFF', ' #E74C3C', ' #2ECC71'],
                      [' #FFFFFF', ' #3498D8', ' #E67E22'],
                      ['linear-gradient( #F5F7FA, #B8C6DB)', ' #FF7E5F', ' #FEB47B']];
    function fetchTasks() {
        getOwnedBoards()
        .then((resp) => {
            let c = 0;
            return Promise.all(
                resp.data.map((board) => getBoardContain(board.id).then((tasks)=>{
                        return {
                            'id': board.id,
                            'tasks': tasks.data.list,
                            'name': board.name,
                            'show': false,
                            'seqNum': c++,
                            'owner': board.owner
                        }
                    })
                )
            ).then((boards)=> {
                setBoards(boards);
            })
        }).catch((err) => {setMessage('Не удалось загрузить доски')});
    }
    useEffect(fetchTasks, []);
    const inheritedStyles = {margin: 0};
    function toggleBoard(board) {
        board.show = !board.show;
        const newBoards = [...boards];
        setBoards(newBoards);
    }
    const [editedBoard, setEditedBoard] = useState(null);
    const [boardSettingsPopup, setBoardSettingsPopup] = useState(false);
    const [editedTask, setEditedTask] = useState(null);
    const [taskSettingsPopup, setTaskSettingsPopup] = useState(false);
    return (
        <div>
            <BoardListHeader buttonCallback={()=>{setBoardSettingsPopup(true); setEditedBoard(null);}} />
            {boardSettingsPopup && <BoardSettinsComponent board={editedBoard} closeCallback={()=>{setBoardSettingsPopup(false);fetchTasks();}}/>}
            {taskSettingsPopup && <TaskSettingsComponent task={editedTask} board={editedBoard} closeCallback={()=>{setTaskSettingsPopup(false);fetchTasks();}}/>}
            {message && <p key="message">{message}</p>}
            {boards.length === 0 && <p key="no boards">Нет задач!</p>}
            <div key="boardsGrid" style={{display: "grid", gap: "10px"}}>
            {boards.map((board)=>(
                <div key={'board'+board.id} style={{background: palitres[board.seqNum%palitres.length][0], width: "30vw", gridRow: Math.floor(board.seqNum/3)+1, gridColumn: board.seqNum%3+1, border: "2px solid black"}}>
                    <div key={"board_header"+board.id} onClick={()=>toggleBoard(board)} style={{cursor: 'pointer', margin: 3}}>
                        <h1 style={{margin: 0}}>
                            <p style={{display:"inline", fontWeight: 'normal'}}>
                                {board.show?'\u2228':'>'}
                            </p>
                            {board.name}
                            <img src='./icons/update.png' height="20em" width="20em" onClick={()=>{setEditedBoard(board); setBoardSettingsPopup(true);}}/>
                        </h1>
                    </div>
                    <div key={"board_body"+board.id} style={{maxHeight: '30vh', overflow: 'auto'}}>
                        {board.show && board.tasks.map((task)=>(
                            <div key={'task'+task.id} style={{background: task.id%2===0?palitres[board.seqNum%palitres.length][1]:palitres[board.seqNum%palitres.length][2], padding: 0, margin: 0}}>
                                <h2 style={{...inheritedStyles, textDecoration: ['FINISHED', 'CANCELED'].includes(task.status)?'line-through':''}}>{task.name}<TaskComponent task={task} /></h2>
                                <p style={inheritedStyles}>Начало: {task.start}</p>
                                <p style={inheritedStyles}>Конец: {task.finish}</p>
                            </div>
                        ))}
                        {board.show && 
                            <div key={'add_task'+board.id}>
                                <h2 style={{...inheritedStyles, cursor: 'pointer'}} onClick={()=>{setEditedTask(null); setEditedBoard(board); setTaskSettingsPopup(true);}}><p style={{display: 'inline', color: 'lime'}}>+</p>Добавить задачу</h2>
                            </div>
                        }
                    </div>
                </div>
            ))}
            </div>
        </div>
    );
}
export default BoardListComponent;
