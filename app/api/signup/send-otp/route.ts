import { prisma } from '@/lib/prisma'
import { NextRequest, NextResponse } from 'next/server'
import bcrypt from 'bcrypt'
import nodemailer from 'nodemailer'

export async function POST (req: NextRequest, res: NextResponse) {
  try {

    const { email,password,name} = await req.json();

    if (!email)
      return NextResponse.json({ error: 'Email is required' }, { status: 400 })
    if (!password)
      return NextResponse.json(
        { error: 'password is required' },
        { status: 400 }
      )
    if (!name)
      return NextResponse.json({ error: 'name is required' }, { status: 400 })

    const isAlreadyExists = await prisma.user.findFirst({
      where: {
        email,
        isVerified:true,
      }
    })

    console.log(isAlreadyExists)

    if (isAlreadyExists)
      return NextResponse.json(
        { error: 'User already exists' },
        { status: 409 }
      )

    const transporter = nodemailer.createTransport({
      host: 'smtp-relay.brevo.com',
      port: 587,
      auth: {
        
        user: 'shekarks@gmail.com',
        pass: process.env.SMTP_PASS
      }
    })

    let otp = 0
    const sendOtpVerification = async () => {
      otp = Math.floor(Math.random() * 100000000)
      // console.log(otp)
      const mailOptions = {
        from: 'shekarks@gmail.com',
        to: email,
        subject: 'verify Your email',
        html: `<p>Enter the otp ${otp} to verify your email</p>`
      }
      const info = await transporter.sendMail(mailOptions)
    }

    await sendOtpVerification()

    const hashedPassword = await bcrypt.hash(password, 8)

    const newUser = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        name,
        otp:otp.toString()
      }
    })

    return NextResponse.json(newUser , { status: 201 })
  } catch (e) {
    console.log(`Error in send-otp POST req ${e}`)
    return NextResponse.json(
      { error: `Error in send-otp POST req ${e}` },
      { status: 500 }
    )
  }
}