import React, { useRef, useState } from "react";
import { useRouter } from "next/router";
import { authLogin } from "../../services/user.services";
import FooterLayout from "./FooterLayout";
import { NotVisible, VisibleSvg } from "../Svg";
const AuthLayout = ({ role }) => {
  const [passwordToggle, setPasswordToggle] = useState(false);
  const usernameRef = useRef();
  const passwordRef = useRef();
  const router = useRouter();
  const [errors, setErrors] = useState();
  const [isLoading, setIsLoading] = useState();
  const loginHandler = async () => {
    setIsLoading(true);
    setErrors(null);
    const newData = {
      username: usernameRef.current?.value || "",
      password: passwordRef.current?.value || "",
    };
    if (role == "admin") {
      router.push("/admin/tenant_account");
      return;
    }
    const { success, errors, data } = await authLogin(newData);
    if (success) {
      router.push("/user/rental_payment");
    } else {
      console.log(errors);
      setErrors(errors);
      setIsLoading(false);
    }
  };
  return (
    <>
      <div className="flex items-center justify-center min-h-screen px-8 ">
        <div className="z-10 bg-white rounded-md p-8 flex-col gap-4 flex sm:w-96 w-72 ">
          <img src="logo.png" className="w-full object-cover" />
          {errors?.usernameError && (
            <span className="text-center text-rose-500 bg-rose-100 p-2 px-4 rounded-md">
              {errors?.usernameError}
            </span>
          )}
          <label htmlFor="username" className="font-lg">
            Username
          </label>
          <input
            ref={usernameRef}
            className="p-2 px-4 rounded-md border border-slate-200"
            id="username"
            type="text"
            placeholder="John Doe"
          />
          {errors?.passwordError && (
            <span className="text-center text-rose-500 px-4 p-2 bg-rose-100 rounded-md">
              {errors?.passwordError}
            </span>
          )}
          <label className="font-lg">Password</label>
          <div className="relative">
            <input
              htmlFor="password"
              ref={passwordRef}
              className="p-2 px-4 rounded-md border w-full border-slate-200"
              id="password"
              type={passwordToggle ? "text" : "password"}
              placeholder="Password"
            />
            <button
              onClick={() => setPasswordToggle(!passwordToggle)}
              className="absolute top-2 cursor-pointer right-3"
            >
              {passwordToggle ? <VisibleSvg /> : <NotVisible />}
            </button>
          </div>
          {!isLoading ? (
            <button
              onClick={loginHandler}
              className=" hover:border-zinc-400 border-2 border-white transition-all p-2 px-4 rounded-md bg-zinc-900 w-full text-white"
            >
              Login
            </button>
          ) : (
            <span className="text-center hover:border-zinc-400 border-2 border-white transition-all p-2 px-4 rounded-md bg-zinc-900 w-full text-white">
              Logging In...
            </span>
          )}
        </div>
      </div>
      <FooterLayout />
      <img
        src="/bg.jpg"
        className="-z-10 object-cover fixed top-0 left-0 w-screen h-screen"
      />
    </>
  );
};

export default AuthLayout;
