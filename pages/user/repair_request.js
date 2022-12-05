import React, { useRef, useState } from "react";
import { Alert, SectionLayout } from "../../components";
import { createRepairRequest } from "../../services/repair.services";
import { useAppContext } from "../../context/AppContext";
import { adminContact } from "../../services/config.services";

const RepairRequest = () => {
  const { state } = useAppContext();

  const concernRef = useRef();
  const [success, setSuccess] = useState(-1);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState();
  const clearForm = () => {
    concernRef.current.value = null;
  };
  const verifyHandler = () => {
    let tempErrors = {};
    if (!concernRef.current?.value) {
      tempErrors = {
        concernError: "Concern is required.",
      };
    }
    setErrors(tempErrors);
    const numberOfErrors = Object.keys(tempErrors);
    console.log(numberOfErrors);
    if (numberOfErrors.length > 0) {
      return false;
    }
    return true;
  };
  const sendHandler = async () => {
    setSuccess(-1);
    setIsLoading(true);
    const sentBy = ` / Requested By ${state?.user?.firstname} ${state?.user?.lastname} in unit ${state?.user?.unit}`;
    const newData = {
      message: concernRef.current?.value + sentBy,
      mobile_number: adminContact,
    };
    console.log(newData);
    if (verifyHandler()) {
      const res = await createRepairRequest(newData);
      if (res.success) {
        clearForm();
        setSuccess(5);
      } else {
        setSuccess(0);
      }
    }
    setIsLoading(false);
  };
  return (
    <div>
      <SectionLayout title="Repair Request">
        <div className="flex gap-4 flex-col">
          <Alert status={success} />
          {errors && (
            <span className="text-rose-500">{errors?.concernError}</span>
          )}
          <label className="text-lg" htmlFor="concern">
            Concern
          </label>
          <textarea
            ref={concernRef}
            defaultValue={concernRef.current?.value}
            required
            rows={10}
            id="concern"
            className="px-4 p-2 rounded-md border border-slate-200"
          ></textarea>
          {isLoading ? (
            <span className="text-center hover:border-zinc-400 border-2 border-white transition-all p-2 px-4 rounded-md bg-zinc-900 w-full text-white">
              Sending...
            </span>
          ) : (
            <button
              onClick={sendHandler}
              className=" hover:border-zinc-400 border-2 border-white transition-all p-2 px-4 rounded-md bg-zinc-900 w-full text-white"
            >
              Send
            </button>
          )}
        </div>
      </SectionLayout>
    </div>
  );
};

export default RepairRequest;
