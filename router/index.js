import authRoutes from "../router/auth.router.js";
import userRoutes from "../router/user.router.js";
import interviewRoutes from "../router/interview.router.js";
import roundRoutes from "../router/round.router.js";

const versionOne = (routeName) => `/api/v1/${routeName}`;

export default (app) => {
  app.use(versionOne("auth"), authRoutes);
  app.use(versionOne("user"), userRoutes);
  app.use(versionOne("interview"), interviewRoutes);
  app.use(versionOne("round"), roundRoutes);
};
