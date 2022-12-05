import React, { useRef, useState } from "react";
import { Alert, SectionLayout } from "../../components";
import { createUtilityBill } from "../../services/utility.services";
import { useAppContext } from "../../context/AppContext";
//firebase
import {
  ref,
  uploadBytes,
  getDownloadURL,
  deleteObject,
} from "firebase/storage";
import { v4 } from "uuid";
import { storage } from "../../services/firebase";

const UtilityRecord = () => {
  const { state } = useAppContext();

  const paymentRef = useRef();
  const coverageRef = useRef();
  const [proofImage, setProofImage] = useState();
  const [type, setType] = useState("Electrical");
  const setProofUrlRef = useRef();
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState();
  const [success, setSuccess] = useState(-1);
  const imageKeyRef = useRef([1]);
  // console.log(state?.user);
  const clearForm = () => {
    paymentRef.current.value = null;
    coverageRef.current.value = null;
    setProofUrlRef.current = null;
    setProofImage(null);
  };
  const deleteProof = () => {
    let pictureRef = ref(storage, setProofUrlRef.current);
    deleteObject(pictureRef)
      .then(() => {
        console.log("Passed 1");
      })
      .catch((error) => {
        console.log(error);
      });
  };
  const postSaveHandler = async () => {
    const newData = {
      unit: state?.user?.unit,
      dateofpayment: paymentRef.current.value,
      dateofcoverage: coverageRef.current.value,
      proofofpayment: setProofUrlRef.current,
      typeofutility: type,
    };
    console.log(newData);
    const res = await createUtilityBill(newData);
    if (res.success) {
      let ran1 = Math.random().toString(36);
      imageKeyRef.current = [ran1];
      clearForm();
      setSuccess(5);
    } else {
      console.log(res.errors);
      deleteProof();
      setSuccess(0);
    }
    setIsLoading(false);
  };
  const uploadProof = () => {
    if (proofImage?.file == null) {
      setIsLoading(false);
      return;
    }
    const imageRef = ref(storage, `images/${proofImage.file.name + v4()}`);
    uploadBytes(imageRef, proofImage.file)
      .then((snapshot) => {
        getDownloadURL(snapshot.ref).then((url) => {
          setProofUrlRef.current = url;
          postSaveHandler();
        });
      })
      .catch(() => {
        setIsLoading(false);
      });
  };
  const verifyHandler = () => {
    let tempErrors = {};
    if (!paymentRef.current?.value) {
      tempErrors = {
        ...tempErrors,
        paymentError: "is required.",
      };
    }
    if (!coverageRef.current?.value) {
      tempErrors = {
        ...tempErrors,
        coverageError: "is required.",
      };
    }
    if (proofImage?.file.size > 3000000 || !proofImage) {
      tempErrors = {
        ...tempErrors,
        proofError: "is required and must be less than 3mb only.",
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
  const saveHandler = () => {
    setSuccess(-1);
    setIsLoading(true);
    if (verifyHandler()) {
      uploadProof();
      console.log("pwede");
    } else {
      setIsLoading(false);
    }
  };
  const fields = [
    {
      label: "Date of Payment",
      ref: paymentRef,
      type: "date",
      error: errors?.paymentError,
      defaultValue: paymentRef.current?.value,
    },
    {
      label: "Date of Coverage",
      ref: coverageRef,
      type: "date",
      error: errors?.coverageError,
      defaultValue: coverageRef.current?.value,
    },
    {
      label: "Proof of Payment",
      type: "file",
      error: errors?.proofError,
      changehandler: (e) => {
        try {
          setProofImage({
            url: URL?.createObjectURL(e.target?.files[0]),
            file: e.target?.files[0],
          });
        } catch (e) {
          console.log(e);
        }
      },
      key: imageKeyRef?.current[0],
    },
  ];
  return (
    <div>
      <SectionLayout title="Utility Record">
        <div className="flex flex-col gap-4">
          <Alert status={success} />
          <label className="font-lg" htmlFor="payment_date">
            Type of Utility
          </label>
          <div className="flex gap-4">
            <div>
              <input
                onClick={() => setType("Electrical")}
                type="radio"
                id="electrical"
                name="utility"
                defaultChecked
              />
              <label htmlFor="electrical"> Electrical</label>
            </div>
            <div>
              <input
                onClick={() => setType("Water")}
                type="radio"
                id="water"
                name="utility"
              />
              <label htmlFor="water"> Water</label>
            </div>
          </div>
          {fields.map(
            (
              { label, ref, type, error, changehandler, defaultValue, key },
              index
            ) => (
              <div key={index} className="flex flex-col justify-end">
                {error && (
                  <span className="text-rose-500">
                    {label} {error}
                  </span>
                )}
                <label
                  htmlFor={label.toLowerCase().replace(" ", "")}
                  className="text-lg"
                >
                  {label}
                </label>
                {type == "file" ? (
                  <input
                    key={key}
                    id={label.toLowerCase().replace(" ", "")}
                    type={type}
                    className="px-4 p-2 rounded-md border border-slate-200"
                    onChange={changehandler}
                    accept="image/*"
                  />
                ) : (
                  <input
                    defaultValue={defaultValue}
                    id={label.toLowerCase().replace(" ", "")}
                    ref={ref}
                    type={type}
                    className="px-4 p-2 rounded-md border border-slate-200"
                  />
                )}
              </div>
            )
          )}
          {isLoading ? (
            <span className=" hover:border-zinc-400 border-2 text-center border-white transition-all p-2 px-4 rounded-md bg-zinc-900 w-full text-white">
              Saving...
            </span>
          ) : (
            <button
              onClick={saveHandler}
              className=" hover:border-zinc-400 border-2 border-white transition-all p-2 px-4 rounded-md bg-zinc-900 w-full text-white"
            >
              Save
            </button>
          )}
        </div>
      </SectionLayout>
    </div>
  );
};

export default UtilityRecord;
