import { resend } from "@/lib/resend";

import VerificationEmail from "../../emails/VerificationEmail";

import { ApiResponse } from "@/types/ApiResponse";
import { Verification } from "next/dist/lib/metadata/types/metadata-types";



export async function sendVerificationEMail(email:string, username:string,verifyCode:string):Promise<ApiResponse>{

    try{
                   await resend.emails.send({
                      from:'onboarding@resend.dev',
                      to:email,
                      subject:'FeedBack | Verification Code',
                      react: VerificationEmail({username,otp:verifyCode})
                   })


        return{
            success:true,
            message:"Email sent successfully"   
           }
    }
    catch(error){
       console.log("Error in sendVerificationEmail",error);
       return{
        success:false,
        message:"Error in sendVerificationEmail"
       }
    }
}