import mongoose,{Schema,Document, Model} from "mongoose";



export interface Message extends Document{
    content:string;
    createdAt:Date;
}


const  MessageSchema :Schema<Message> = new Schema({

    content:{
        type:String,
        required:true
    },
    createdAt:{
        type:Date,
        default:Date.now,
        required:true
    }
})



export interface User extends Document{
    username:string,
    email:string,
    password:string,
    verifyCode:string,
    verifyCodeExpiry:Date,
    isVerified:boolean, 
    isAcceptingMessage:boolean,
    message:Message[],


}


const UserSchema:Schema<User> = new Schema({
    username:{
        type:String,
        required:true,
        trim:true,
        unique:true

    },
    email:{
        type:String,
        required:true,
        unique:true,
        match:[/^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/,"Please fill a valid email address"]
    },
    password:{
        type:String,
        required:true,

    },
    verifyCode:{
        type:String,
        required:true
    },
    verifyCodeExpiry:{
        type:Date,
        required:true
    },
    isVerified:{
        type:Boolean,
         default:false,
    },
    isAcceptingMessage:{
        type:Boolean,
        default:true
    },
    message:[MessageSchema]
})


const UserModel=(mongoose.models.User as Model<User>) ||mongoose.model<User>("User",UserSchema);



export default UserModel;