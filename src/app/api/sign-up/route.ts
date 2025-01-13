import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import bcrypt from "bcryptjs";
import { sendVerificationEMail } from "@/helpers/sendMail";




export async function POST(request:Request)
{
   await dbConnect();
   try{
      const {username,email,password}= await request.json();
           
      const existingUserVerifiedByUserName= await UserModel.findOne({
            username,
            isVerified:true
      })
      if(existingUserVerifiedByUserName)
      {
         return Response.json({
            success:false,
            message:"User already exists with this username"
         },
         {
            status:400
         }
         )
      }
      
      const existingUserByEmail= await UserModel.findOne({
         email
              })


              if(existingUserByEmail)
              {
                 if(existingUserByEmail.isVerified)
                 {
                    return Response.json({
                        success:false,
                        message:"User already exists with this email"
                    },
                    {
                        status:400
                    })

                }
                else{
                    const hashedPassword= await bcrypt.hash(password,10);
                    const verifyCode=Math.floor(100000+Math.random()*900000).toString();
                    existingUserByEmail.password=hashedPassword;
                    existingUserByEmail.verifyCode=verifyCode;
                    existingUserByEmail.verifyCodeExpiry=new Date(Date.now()+3600000);
                    await existingUserByEmail.save();


                    const emailResponse= await sendVerificationEMail(email,username,verifyCode);
                    if(emailResponse.success)
                    {
                        return Response.json({
                            success:true,
                            message:"User created successfully"
                        },
                        {
                            status:201
                        }
                    )
                    }
                    else
                    {
                        return Response.json({
                            success:false,
                            message:"Error in sending verification email"
                        },
                        {
                            status:500
                        }
                    )
                    }
                }

              }
              else{
                    const verifyCode=Math.floor(100000+Math.random()*900000).toString();
                    const salt= await bcrypt.genSalt(10);
                    const hashedPassword= await bcrypt.hash(password,salt);
                    const expiryDate= new Date();
                    expiryDate.setHours(expiryDate.getHours()+1);
                    const user= new UserModel({
                        username,
                        email,
                        password:hashedPassword,
                        verifyCode,
                        verifyCodeExpiry:expiryDate,
                        isVerified:false,
                        isAcceptingMessage:true,
                        messages:[]
                    })
                    await user.save();
                    
                    const emailResponse= await sendVerificationEMail(email,username,verifyCode);
                    if(emailResponse.success)
                    {
                        return Response.json({
                            success:true,
                            message:"User created successfully"
                        },
                        {
                            status:201
                        }
                    )
                    }
                    else
                    {
                        return Response.json({
                            success:false,
                            message:"Error in sending verification email"
                        },
                        {
                            status:500
                        }
                    )
                    }
              }

   }
   catch(error)
   {
    console.log("Error in POST /api/sign-up",error);
    return Response.json({
        success:false,
        message:"Error in POST /api/sign-up"
    },
    {
        status:500
    }
)
   }
}