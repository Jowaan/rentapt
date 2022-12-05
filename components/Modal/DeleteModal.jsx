import React from "react";
import ModalLayout from "../Layout/ModalLayout";

const DeleteModal = ({ cancel, unit, handler }) => {
  return (
    <ModalLayout>
      <div className="flex flex-col gap-4">
        <p className="p-2 text-xl">
          Are you sure you want to delete unit{" "}
          <b className="capitalize">"{unit}"</b>?
        </p>
        <div className="flex gap-4 justify-end">
          <button
            className="p-2 px-4 rounded-md bg-blue-500 text-white"
            onClick={() => {
              handler();
              cancel(false);
            }}
          >
            Confirm
          </button>
          <button
            className="p-2 px-4 rounded-md bg-slate-500 text-white"
            onClick={() => cancel(false)}
          >
            Cancel
          </button>
        </div>
      </div>
    </ModalLayout>
  );
};

export default DeleteModal;
