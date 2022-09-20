import { Routes, Route, Navigate, useLocation } from "react-router-dom";

import "./App.css";

//pages
import Home from "./pages/Home";
import SignIn from "./pages/SignIn";
import SignUp from "./pages/SignUp";
import PageNotFound from "./pages/PageNotFound";
import Profile from "./pages/Profile";
import DetailResep from "./pages/DetailRecipes";
import MyRecipe from "./pages/MyRecipes";
import SearchRecipes from "./pages/SearchRecipes";

//component
import Footer from "./component/footer";
import Navbar from "./component/navbar";

import ScrollToTop from "./component/ScrollToTop";
import RequireAuth from "./component/RequireAuth";

//modules
import { ToastContainer } from "react-toastify";

function App() {
  let location = useLocation();
  return (
    <>
      <ScrollToTop>
        {location.pathname === "/sign-in" ||
          location.pathname === "/sign-up" ? null : (
          <Navbar />
        )}

        <Routes>
          <Route path="/" element={<Navigate to="/home" replace="true" />} />
          <Route path="/home" element={<Home />} />

          <Route path="*" element={<PageNotFound />} />

          <Route path="/sign-up" element={<SignUp />} />
          <Route path="/sign-in" element={<SignIn />} />

          <Route
            path="/profile"
            element={
              <RequireAuth>
                {" "}
                <Profile />{" "}
              </RequireAuth>
            }
          />
          <Route
            path="/profile/my-recipes"
            element={
              <RequireAuth>
                {" "}
                <MyRecipe />{" "}
              </RequireAuth>
            }
          />

          <Route path="/recipes" element={<SearchRecipes />} />

          <Route path="/recipes/:id" element={<DetailResep />} />
        </Routes>

        <ToastContainer />
        {
          location.pathname === "/sign-in" ||
            location.pathname === "/sign-up" ? null : (
            <Footer />
          )}
      </ScrollToTop>
    </>
  );
}

export default App;
