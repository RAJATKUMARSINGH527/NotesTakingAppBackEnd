const express = require('express'); 
const {connectToDB} = require('./config/db');
const noteRouter = require('./routes/note.routes');
const userRouter = require('./routes/user.routes');
const cors = require('cors');

const app = express();

//middleware to pass the request body
app.use(express.json());
app.use(cors());   //to allow cross origin requests from the frontend to the backend server
//  because the frontend and backend are running on different ports so we need to allow the cross origin requests 
//  from the frontend to the backend server so that the frontend can communicate with the backend server 

app.use('/notes', noteRouter);
app.use('/users', userRouter);



app.listen(8000, async() => {
    try {
        await connectToDB();
        console.log('Server is running on port http://localhost:8000');
    } catch (error) {   
        console.log('Error:', error);
    }
    
});