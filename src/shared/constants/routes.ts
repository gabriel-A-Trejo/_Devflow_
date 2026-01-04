const ROUTES = {
  HOME: "/",
  SIGNIN: "/sign-in",
  SIGNUP: "/sign-up",
  COMMUNITIES: "/community",
  COLLECTIONS: "/collection",
  JOBS: "/find-jobs",
  TAGS: "/tags",
  PROFILES: "/profile",
  ASK_QUESTION: "/ask-question",
  QUESTION: (id: string) => `/question/${id}`,
  TAG: (id: string) => `/tags/${id}`,
  PROFILE: (id: string) => `/profile/${id}`,
} as const;

export default ROUTES;
