import React from "react";
import Head from "next/head";
const HeaderLayout = ({ title }) => {
  return (
    <Head>
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link
        rel="preconnect"
        href="https://fonts.gstatic.com"
        crossOrigin="true"
      />
      <link
        href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700;800&display=swap"
        rel="stylesheet"
      />
      <title>{title} | RentApt</title>
    </Head>
  );
};

export default HeaderLayout;
