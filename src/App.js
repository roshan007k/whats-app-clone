import { useEffect ,useState} from 'react';
import './App.css';
import Chat from './Chat';
import Sidebar from './Sidebar';
import Pusher from 'pusher-js'
import axios from './axios';
function App() {
  const [messages,setMessages]=useState([]);
  useEffect(()=>{
    axios.get('/messages/sync')
    .then((response)=>{
      setMessages(response.data);
    })

  },[]);
  useEffect(()=>{

    const pusher = new Pusher('30a972259b482bc807ca', {
      cluster: 'ap2'
    });

    const channel = pusher.subscribe('messages');
    channel.bind('inserted', (data)=> {
      setMessages([...messages,data])


      
    });
    return ()=>{
      channel.unbind_all();
      channel.unsubscribe();
    };

  },[messages]);
  return (
    <div className="App">
      <div className="app_body">
          <Sidebar />
          <Chat  messages={messages} />
      </div>
    </div>
  );
}

export default App;
