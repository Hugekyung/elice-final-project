import { Router } from "express";
import wrapAsyncFunc from "@src/utils/catchAsync";
import { userSchema } from "@src/utils/bodySchema";
import { UserService } from "@src/service/user.service";
import { STATUS_200_OK, STATUS_201_CREATED } from "@src/utils/statusCode";
import { bodyValidator } from "@src/middlewares/bodyValidator";

const userController = Router();

userController.post(
    "/users/register",
    bodyValidator(userSchema),
    wrapAsyncFunc(async (req, res, _next) => {
        const createdUser = await UserService.addUser(req.body);
        res.status(STATUS_201_CREATED).json(createdUser);
    }),
);

userController.post(
    "/users/login",
    wrapAsyncFunc(async (req, res, _next) => {
        const { user, accessToken, refreshToken } = await UserService.login(req.body);
        res.cookie("accessToken", accessToken);
        res.cookie("refreshToken", refreshToken);
        res.status(STATUS_200_OK).json(user);
    }),
);

export default userController;
