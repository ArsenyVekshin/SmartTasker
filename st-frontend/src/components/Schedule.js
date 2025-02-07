import React, {useEffect, useState} from 'react';
import {useNavigate} from 'react-router-dom';
import {useAuth} from '../context/auth';
import { getSchedule, getTask, setWorkday } from '../services/api';

const ScheduleComponent = () => {
    const {isIn} = useAuth();
    const navigate = useNavigate();
    const [scheduledTasks, setScheduledTasks] = useState([]);
    const colors = ['red','orange','yellow','green','cyan','indigo','purple','magenta']
    useEffect(()=>{
        isIn()
        .then(()=>{
            setWorkday('09:00:00','18:00:00')
            .then((resp)=>{
                console.log(resp);
            })
            .catch((err) => {
                console.log(err);
            })
            function dayStart(date){return new Date(date.getFullYear(), date.getMonth(), date.getDate(), 9)}
            getSchedule(((date)=>`${String(date.getFullYear()).padStart(4,'0')}-${String(date.getMonth()+1).padStart(2,'0')}-${String(date.getDate()).padStart(2,'0')}`)(new Date()))
            .then((resp)=>
                Promise.all(resp.data.map((sched)=>{
                    if (sched.task_id !== undefined)
                        return getTask(sched.task_id)
                        .then((resp)=>[resp.data, sched])
                    else
                        return new Promise((fulfilled, rejected)=>fulfilled([{
                            name: 'Обед уютненько'
                        }, sched]))
                })).then((scheds)=>setScheduledTasks(scheds.map((sched)=>({
                    ...sched[1],
                    name: sched[0].name,
                    startTime: (new Date(sched[1].start).getTime()-dayStart(new Date(sched[1].start)).getTime())/1000/60,
                }))))
            )
            .catch((err)=>console.log(err))
        })
        .catch(/*()=>navigate("/auth")*/);
    },[isIn, navigate]);

    return (
        <div>
            <div style={{display: 'flex', flexDirection: 'column'}}>
                {
                    [9,10,11,12,13,14,15,16,17,18].map((i)=>(
                        <div key={i} style={{display: 'flex', flexDirection: 'row', borderStyle: 'dashed', borderWidth: '1px', height: i!==18?(String((97-3)/9)+'vh'):'3vh'}}>
                            <div key={'-'+String(i)} style={{width: '10vw', background: (i-9)%2===0?'rgb(240,240,240)':'white', justifyItems: 'right'}}>
                                <p style={{margin: 0}}>{i}:00</p>
                            </div>
                            <div key={'+'+String(i)} style={{width: '90vw', background: (i-9)%2!==0?'rgb(240,240,240)':'white'}} />
                        </div>
                    ))
                }
            </div>
            {scheduledTasks.map((schedule, ind)=>(
                <div key={`${schedule.id}`} style={{background:colors[ind], height: String(schedule.duration/(9*60)*96)+'vh', position: 'absolute', left: '10vw', top: String(schedule.startTime/(9*60)*96)+'vh', width:'90vw'}}>
                    <p>{schedule.name}</p>
                </div>
            ))}
        <button onClick={()=>console.log(scheduledTasks)}>Lol</button>
        </div>
    )
}
export default ScheduleComponent;
