import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { Layout } from "./components/layout/Layout";
import HomePage from "./routes/homepage/HomePage";
import AboutPage from "./routes/aboutPage/AboutPage"; // <-- IMPORTED
import ContactPage from "./routes/contactPage/ContactPage"; // <-- IMPORTED
// import PropertiesPage from "./routes/properties/PropertiesPage";
// import AgentsPage from "./routes/agents/AgentsPage";
import SinglePage from "./routes/singlepage/Singlepage";
import NewPostPage from "./routes/newpostpage/Newpostpage";
import ProfilePage from "./routes/profilePage/ProfilePage";
import LoginPage from "./routes/loginPage/LoginPage";
import RegisterPage from "./routes/registerPage/RegisterPage";
import ListPage from "./routes/listpage/Listpage";
import { profilePageLoader, singlePageLoader, listPageLoader } from "./lib/loaders";
import ProfileUpdatePage from "./routes/profileupdate/ProfileUpdatePage";
import { RequireAuth } from "./components/layout/Layout";

function App() {
  const router = createBrowserRouter([
    {
      path: "/",
      element: <Layout />,
      children: [
        {
          path: "/",
          element: <HomePage />,
        },
        {
          path: "/list",
          element: <ListPage />,
          loader: listPageLoader,
        },
        {
          path: "/login",
          element: <LoginPage />,
        },
        {
          path: "/register",
          element: <RegisterPage />,
        },
        {
          path: "/about",             // <--- ADDED
          element: <AboutPage />,
        },
        {
          path: "/contact",           // <--- ADDED
          element: <ContactPage />,
        },
        // {
        //   path: "/properties",
        //   element: <PropertiesPage />,
        // },
        // {
        //   path: "/agents",
        //   element: <AgentsPage />,
        // },
        {
          path: "/:id",
          element: <SinglePage />,
          loader: singlePageLoader,
        },
      ],
    },
    {
      path: "/",
      element: <RequireAuth />,
      children: [
        {
          path: "/profile",
          element: <ProfilePage />,
          loader: profilePageLoader,
        },
        {
          path: "/profile/update",
          element: <ProfileUpdatePage />,
        },
        {
          path: "/add",
          element: <NewPostPage />,
        },
      ],
    },
  ]);

  return <RouterProvider router={router} />;
}

export default App;
