import React from "react";
import CopyToClipboard from "react-copy-to-clipboard";
import {TextField,Button} from "@material-ui/core";
import {Assignment,PhoneDisabled,Phone} from '@material-ui/icons';
import './notifs.css';
const Notifications=({call,answerCall,callAccepted,leaveCall,id,name,changeName,callUser,idtoCall,setIdtoCall,callEnded})=>{
    return(
        <div className="container">
            <div className="upper">
            {
            call&&call.isReceivingCall&&!callAccepted?
                <div className="notification">
              <div className="callername">{call.name} is calling</div>
              <Button variant="contained" color="primary" onClick={answerCall} className="button">
            Answer
          </Button>
            </div>:null
            }
            </div>
        <div className="notifications">
            <div className="name">
      <TextField label="Name" value={name} onChange={(e) => changeName(e)} fullWidth />
      </div>
      <div className="name">
      <TextField label="CallUser" value={idtoCall} onChange={(e) => setIdtoCall(e.target.value)} fullWidth />
      </div>
      <div className="buttons">
      {
          callAccepted&&!callEnded?
          (
            <Button variant="contained" color="secondary" startIcon={<PhoneDisabled fontSize="large" />} fullWidth onClick={leaveCall} className="button">
              Hang Up
            </Button>
          ) : (
            <Button variant="contained" color="primary" startIcon={<Phone fontSize="large" />} fullWidth onClick={() => callUser(idtoCall)} className="button" >
              Call
            </Button>
          )
      }
      </div>
         <CopyToClipboard text={id} >
                <Button variant="contained" color="primary"  startIcon={<Assignment fontSize="large" />} className="button">
                  Copy Your ID
                </Button>
              </CopyToClipboard>
        </div>
        </div>
    )
}
export default Notifications;