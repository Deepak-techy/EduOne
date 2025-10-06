import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { User } from "../models/user.model.js";




const registerUser = asyncHandler(async (req, res) => {
    // get user details from frontend
    const { fullName, userName, email, password, role } = req.body

    // validation - not empty
    if ([fullName, userName, email, password, role].some((field) => field?.trim() === "")) {
        throw new ApiError(400, "All fields are required")
    }

    // check if user already exists: userName, email
    const existedUser = await User.findOne({
        $or: [{ userName }, { email }]
    })

    if (existedUser) {
        throw new ApiError(409, "User with email or username already exists")
    }

    // create user object - create entry in db
    const user = await User.create({
        fullName,
        userName,
        email,
        password,
        role,
    })

    // remove password and refresh token field from response
    const createdUser = await User.findById(user._id).select(
        "-password -refreshToken"
    )

    // check for user creation
    if (!createdUser) {
        return new ApiError(500, "Something went wrong while registring the user")
    }

    // return response
    return res
        .status(200)
        .json(new ApiResponse(200, "User registered successfully"))

})

const loginUser = asyncHandler(async (req, res) => {
    // req.body se data lo
    // username or email based access
    // find the user
    // check the password
    // generate access and refresh token
    // send tokens through cookies
})



export {
    registerUser,
    loginUser
}