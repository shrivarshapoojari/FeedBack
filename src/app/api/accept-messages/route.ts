import { getServerSession } from "next-auth";
import { AuthOptions } from "next-auth";
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import {User} from "next-auth"
import exp from "constants";
import { authOptions } from "../auth/[...nextauth]/options";



export async function POST(request:Request)
{
    await dbConnect();
   const session= await getServerSession(authOptions) 

   const user=session?.user

   if(!session || !session.user)
   {
       return Response.json({
           success:false,
           message:"Unauthorized"
       },
       {
           status:401
       })
   }
   const userId=user?._id
   const {acceptMessages}=await request.json()
   try{
      const updatedUser= await UserModel.findByIdAndUpdate(userId,{acceptMessages},
        {new:true})
       if(!updatedUser)
       {
              return Response.json({
                success:false,
                message:"User not found"
              },
              {
                status:404
              })
       }
         else
         {
                  return Response.json({
                 success:true,
                 message:"Messages acceptance status updated successfully",
                 updatedUser
                  }
                ,{status:200})
            
            
                }

   }

   catch(error)
   {
         console.log(error)
         return Response.json({
              success:false,
              message:"Unable to accept messages"
         },
         {
              status:500
         })
   }
}





export async function GET(request:Request)
{

    await dbConnect();
    const session= await getServerSession(authOptions) 
 
    const user=session?.user
 
    if(!session || !session.user)
    {
        return Response.json({
            success:false,
            message:"Unauthorized"
        },
        {
            status:401
        })
    }
    const userId=user?._id
    try{
       const user= await UserModel.findById(userId)
        if(!user)
        {
               return Response.json({
                 success:false,
                 message:"User not found"
               },
               {
                 status:404
               })
        }
          else
          {
                   return Response.json(
                    {
                        success:true,
                        message:"Messages acceptance status fetched successfully",
                        acceptMessages:user.isAcceptingMessage
                   }
                 ,      {status:200})
                
             


        }
 
    }
 
    catch(error)
    {
          console.log(error)
          return Response.json({
               success:false,
               message:"Unable to fetch messages acceptance status"
          },
          {
               status:500
          })
    }


}