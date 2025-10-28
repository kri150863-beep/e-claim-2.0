import { inject } from "@angular/core";
import { CanActivateFn, Router } from "@angular/router";
import { AuthService } from "../services/auth.service";
import { UserRole } from "../../shared/constants/roles.const";

export const roleGuard: CanActivateFn = (route) => {
  const authService = inject(AuthService);
  const router = inject(Router);
  const user = authService.getCurrentUser();

  if (!user) {
    return router.createUrlTree(['/auth/login']);
  }

  const requiredRoles = route.data['roles'] as UserRole[];

  return requiredRoles.some(role => user.roles.includes(role))
    ? true
    : router.createUrlTree(['/unauthorized']);
};
