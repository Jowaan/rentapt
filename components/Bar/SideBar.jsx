import Link from "next/link";
import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/router";
import { useAppContext } from "../../context/AppContext";
import { authLogout, getUser } from "../../services/user.services";
import {
  ReportSvg,
  BellSvg,
  CalendarSvg,
  HomeSvg,
  MaintenanceSvg,
  MoneySvg,
  RequestSvg,
  UserSvg,
  LogoutSvg,
} from "../Svg";

const SideBar = () => {
  const { state, dispatch } = useAppContext();
  const router = useRouter();
  const [pageData, setPageData] = useState();
  const roleRef = useRef();
  const mounted = useRef();
  useEffect(() => {
    const role = router.pathname.split("/")[1];
    roleRef.current = role;
    const final = async () => {
      const { success, data } = await getUser();
      if (success) {
        dispatch({ type: "AUTH_USER", value: data });
      } else {
        router.push("/");
      }
    };
    if (!state?.user && role == "user") {
      final();
    }

    const load = () => {
      setPageData({
        pathname: router.pathname.split("/")[2],
        links: role == "admin" ? adminLinks : userLinks,
      });
      mounted.current = true;
    };

    if (!mounted.current) {
      load();
    }
  });

  const adminLinks = [
    {
      name: "Tenant Registration",
      link: "/admin/tenant_account",
      icon: <UserSvg />,
    },
    {
      name: "Account Maintenance",
      link: "/admin/account_maintenance",
      icon: <MaintenanceSvg />,
    },
    {
      name: "Rental Payment Request",
      link: "/admin/rental_payment_request",
      icon: <HomeSvg />,
    },
    {
      name: "Account Notification",
      link: "/admin/account_notification",
      icon: <BellSvg />,
    },
    {
      name: "Summary Report",
      link: "/admin/summary_report",
      icon: <CalendarSvg />,
    },
  ];
  const userLinks = [
    {
      name: "Rental Payment",
      link: "/user/rental_payment",
      icon: <HomeSvg />,
    },
    {
      name: "Repair Request",
      link: "/user/repair_request",
      icon: <RequestSvg />,
    },
    {
      name: "Repair Payment",
      link: "/user/repair_payment",
      icon: <MoneySvg />,
    },
    {
      name: "Utility Record",
      link: "/user/utility_record",
      icon: <ReportSvg />,
    },
  ];

  const signOutHandler = async () => {
    const role = router.pathname.split("/")[1];
    if (role != "admin") {
      const { success } = await authLogout();
      if (success) {
        dispatch({ type: "UPDATE_USER", value: null });
      }
    } else {
      router.push("/admin");
    }
  };
  return (
    <div className="self-start min-w-sidebar top-0 left-0 sticky max-h-sidebar min-h-screen py-4  overflow-y-auto scroll-smooth bg-zinc-900 flex flex-col lg:max-w-xs max-w-min justify-between">
      <div className="flex items-center justify-center flex-col">
        <img src="/logo.png" className="w-full aspect-video object-contain" />
      </div>
      <div>
        {state?.user && (
          <div className="flex items-center gap-4 flex-col p-8 mb-4">
            <img
              src={state?.user.profile}
              className="w-52 border-4 rounded-md object-cover object-top aspect-square "
            />
            <p className="text-white">Tenant Name:</p>
            <p className="text-white">
              {state?.user.firstname} {state?.user.lastname}
            </p>
          </div>
        )}
        {pageData &&
          pageData.links.map(({ name, link, icon }, index) => (
            <Link href={link} key={index}>
              {/* <div className="flex items-center "> */}
              <p
                className={`${
                  pageData.pathname == link.split("/")[2] && "bg-zinc-500 "
                } flex flex-row gap-4 p-4 md:text-left text-center sm:px-4 px-2 text-white hover:bg-zinc-800 sm:text-lg text-sm cursor-pointer transition-colors`}
              >
                <span>{icon}</span>
                {name}
              </p>
              {/* </div> */}
            </Link>
          ))}
      </div>
      <button
        onClick={signOutHandler}
        className="flex flex-row items-center justify-center gap-4 text-white sm:text-lg text-sm font-semibold text-center p-4 transition-colors hover:bg-zinc-900"
      >
        <span>
          <LogoutSvg />
        </span>
        Sign Out
      </button>
    </div>
  );
};

export default SideBar;
