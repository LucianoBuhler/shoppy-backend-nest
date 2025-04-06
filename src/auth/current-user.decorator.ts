import { createParamDecorator, ExecutionContext } from '@nestjs/common';

const getCurrentUserByContext = (context: ExecutionContext) => {
  return context.switchToHttp().getRequest().user;
};
// This function extracts the user from the request object in the context of an HTTP request.
// It uses the ExecutionContext to switch to the HTTP context and then retrieves the request object.
// The user is then extracted from the request object and returned.
// This is useful for getting the authenticated user in a controller method.
// The decorator can be used in a controller method to easily access the current user.

export const CurrentUser = createParamDecorator(
  (_data: unknown, context: ExecutionContext) => getCurrentUserByContext(context)
);