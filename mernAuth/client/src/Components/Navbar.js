import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { isAuth, signout } from "./Helpers";

export const Navbar = () => {
  let location = useLocation();
  const isActive = (path) => {
    if (location.pathname === path) {
      return "red";
    } else {
      return "black";
    }
  };
  const navigate = useNavigate();
  return (
    <>
      <nav className="navbar navbar-expand-lg navbar-light bg-light ">
        <div className="container-fluid">
          <Link
            className="navbar-brand"
            to="/"
            style={{ color: isActive("/") }}
          >
            MERN-AUTH
          </Link>
          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarSupportedContent"
            aria-controls="navbarSupportedContent"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navbarSupportedContent">
            <ul className="navbar-nav ms-auto mb-2 mb-lg-0 ">
              <li className="nav-item">
                <Link
                  className="nav-link active"
                  style={{ color: isActive("/") }}
                  aria-current="page"
                  to="/"
                >
                  Home
                </Link>
              </li>

              {!isAuth() && (
                <>
                  <li className="nav-item">
                    <Link
                      className="nav-link"
                      style={{ color: isActive("/signup") }}
                      to="/signup"
                    >
                      Signup
                    </Link>
                  </li>
                  <li className="nav-item">
                    <Link
                      className="nav-link"
                      style={{ color: isActive("/signin") }}
                      to="/signin"
                    >
                      Signin
                    </Link>
                  </li>
                </>
              )}
              {isAuth() && (
                <li className="nav-item">
                  <Link
                    className="nav-link"
                    to="/private"
                    style={{ color: isActive("/private") }}
                  >
                    {isAuth().name}
                  </Link>
                </li>
              )}
              {isAuth() && (
                <li className="nav-item">
                  <span
                    className="nav-link"
                    onClick={() => {
                      signout(() => {
                        navigate("/");
                      });
                    }}
                    style={{ color: isActive("/signin"), cursor: "pointer" }}
                    to="/signin"
                  >
                    Signout
                  </span>
                </li>
              )}
            </ul>
          </div>
        </div>
      </nav>
    </>
  );
};
