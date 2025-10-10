import { mongoose, Schema } from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const userSchema = new Schema(
    {
        fullName: {
            type: String,
            required: true,
            trim: true,
            index: true,
        },
        userName: {
            type: String,
            required: true,
            trim: true,
            unique: true,
            index: true,
        },
        email: {
            type: String,
            required: true,
            trim: true,
            unique: true,
            lowercase: true,
            index: true,
        },
        password: {
            type: String,
            required: [true, "Password is required"],
        },
        role: {
            type: String,
            enum: ["Student", "Teacher", "Admin"],
            required: true,
        },
        refreshToken: {
            type: String,
        },
        avatar: {
            type: String,
        },
        accountStatus: {
            type: String,
            enum: ["Active", "Suspended", "Deleted"],
            default: "Active",
        },
        resetPasswordToken: {
            type: String,
        },
        resetPasswordExpire: {
            type: Date,
        },
    },
    {
        timestamps: true
    }
)

userSchema.pre("save", async function (next) {
    if (!this.isModified("password")) return next()

    this.password = await bcrypt.hash(this.password, 10)
    next()
})

userSchema.methods.isPasswordCorrect = async function (password) {
    return await bcrypt.compare(password, this.password)
}

userSchema.methods.generateAccessToken = function () {
    return jwt.sign(
        {
            _id: this._id,
            email: this.email,
            userName: this.userName,
            fullName: this.fullName
        },
        process.env.ACCESS_TOKEN_SECRET,
        {
            expiresIn: process.env.ACCESS_TOKEN_EXPIRY || "1d"
        }
    )
}

userSchema.methods.generateRefreshToken = function () {
    return jwt.sign(
        {
            _id: this._id,
        },
        process.env.REFRESH_TOKEN_SECRET,
        {
            expiresIn: process.env.REFRESH_TOKEN_EXPIRY || "10d"
        }
    )
}

export const User = mongoose.model("User", userSchema)