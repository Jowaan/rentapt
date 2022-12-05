import React, { useRef, useEffect, useState } from "react";
import { SectionLayout, Alert } from "../../components";
import { createRentalReminder } from "../../services/rental.services";
import { getAllUsers } from "../../services/user.services";
import moment from "moment";
const AccountNotification = () => {
  const [units, setUnits] = useState([]);
  const senderRef = useRef();
  const receiverRef = useRef();
  const amountRef = useRef();
  const dateRef = useRef();
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(-1);
  const [errors, setErrors] = useState();
  const [receiver, setReceiver] = useState();
  const verifyHandler = () => {
    let tempErrors = {};
    if (!dateRef.current?.value || amountRef.current?.value <= 0) {
      tempErrors = {
        ...tempErrors,
        messageError: "Please fill up the form!",
      };
    }
    if (!receiver?.rentamount) {
      tempErrors = {
        ...tempErrors,
        receiverError: "Please choose a tenant",
      };
    }
    setErrors(tempErrors);
    const numberOfErrors = Object.keys(tempErrors);
    // console.log(numberOfErrors);
    if (numberOfErrors.length > 0) {
      return false;
    }
    return true;
  };
  const sendHandler = async () => {
    setSuccess(-1);
    setIsLoading(true);
    if (verifyHandler()) {
      const newDate = moment(dateRef.current.value).format("MMM DD ,YYYY");
      const newData = {
        mobile_number: receiver?.contact,
        message: `Good day ${receiver?.firstname} ${receiver?.lastname}, This is a reminder your last payment is from ${newDate} with the current balance amount of PHP ${receiver.rentamount}. You may settle the payment through gcash or by visiting our office. Thank you, and have a nice day.`,
      };
      const res = await createRentalReminder(newData);
      if (res.success) {
        setSuccess(4);
      } else {
        setSuccess(0);
      }
      console.log(res);
      // console.log(newData);
    }
    setIsLoading(false);
  };
  useEffect(() => {
    const load = async () => {
      const res = await getAllUsers();
      if (res.data) {
        setUnits(res.data);
      }
    };
    load();
  }, []);
  return (
    <div>
      <SectionLayout title="Account Notification">
        <div className="flex flex-col gap-4">
          <Alert status={success} />
          <label className="font-lg" htmlFor="sender">
            Sender
          </label>
          <input
            ref={senderRef}
            id="sender"
            disabled
            value="Admin"
            type="text"
            className="px-4 p-2 rounded-md border border-slate-200"
          />
          {errors?.receiverError && (
            <span className="text-rose-500">{errors?.receiverError}</span>
          )}
          <label className="font-lg" htmlFor="receiver">
            Receiver
          </label>
          <select
            required
            ref={receiverRef}
            id="receiver"
            type="number"
            onChange={(e) => setReceiver(units[e.target.value])}
            className="px-4 p-2 rounded-md border border-slate-200"
          >
            <option>Choose a Tenant</option>
            {units.map(({ firstname, lastname, unit, middlename }, index) => (
              <option key={index} value={index}>
                {`${firstname} ${middlename} ${lastname} - UNIT ${unit}`}
              </option>
            ))}
          </select>
          {errors?.messageError && (
            <span className="text-rose-500">{errors?.messageError}</span>
          )}
          <label className="font-lg" htmlFor="message">
            Message
          </label>
          <div
            // ref={messageRef}
            // required
            // rows={10}
            id="message"
            className="px-4 p-2 rounded-md border border-slate-200"
          >
            <p>
              Good day {receiver?.firstname} {receiver?.lastname}
            </p>
            <br />
            <p className="indent-6">
              This is a reminder your last payment is from{" "}
              <input
                ref={dateRef}
                className="p-2 px-4 rounded-md border"
                type="date"
              />{" "}
              with the current balance amount of ₱ {receiver?.rentamount || 0}
              .<br /> You may settle the payment through gcash or by visiting
              our office. Thank you, and have a nice day.
            </p>
          </div>
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

export default AccountNotification;
