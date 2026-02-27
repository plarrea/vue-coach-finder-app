import { createRouter, createWebHistory } from "vue-router";

import CoachesList from "./pages/coaches/CoachesList.vue";
import CoachDetails from "./pages/coaches/CoachDetails.vue";
import ContactCoach from "./pages/requests/ContactCoach.vue";
import CoachRegistration from "./pages/coaches/CoachRegistration.vue";
import RequestsReceived from "./pages/requests/RequestsReceived.vue";
import NotFound from "./pages/NotFound.vue";

const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: "/", redirect: "/coaches" },
    { path: "/coaches", component: CoachesList },
    {
      props: true,
      path: "/coaches/:id",
      component: CoachDetails,
      children: [{ path: "contact", component: ContactCoach }], // /coaches/:id/contact
    },
    { path: "/register", component: CoachRegistration },
    { path: "/requests", component: RequestsReceived },
    { path: "/:notFound(.*)", component: NotFound },
  ],
});

export default router;
