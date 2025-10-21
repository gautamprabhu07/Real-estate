import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Layout from "./components/layout/Layout";
import HomePage from "./routes/homepage/HomePage";
// Import other pages as needed
// import PropertiesPage from "./routes/properties/PropertiesPage";
// import AboutPage from "./routes/about/AboutPage";
// import ContactPage from "./routes/contact/ContactPage";
// import AgentsPage from "./routes/agents/AgentsPage";
import ProfilePage from "./routes/profilePage/ProfilePage";
import LoginPage from "./routes/loginPage/LoginPage";
import RegisterPage from "./routes/registerPage/RegisterPage";

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
        // Add these routes as you create the components
        // {
        //   path: "/properties",
        //   element: <PropertiesPage />,
        // },
        // {
        //   path: "/about",
        //   element: <AboutPage />,
        // },
        // {
        //   path: "/contact",
        //   element: <ContactPage />,
        // },
        // {
        //   path: "/agents",
        //   element: <AgentsPage />,
        // },
        {
          path: "/login",
          element: <LoginPage />,
        },
        {
          path: "/register",
          element: <RegisterPage />,
        },
        {
          path: "/profile",
          element: <ProfilePage/>,
        },
      ],
    },
  ]);

  return <RouterProvider router={router} />;
}

export default App;