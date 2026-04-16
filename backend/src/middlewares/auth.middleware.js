import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import jwt from "jsonwebtoken";
import { User } from "../models/user.model.js";

export const verifyJWT = asyncHandler(async (req, res, next) => {
  // req.cookies.accessToken → WEB BROWSER ONLY.
  // (Browser automatically sends cookies to your server for every request to the same domain.)

  // Authorization: Bearer <token> → STANDARD HEADER.
  // (Used by mobile apps, Postman, frontend apps when not using cookies.
  // Browsers do NOT automatically send this — you manually include this in fetch()/axios/Postman.)

  // x-access-token → CUSTOM HEADER.
  // (Only used if YOU decide to design your API that way. Works for mobile, Postman, frontend.)
  const authHeader = req.headers.authorization;

  const token =
    req.cookies?.accessToken ||
    (authHeader && authHeader.startsWith("Bearer ")
      ? authHeader.split(" ")[1]
      : null);

  if (!token) throw new ApiError(401, "Unauthorized request");

  try {
    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
     if (!decoded?._id) {
      throw new ApiError(401, "Invalid token payload");
    }

    const user = await User.findById(decoded?._id).select("-password");

    if (!user) throw new ApiError(401, "Invalid Access Token");
    req.user = user;
    next();
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      throw new ApiError(401, "access token expired");
    }

    throw new ApiError(401, "Invalid Access Token");
  }
});
