import {NextAuthOptions} from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import UserModel from '@/model/User'
import bcrypt from 'bcryptjs'

import dbConnect from '@/lib/dbConnect'

export const authOptions: NextAuthOptions = {
    providers:[
        CredentialsProvider({
            id:"credentials",
            name:"Credentials",
            credentials:{
                email:{label:"email",type:"text"},
                password:{label:"Password",type:"password"}
            },

            async authorize(credentials:any):Promise<any>
            {
                
                await dbConnect()
                try{
                    const user=await UserModel.findOne({ 
                       $or: [
                                  { email: credentials.identifier },
                                  {username: credentials.identifier },
                        ]
                    })
                    if(!user)
                    {
                        throw new Error('No user found')
                    }
                    if(!user.isVerified)
                    {
                        throw new Error('User not verified')
                    }
                    const isvalid=await bcrypt.compare(credentials.password,user.password)
                    if(isvalid){
                        return user
                    }
                    else
                    {
                        throw new Error('Password is incorrect')
                    }
                }
                catch(error:any){
                    throw new Error(error)
                }
               
            }
        })

    ],
    callbacks:{
        async jwt({token,user})
        {
             
            return token
        }
    },
    pages:{
        signIn:'/sign-in',
    },
    session:{
        strategy:'jwt',
    },
    secret:process.env.NEXT_AUTH_SECRET

}
