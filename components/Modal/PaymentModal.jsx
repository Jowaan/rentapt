import React, { useState } from "react";
import ModalLayout from "../Layout/ModalLayout";

const PaymentModal = ({ close }) => {
  const [mode, setMode] = useState("gcash");
  const modearr = ["/gcash.jpg", "/paymaya.jpg"];
  return (
    <ModalLayout image={true}>
      <div className="flex gap-4 flex-col">
        <img
          src={mode == "gcash" ? modearr[0] : modearr[1]}
          className="w-80 aspect-reverse object-cover object-top"
        />
        <div className="flex gap-4 ">
          <button
            className="w-full p-4 bg-blue-500 text-white rounded-md "
            onClick={() => setMode("gcash")}
          >
            Gcash
          </button>
          <button
            className="p-4 w-full bg-emerald-500 text-white rounded-md "
            onClick={() => setMode("paymaya")}
          >
            Paymaya
          </button>
        </div>
        <button
          onClick={() => close(false)}
          className="w-full p-2 px-4 rounded-md bg-zinc-900 text-white"
        >
          Close
        </button>
      </div>
    </ModalLayout>
  );
};

export default PaymentModal;
