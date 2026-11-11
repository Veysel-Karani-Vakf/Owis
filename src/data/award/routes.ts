/** Public routes of the Owais Volunteer Award 2026 section. */
export const awardRoutes = {
  landing: '/volunteer-award',
  eligibility: '/volunteer-award/eligibility',
  apply: '/volunteer-award/apply',
  success: '/volunteer-award/success',
} as const;

/** True for the award landing page and every page under it. */
export function isAwardRoute(pathname: string) {
  return pathname === awardRoutes.landing || pathname.startsWith(`${awardRoutes.landing}/`);
}
