import express from 'express';
import mongoose from 'mongoose';
import Messages from './dbMessages.js'
import Pusher from 'pusher'
import cors from 'cors';
//Config
const app=express()
const port=process.env.PORT || 9000

const pusher = new Pusher({
    appId: "1222814",
    key: "30a972259b482bc807ca",
    secret: "b5bab619ccf6244580d3",
    cluster: "ap2",
    useTLS: true
  });



//middleware
app.use(express.json())
app.use(cors());

// app.use((req,res,next)=>{
//     res.setHeader("Allow-Cantrol-Allow-Origin","*");
//     res.setHeader("Allow-Cantrol-Allow-Headers","*");
//     next();
// });

//DB config
const connection_url='mongodb+srv://roshank:roshank@cluster0.554fp.mongodb.net/whatsappdb?retryWrites=true&w=majority'
mongoose.connect(connection_url,{
    useCreateIndex:true,
    useNewUrlParser:true,
    useUnifiedTopology:true
})
const db=mongoose.connection;

db.once('open',()=>{
    console.log('Db connected')

    const msgCollection=db.collection('messagecontents')
    const changeStream=msgCollection.watch();

    changeStream.on('change',(change)=>{
        console.log(change)
        if(change.operationType==='insert'){
            const messageDetails=change.fullDocument;
            pusher.trigger('messages','inserted',{
                name:messageDetails.name,
                message:messageDetails.message,
                received:messageDetails.received,
            })
        }else{
            console.log("Error in Pusher")
        }

    });
});


//app routes
app.get('/',(req,res)=>res.status(200).send('hello world'))

app.post('/messages/new',(req,res)=>{
    const dbMessage=req.body
    Messages.create(dbMessage,(err,data)=>{
        if (err){
            res.status(500).send(err)
        }else{
            res.status(201).send(`new message created: \n ${data}`)
        }
    })
})

app.get('/messages/sync',(req,res)=>{
    Messages.find((err,data)=>{
        if (err){
            res.status(500).send(err)

        }else{
            res.status(200).send(data)
        }
    })
})

//listen
app.listen(port,()=>console.log(`Listening on localhost:${port}`))