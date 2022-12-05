import React from "react";

const Alert = ({ status }) => {
  const uiHandler = () => {
    switch (status) {
      case 0:
        return "Too sad something went wrong, Please try again later!";
      case 1:
        return "New tenant has been added!";
      case 2:
        return "Update Successfully!";
      case 3:
        return "Delete Successfully!";
      case 4:
        return "Message was sent to tenant successfully!";
      case 5:
        return "Hooray! It is now sent to landlord successfully!";
      case 6:
        return "Something went wrong, is seems the tenant data is already deleted";
      case 7:
        return "Request has been approved!";
      case 8:
        return "Request has been declined!";
      case 9:
        return "Payment cannot be approved because the tenant balance is already 0";
      case 10:
        return "Payment cannot be approved because the amount is not exact!";
      default:
        return false;
    }
  };
  return (
    <>
      {uiHandler() && (
        <p
          className={`px-4 p-2 ${
            ![0, 6, 9, 10].includes(status)
              ? "bg-blue-100 text-blue-500"
              : "bg-rose-100 text-rose-500"
          }`}
        >
          {uiHandler()}
        </p>
      )}
    </>
  );
};

export default Alert;
