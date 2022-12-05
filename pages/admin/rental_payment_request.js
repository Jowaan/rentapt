import React, { useState, useRef, useEffect } from "react";
import {
  getRentalRequest,
  updateRentalStatus,
} from "../../services/rental.services";
import moment from "moment";
import { Alert, ModalLayout, SectionLayout } from "../../components";
import { CheckSvg, DeclineSvg } from "../../components/Svg";
import { getTenant, updateUser } from "../../services/user.services";

const RentalPayment = () => {
  const [imageModal, setImageModal] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(-1);
  const [error, setError] = useState(null);
  const [data, setData] = useState();
  const [action, setAction] = useState({ data: null, mode: null });
  useEffect(() => {
    setIsLoading(true);
    fetchRental();
  }, []);
  const headers = [
    "unit",
    "payment date",
    "month coverage",
    "amount",
    "rent started",
    "proof of payment",
  ];
  const fetchRental = async () => {
    const res = await getRentalRequest();
    if (res.success) {
      setData(res.data);
    }
    setIsLoading(false);
  };
  const declinedHandler = async () => {
    setSuccess(-1);
    setIsLoading(true);
    setAction({ data: null, mode: null });
    const res = await updateRentalStatus(action.data._id, {
      status: action.mode + "d",
    });
    if (res.success) {
      await fetchRental();
      setSuccess(8);
    } else {
      setSuccess(6);
    }
    setIsLoading(false);
  };
  const approvedHandler = async () => {
    setSuccess(-1);
    setIsLoading(true);
    setAction({ data: null, mode: null });
    console.log(action.data.tenantid);
    // setError("The amount balance is less than");
    const res1 = await getTenant(action.data.tenantid);
    if (res1.success) {
      if (res1.data.tenantbalance == 0) {
        setSuccess(9);
        return;
      }
      let balance = res1.data.tenantbalance - action.data.amount;
      if (balance < 0) {
        setSuccess(10);
        return;
      }
      const newData = {
        tenantbalance: balance,
      };
      const res2 = await updateUser(action.data.tenantid, newData);
      if (res2.success) {
        const res = await updateRentalStatus(action.data._id, {
          status: action.mode + "d",
        });
        if (res.success) {
          await fetchRental();
          setSuccess(7);
        } else {
          setSuccess(6);
        }
      } else {
        setSuccess(6);
      }
    } else {
      setSuccess(6);
    }
    setIsLoading(false);
  };
  return (
    <div>
      <SectionLayout title="Rental Payment Request">
        {action.mode && (
          <ModalLayout image={true}>
            <div className="flex gap-4 flex-col">
              <p className="text-lg">
                Are you sure you want to {action.mode} this request
              </p>
              <div className="flex items-center justify-end gap-4">
                <button
                  onClick={() =>
                    action.mode != "decline"
                      ? approvedHandler()
                      : declinedHandler()
                  }
                  className="px-4 p-2 rounded-md bg-blue-500 text-white"
                >
                  Confirm
                </button>
                <button
                  onClick={() => setAction({ data: null, mode: null })}
                  className="px-4 p-2 rounded-md bg-slate-500 text-white"
                >
                  Cancel
                </button>
              </div>
            </div>
          </ModalLayout>
        )}
        {imageModal && (
          <ModalLayout image={true}>
            {/* <div className="w-full h-full"> */}
            <img src={imageModal} className="h-full w-full" />
            <button
              onClick={() => setImageModal(null)}
              className="w-full rounded-md px-4 p-2 mt-4  bg-zinc-900 text-white"
            >
              Close
            </button>
            {/* </div> */}
          </ModalLayout>
        )}
        <Alert status={success} />

        <table className="w-full mt-4">
          <thead>
            <tr className="bg-zinc-900 text-white text-center">
              {headers.map((item, index) => (
                <td key={index} className="capitalize p-2 px-4">
                  {item}
                </td>
              ))}
              <td className="text-center">Decline</td>
              <td className="text-center">Approve</td>
            </tr>
          </thead>
          <tbody>
            {data?.length > 0 ? (
              data?.map((item, index) => (
                <tr key={index} className="border">
                  {headers?.map((keys, i) => (
                    <td
                      key={i}
                      className={`capitalize p-2 px-4 ${
                        keys == "amount" ? "text-right" : "text-center"
                      }`}
                    >
                      {keys == "payment date" ||
                      keys == "rent started" ||
                      keys == "month coverage" ||
                      keys == "date of payment" ||
                      keys == "date of coverage" ? (
                        `${moment(item[keys.replaceAll(" ", "")]).format(
                          "MMM DD, YYYY"
                        )}`
                      ) : keys == "proof of payment" ? (
                        <button
                          className="p-2 px-4 rounded-md bg-violet-500 text-white"
                          onClick={() => setImageModal(item["proofofpayment"])}
                        >
                          Preview
                        </button>
                      ) : keys == "amount" ? (
                        `₱${parseInt(item[keys.replaceAll(" ", "")]) * 1}`
                      ) : (
                        item[keys.replaceAll(" ", "")]
                      )}
                    </td>
                  ))}
                  <td className="text-center">
                    <button
                      onClick={() =>
                        setAction({ data: data[index], mode: "decline" })
                      }
                      className="p-2 px-4 rounded-md  bg-rose-500 m-2"
                    >
                      <DeclineSvg />
                    </button>
                  </td>
                  <td className="text-center">
                    <button
                      onClick={() =>
                        setAction({ data: data[index], mode: "approve" })
                      }
                      className="p-2 px-4 rounded-md  bg-blue-500 m-2"
                    >
                      <CheckSvg />
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td className="border text-center" colSpan={9}>
                  {isLoading ? "Fetching Data..." : "No data"}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </SectionLayout>
    </div>
  );
};

export default RentalPayment;
