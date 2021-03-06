import { MiddlewareFn } from "type-graphql";
import { MyContext } from "../../types/MyContext";

export const isAuth: MiddlewareFn<MyContext> = async ({ context }, next) => {
  //Check if userId has been stored. If it hasn't, then throw an exception.
  if(!context.req.session?.userId) {
    throw new Error('You are not authenticated');
  }

  // Otherwise, run the next code.
  return next();
};