import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";

import {z} from "zod";


import { usernameValidation } from "@/schemas/signUpSchema";





const userNameQuerySchema=z.object({
    username:usernameValidation
})




export async function GET(request:Request)
{
    if(request.method!=="GET")
    {
        return Response.json({
            success:false,
            message:"Invalid method"
        },
        {
            status:405
        })
    }
    await dbConnect();
    try{
            const {searchParams}=new URL(request.url)
            const queryParam={
                username:searchParams.get("username")
            }
            console.log("Backend",queryParam)
            const result=userNameQuerySchema.safeParse(queryParam)
            console.log("Backend",result)
            if(!result.success)
            {     
                

                return Response.json({

                    success:false,
                    message:"Invalid username",
                     
                },{
                    status:400
                })
            }

            const {username}=result.data
            const existingVerifieduser=await UserModel.findOne({username,isVerified:true})

            if(existingVerifieduser)
            {
                return Response.json({
                    success:false,
                    message:"Username already exists"
                },
                {
                    status:400
                })
            }
            return Response.json({
                success:true,
                message:"Username is available"
            })
    }
    catch(e)
    {
        console.log(e)
        return Response.json({
            success:false,
            message:"Error in checking username"
           
        },
        {
                   status:500
        }
    
    )
    }

    
}