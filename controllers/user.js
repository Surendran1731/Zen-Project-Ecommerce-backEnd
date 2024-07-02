import { User } from "../models/User.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import sendMail from "../middlewares/sendMail.js";


//user register
export const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    let user = await User.findOne({ email });

    if (user)
      return res.status(400).json({
        message: "User Already Exists",
      });

    const hashPassword = await bcrypt.hash(password, 10);

    user = {
      name,
      email,
      password: hashPassword,
    };

    const otp = Math.floor(Math.random() * 1000000);

    const activationToken = jwt.sign(
      { user, otp },
      process.env.Activation_Secret,
      {
        expiresIn:"5m"  ,//5mins
      }
    );

    await sendMail(
      email,
      "Purplle.com OTP Verification",
      `Please Verify your Account using OTP your OTP is ${otp}`
    );

    res.status(200).json({
      message: "OTP send to your mail",
      activationToken,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};


//Verify User
export const verifyUser=async (req,res) =>{
  try {
    const {otp ,activationToken}=req.body;

    const verify =jwt.verify(activationToken,process.env.Activation_Secret);

    //otp expired verification
    if(!verify)
      return res.status(400).json({
        message:"OTP Expired"
      })

      //otp wrong verification
    if(verify.otp!==otp)
      return res.status(400).json({
        message:"Wrong OTP"
      })

      //true verification
    await User.create({
      name:verify.user.name,
      email:verify.user.email,
      password:verify.user.password,
    });

    res.json({
      message:"User Registered Successful"
    });
    
    
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
}


//Login User

export const loginUser=async (req,res) =>{
  try {
    const {email,password}=req.body;
    
    const user=await User.findOne({email});

    if(!user)
      return res.status(400).json({
        message:"Invalid Credentials"
      });

      //password verification

      const matchPassword =await bcrypt.compare(password,user.password);

      if(!matchPassword)
        return res.status(400).json({
          message:"Invalid Credentials"
        })

      //token Generate

      const token=jwt.sign({_id:user._id},process.env.JWT_SEC,{
        expiresIn:"20d"  //15days
      })

      // output screen
      res.json({
        message:`Welcome back ${user.name}`,
        token,
        user
      })

  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
}


//view profile

export const myProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    res.json({ user });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

