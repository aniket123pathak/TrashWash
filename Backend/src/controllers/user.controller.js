import { asyncHandler } from "../utils/asyncHandler.js";
import { apiResponse } from "../utils/apiResponse.js";
import { apiError } from "../utils/apiError.js";
import { User } from "../models/user.model.js";

const generateAccessAndRefreshToken = async (id) => {
  try {
    const user = await User.findById(id);

    const accessToken = user.generateAccessToken();
    const refreshToken = user.generateRefreshToken();

    user.refreshToken = refreshToken;

    await user.save({ validateBeforeSave: false });
    return { accessToken, refreshToken };
  } catch (error) {
    throw new apiError(
      500,
      "something went wrong while generating the Access and refresh token"
    );
  }
};

const userRegister = asyncHandler(async (req, res) => {
  const { email, phoneNumber, fullName, password } = req.body;

  if (!email || !fullName || !phoneNumber || !password) {
    throw new apiError(400, "Fill Every Field..");
  }

  if ([email, fullName, phoneNumber].some((fields) => fields?.trim() === "")) {
    throw new apiError(400, "Fill Every Field..");
  }

  const existedUser = await User.findOne({
    $or: [{ email }, { phoneNumber }],
  });

  if (existedUser) {
    throw new apiError(400, "User Alredy Registerd..pls login");
  }

  const user = await User.create({
    fullName,
    email: email.toLowerCase(),
    phoneNumber,
    password,
  });

  const createdUser = await User.findById(user._id).select(
    "-password -refreshToken"
  );

  if (!createdUser) {
    throw new apiError(500, "Unable To create The User...");
  }

  return res
    .status(201)
    .json(
      new apiResponse(
        201,
        createdUser,
        "New User registered Successfully.."
      )
    );

});

const userLogin = asyncHandler(async (req,res)=>{
    const { email , phoneNumber , password} = req.body;

    if(!email&&!phoneNumber){
        throw new apiError(400,"Field cannot be Empty")
    }

    const user = await User.findOne({
        $or :[{email},{phoneNumber}]
    });

    if(!user){
        throw new apiError(
            404,
            "User not found check credntials or Register first"
        );
    }

    const isPasswordValid = await user.isPasswordCorrect(password);

    if(!isPasswordValid){
        throw new apiError(400,"Invalid Password");
    }

    const {accessToken , refreshToken } = await generateAccessAndRefreshToken(user._id);

    const loggedInUser = await User.findById(user._id).select("-password -refreshToken")

    if(!loggedInUser){
        throw new apiError(500,"Unalble to login the User...");
    }

    const options = {
        httpOnly:true,
        secure:true
    }

    return res
    .status(200)
    .cookie("accessToken",accessToken,options)
    .cookie("refreshToken",refreshToken,options)
    .json(
        new apiResponse(
            200,
            {
                citizen : loggedInUser , accessToken , refreshToken
            },
            "User Logged in successfully"
        )
    )
});

const userLogout = asyncHandler(async(req,res)=>{
    await User.findByIdAndUpdate(
    req.user._id,
    {
      $set: {
        refreshToken: undefined,
      },
    },
    {
      new: true,
    }
  );

  const options = {
    httpOnly: true,
    secure: true,
  };

  return res
    .status(200)
    .clearCookie("accessToken", options)
    .clearCookie("refreshToken", options)
    .json(new apiResponse(200, {}, "User Logged Out Successfully.."));
});

export { userRegister, userLogin ,userLogout };
