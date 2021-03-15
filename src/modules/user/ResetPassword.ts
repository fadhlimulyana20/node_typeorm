import { Arg, Mutation, Query, Resolver, Root, UseMiddleware } from "type-graphql";
import bcrypt from "bcryptjs";
import { User } from "../../entity/User";
import { ResetPasswordInput } from './resetPassword/ResetPasswordInput';
import { isAuth } from "../middleware/isAuth";
import { SendMail } from "../utils/sendMail";
import { createConfirmationUrl } from "../utils/createConfirmationUrl";
import { redis } from "../../redis";
import { forgotPasswordPrefix } from "../constants/redisPrefixes";
import { UserInputError } from "apollo-server";

@Resolver()
export class RegisterResolver {
  @Query(() => String)
  @UseMiddleware(isAuth)
  async hello() {
    return 'Hello World';
  }

  @Mutation(() => User)
  async resetPassword(
    @Arg("data") {token, password}: ResetPasswordInput ,
  ): Promise<User | any>{
    const userId = await redis.get(forgotPasswordPrefix+token);

    if (!userId) {
      throw new UserInputError('Invalid Token')
    }

    const user = await User.findOne(userId);

    if (!user) {
      return null
    }

    await redis.del(forgotPasswordPrefix+token);

    user.password = await bcrypt.hash(password, 12);

    await user.save();

    return user;

  }
}