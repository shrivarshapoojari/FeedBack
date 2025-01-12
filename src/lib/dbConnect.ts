import mongoose from "mongoose";


type ConnectionObject={
    isConnected?:number;
}

const connection:ConnectionObject={};



async function dbConnect() :Promise<void>

{

    if(connection.isConnected){
        console.log("Using existing connection");
        return;
    }

    try{
       const db=  await mongoose.connect(process.env.MONGO_URI  || "",{})

     connection.isConnected=db.connections[0].readyState;
     console.log("New connection created");
    }catch(err){
        console.log("DB connection error",err);
        process.exit(1);

    }
}

export default dbConnect;   