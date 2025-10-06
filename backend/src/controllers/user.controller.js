import { asyncHandler } from "../utils/asyncHandler.js";




const registerUser = asyncHandler(async (req, res) => {
    res.send("Registered User")
})


export { registerUser }