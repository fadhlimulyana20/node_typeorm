import { Arg, Mutation, Query, Resolver, Root, UseMiddleware } from "type-graphql";
import bcrypt from "bcryptjs";
import { User } from "../../entity/User";
import { RegisterInput } from "./register/RegisterInput";
import { isAuth } from "../middleware/isAuth";

@Resolver()
export class RegisterResolver {
  @Query(() => String)
  @UseMiddleware(isAuth)
  async hello() {
    return 'Hello World';
  }

  @Mutation(() => User)
  async register(
    @Arg("data") {email, firstName, lastName, password}: RegisterInput,
  ): Promise<User>{
    const hashedPassword = await bcrypt.hash(password, 12);

    const user = User.create({
      firstName,
      lastName,
      email,
      password: hashedPassword
    }).save();

    return user;
  }
}