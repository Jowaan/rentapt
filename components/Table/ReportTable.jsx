import React, { useState, useRef, useEffect } from "react";
import { getRentalBill } from "../../services/rental.services";
import { getRepairBill } from "../../services/repair.services";
import { getAllUsers } from "../../services/user.services";
import { getUtilityBill } from "../../services/utility.services";
import moment from "moment";
import { DropletSvg, ThunderSvg, XSvg } from "../../components/Svg";
import ModalLayout from "../Layout/ModalLayout";
const ReportTable = ({ tab }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState();
  const [units, setUnits] = useState();
  const totalRef = useRef(0);
  const [imageModal, setImageModal] = useState(null);
  const [receiver, setReceiver] = useState();
  const [from, setFrom] = useState();
  const [to, setTo] = useState();
  const [typeofutility, setTypeofutility] = useState("Electrical");

  useEffect(() => {
    reload();
    setIsLoading(true);
  }, [tab, from, to, typeofutility, receiver]);
  const reload = () => {
    const load = async () => {
      switch (tab) {
        case 0:
          fetchRental();
          break;
        case 1:
          fetchRepair();
          break;
        case 2:
          fetchUtility();
          break;
      }
      const res = await getAllUsers();
      if (res.success) {
        setUnits(res.data);
      }
      setIsLoading(false);
    };
    load();
    setData([]);
  };
  const fetchRental = async () => {
    const newData = {
      from,
      to,
      unit: receiver?.unit,
    };

    const res = await getRentalBill(newData);
    if (res.success) {
      setData(res.data);
    }
  };
  const fetchRepair = async () => {
    const newData = {
      from,
      to,
      unit: receiver?.unit,
    };

    const res = await getRepairBill(newData);
    if (res.success) {
      setData(res.data);
    }
  };
  const fetchUtility = async () => {
    const newData = {
      unit: receiver?.unit,
      typeofutility,
    };
    const res = await getUtilityBill(newData);
    if (res.success) {
      setData(res.data);
    }
  };
  const headers = [
    [
      "unit",
      "payment mode",
      "payment date",
      "month coverage",
      "amount",
      "rent started",
      "proof of payment",
    ],
    [
      "unit",
      "payment mode",
      "payment date",
      "description",
      "amount",
      "proof of payment",
    ],
    ["date of payment", "date of coverage", "proof of payment"],
  ];
  return (
    <div className="flex gap-4 mt-4 flex-col">
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
      {tab != 2 && <p className="text-xl">Search History Date</p>}
      <div className="flex gap-4">
        {tab != 2 && (
          <>
            <div className="w-full flex flex-col">
              <label htmlFor="from">From</label>
              <input
                type="date"
                id="from"
                onChange={(e) => {
                  setFrom(e.target.value);
                }}
                value={from ? moment(from).format("YYYY-MM-DD") : "yyyy-MM-DD"}
                className="px-4 p-2 rounded-md border border-slate-200"
              />
            </div>
            <div className="w-full flex flex-col">
              <label htmlFor="to">To</label>
              <input
                type="date"
                id="to"
                // value={to && to}
                onChange={(e) => {
                  setTo(e.target.value);
                }}
                value={to ? moment(to).format("YYYY-MM-DD") : "yyyy-MM-DD"}
                className="px-4 p-2 rounded-md border border-slate-200"
              />
            </div>
          </>
        )}
        <div className="w-full flex flex-col">
          <label htmlFor="unit">Unit</label>
          <select
            id="unit"
            onChange={(e) => setReceiver(units[e.target.value])}
            className="px-4 p-2 rounded-md border border-slate-200"
          >
            <option>Choose a Tenant</option>
            {units?.map(({ firstname, lastname, unit, middlename }, index) => (
              <option key={index} value={index}>
                {`${firstname} ${middlename} ${lastname} - UNIT ${unit}`}
              </option>
            ))}
          </select>
        </div>
      </div>
      {tab == 2 && (
        <>
          <p className="text-xl">Tenant Name: {receiver?.firstname}</p>
          <div className="flex flex-row gap-4">
            <div
              onClick={() => {
                // reload();
                setTypeofutility("Electrical");
              }}
              className={`${
                typeofutility == "Electrical" && "border-zinc-500 "
              } flex flex-row gap-4 items-center cursor-pointer border-2 border-white p-4 rounded-md bg-yellow-500 text-lg text-white`}
            >
              <ThunderSvg />
              Electrical
            </div>
            <div
              onClick={() => {
                // reload();
                setTypeofutility("Water");
              }}
              className={`${
                typeofutility == "Water" && "border-zinc-500 "
              } flex flex-row gap-4 items-center cursor-pointer border-2 border-white p-4 rounded-md bg-blue-500 text-lg text-white`}
            >
              <DropletSvg />
              Water
            </div>
          </div>
        </>
      )}
      <table className="w-full">
        <thead>
          <tr className="bg-zinc-900 text-white text-center">
            {headers[tab].map((item, index) => (
              <td key={index} className="capitalize p-2 px-4">
                {item}
              </td>
            ))}
          </tr>
        </thead>
        <tbody>
          {data?.length > 0 ? (
            data?.map((item, index) => (
              <tr key={index} className="border">
                {headers[tab]?.map((keys, i) => (
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
      {tab != 2 && (
        <>
          {totalRef.current > 0 && (
            <>
              <p>Total: {totalRef.current}</p>
              <button className=" hover:border-zinc-400 border-2 border-white transition-all p-2 px-4 rounded-md bg-zinc-900 w-full text-white">
                Print
              </button>
            </>
          )}
        </>
      )}
    </div>
  );
};

export default ReportTable;
