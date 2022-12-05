import React, { useState, useEffect, useRef } from "react";
import {
  DeleteModal,
  SectionLayout,
  Alert,
  UpdateModal,
} from "../../components";
import { DeleteSvg, EditSvg } from "../../components/Svg";
import { deleteUser, getAllUsers } from "../../services/user.services";

const AccountMaintenance = () => {
  const [updateModal, setUpdateModal] = useState(false);
  const [deleteModal, setDeleteModal] = useState(false);
  const selectedRef = useRef();
  const [success, setSuccess] = useState(-1);
  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState([]);
  useEffect(() => {
    reloadData();
  }, []);
  const reloadData = () => {
    const load = async () => {
      setIsLoading(true);
      const res = await getAllUsers();
      if (res.success) {
        setData(res.data);
        // console.log(res.data);
      }
      setIsLoading(false);
    };
    load();
  };
  const cancelHandler = () => {
    reloadData();
    setUpdateModal(false);
  };
  const headers = [
    "unit",
    "availability",
    "fullname",
    "contact",
    "advance payment",
    "total deposit",
    "tenant balance",
  ];
  const moneySign = ["advance payment", "total deposit", "tenant balance"];
  const confirmHandler = async () => {
    const tenantId = data[selectedRef.current]?._id;
    const res = await deleteUser(tenantId);
    if (res.success) {
      let tmp = [];
      for (let i in data) {
        if (data[i]._id != tenantId) {
          tmp = [...tmp, data[i]];
        }
      }
      // console.log(tmp);
      setData(tmp);
      setSuccess(3);
    } else {
      setSuccess(0);
    }
  };
  return (
    <div>
      {updateModal && (
        <UpdateModal
          cancel={cancelHandler}
          data={data}
          unit={data[selectedRef?.current]}
        />
      )}
      {deleteModal && (
        <DeleteModal
          cancel={setDeleteModal}
          handler={confirmHandler}
          unit={data[selectedRef?.current].unit}
        />
      )}

      <SectionLayout title="Account Maintenance">
        <div className="mb-4">
          <Alert status={success} />
        </div>
        <table className="w-full">
          <thead>
            <tr className="bg-zinc-900 text-white">
              {headers.map((item, index) => (
                <td key={index} className="capitalize p-2 px-4 text-center">
                  {item}
                </td>
              ))}
              <td className="text-center">Edit</td>
              <td className="text-center">Delete</td>
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
                        i > 2 ? "text-right" : "text-center"
                      }`}
                    >
                      {keys == "fullname"
                        ? `${item.firstname} ${item.middlename} ${item.lastname}`
                        : keys == "contact"
                        ? `(+63)${item.contact}`
                        : moneySign.includes(keys)
                        ? `₱${item[keys.replace(" ", "")]}`
                        : item[keys.replace(" ", "")]}
                    </td>
                  ))}
                  <td className="text-center">
                    <button
                      onClick={() => {
                        selectedRef.current = index;
                        setUpdateModal(true);
                      }}
                      className="p-2 px-4 rounded-md  bg-blue-500 m-2"
                    >
                      <EditSvg />
                    </button>
                  </td>
                  <td className="text-center">
                    <button
                      onClick={() => {
                        selectedRef.current = index;
                        setDeleteModal(true);
                      }}
                      className="p-2 px-4 rounded-md  bg-rose-500 m-2"
                    >
                      <DeleteSvg />
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td className="border text-center" colSpan={9}>
                  {isLoading ? "Fetching Data Please Wait..." : "No Data"}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </SectionLayout>
    </div>
  );
};

export default AccountMaintenance;
