const ROUTES = {
  HOME: "/",
  SIGNIN: "/sign-in",
  SIGNUP: "/sign-up",
  COMMUNITIES: "/community",
  COLLECTIONS: "/collection",
  JOBS: "/jobs",
  TAGS: "/tags",
  PROFILES: "/profile",
  ASK_QUESTION: "/ask-question",
  QUESTION: (id: string) => `/questions/${id}`,
  EDITQUESTION: (id: string) => `/questions/${id}/edit`,
  TAG: (id: string) => `/tags/${id}`,
  PROFILE: (id: string) => `/profile/${id}`,
  EDITPROFILE: `/profile/edit`,
} as const;

export default ROUTES;
