import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";


export async function POST(request:Request)
{
    try{
                const {username,code}=await request.json()

              const decodedUsername=  decodeURIComponent(username)
              const user=await UserModel.findOne({username:decodedUsername})
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

                const isCodeValid=user.verifyCode===code
                const isCodeNotExpired=new Date(user.verifyCodeExpiry)>new Date()
                if(isCodeValid && isCodeNotExpired)
                {
                    user.isVerified=true
                    await user.save()
                    return Response.json({
                        success:true,
                        message:"Account verified successfully"
                    })
                }
                else
                {
                    return Response.json({
                        success:false,
                        message:"Invalid code"
                    },
                    {
                        status:400
                    })
                }

    }
    catch(error)
    {
        console.log(error)
        return Response.json({
            success:false,
            message:"Unable to verify code"
        },
        {
            status:500
        })
    }
}