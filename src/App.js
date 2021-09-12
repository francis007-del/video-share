import React,{useState,useRef,useEffect} from 'react';
import Notifications from './components/notifications/notifications';
import io from 'socket.io-client';
import Peer from 'simple-peer';
import './App.css';

const socket=io('http://localhost:5000');
const App=()=> {
  const [stream,setStream]=useState();
  const [call,setCall]=useState();
  const MyVideo=useRef();
  const [id,setId]=useState();
  const [idtoCall,setIdtoCall]=useState();
  const [callEnded,setCallEnded]=useState(false);
  const userVideo=useRef();
  const [callAccepted,setCallAccepted]=useState(false);
  const connectionRef=useRef();
  const [name,setName]=useState('');
  
  useEffect(()=>{
    navigator.mediaDevices.getUserMedia({ video: true, audio: true }).then(stream => {
      setStream(stream);
      if (MyVideo.current) {
        MyVideo.current.srcObject = stream;
      }
    })
    
    socket.on('me',(id)=>setId(id));
    socket.on('callUser',({signal,from,name})=>{
      setCall({signal,from,name,isReceivingCall:true});
    })
  },[])
  const callUser=(Id)=>{
    const peer=new Peer({initiator: true, trickle: false, stream })
    peer.on('signal',(data)=>{
      console.log("signal");
      socket.emit('callUser',({userToCall:Id,signal:data,from:id,name}));
    });
    peer.on('stream',(stream)=>{
      console.log(stream);
     userVideo.current.srcObject=stream;
    });
   socket.on('callaccepted',(signal)=>{peer.signal(signal),setCallAccepted(true)});
    connectionRef.current=peer;
  }
  const LeaveCall=()=>{
   setCallEnded(true);
   connectionRef.current.destroy();
   window.location.reload();
  }
  const AnswerCall=()=>{
  setCallAccepted(true);
  const peer=new Peer({initiator: false, trickle: false, stream })
  peer.on('signal',(data)=>{
    socket.emit('callaccepted',({signal:data,to:call.from}));
  });
  peer.on('stream',(stream)=>{
    if (userVideo.current) {
      userVideo.current.srcObject = stream;
    }
  });
  peer.signal(call.signal);
  connectionRef.current=peer;
  }
  const changeName=(e)=>{
  setName(e.target.value);
  }
  return (
    <div className="App">
      <div className="title">
         <h1>VIDEO SHARE</h1>
      </div>
      <div className="videos">
      <video ref={MyVideo} playsInline muted autoPlay width='50%' height='90%' />
     {
     callAccepted&&!callEnded?
     <video ref={userVideo} playsInline width='50%' height='90%' autoPlay/>:null
     }
      </div>
      <div className="notifications">
       <Notifications call={call} idtoCall={idtoCall} setIdtoCall={setIdtoCall} callUser={callUser} answerCall={AnswerCall} callAccepted={callAccepted} leaveCall={LeaveCall} id={id} name={name} changeName={changeName} callEnded={callEnded}/>
      </div>
    </div>
  );
}

export default App;
