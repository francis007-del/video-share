const app=require('express')();
const server = require('http').createServer(app);
const cors=require('cors');
const io=require('socket.io')(server,{
    cors:{
        origin: '*',
        method: ['GET','POST']
    }
});
app.use(cors());
io.on('connection',(socket)=>{
    socket.emit('me',socket.id);
    socket.on('disconnect',()=>socket.broadcast.emit('disconnected'));
    socket.on('callUser',({userToCall,signal,from,name})=>{
     io.to(userToCall).emit("callUser",{signal,from,name});
    })
    socket.on('callaccepted',(data)=>{
      io.to(data.to).emit('callaccepted',data.signal);
    })
})

server.listen(5000,()=>console.log("listening"));