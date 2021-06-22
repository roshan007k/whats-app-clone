import React,{useState} from 'react'
import './Chat.css'
import { Avatar,IconButton } from '@material-ui/core'
import { AttachFile, InsertEmoticon, SearchOutlined } from '@material-ui/icons'
import MoreVert from '@material-ui/icons/MoreVert'
import  MicIcon  from '@material-ui/icons/Mic'
import axios from './axios';
const Chat = ({messages}) => {

    const [message,setMessage]=useState('');

    const submitHandler= async(e)=>{
        e.preventDefault();

        await axios.post('messages/new',{

            "message":message,
            "name":"Roshan",
            "timestamp":"Test",
            "received":false
        })

        setMessage('');

    }

    
    return (
        <div className="chat">
            <div className="chat__header">
                <Avatar />

                <div className="chat__headerInfo">
                    <h3>Room name</h3>
                    <p>Last Seen at ....</p>
                </div>

                <div className="chat__headerRight">
                    <IconButton >
                        <SearchOutlined />
                    </IconButton >
                    <IconButton >
                        <AttachFile />
                    </IconButton >
                    <IconButton >
                        <MoreVert />
                    </IconButton >
                </div>

            </div>
            
            <div className="chat__body">
                {messages.map(message => (
                        <p className={`chat__message ${message.received && "chat_receiver"}`}>
                        <span className="chat__name">{message.name}</span>
                        {message.message}
                        <span className="chat__timestamp">{message.timestamp}</span>
                        </p>
                ))}

            </div>


            <div className="chat__footer">
                 <InsertEmoticon />
                 <form onSubmit={submitHandler}>
                     <input value={message} name="message"  placeholder="Type a message" type="text" onChange={e=>setMessage(e.target.value)}></input>
                     <button onSubmit={submitHandler} type="submit">Send a message</button>
                 </form>
                 <MicIcon></MicIcon>
            </div>
            
        </div>
    )
}

export default Chat
