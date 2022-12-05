import React, { useRef, useState } from "react";
import { Alert, SectionLayout } from "../../components";
import { createRepairBill } from "../../services/repair.services";
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

const RepairPayment = () => {
  const { state } = useAppContext();

  const amountRef = useRef();
  const paymentRef = useRef();
  const descriptionRef = useRef();
  const [proofImage, setProofImage] = useState();

  const [isLoading, setIsLoading] = useState();
  const [errors, setErrors] = useState();
  const [success, setSuccess] = useState(-1);
  const setProofUrlRef = useRef();

  const imageKeyRef = useRef([0]);
  const clearForm = () => {
    amountRef.current.value = null;
    paymentRef.current.value = null;
    descriptionRef.current.value = null;
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
      amount: amountRef.current.value,
      paymentdate: paymentRef.current.value,
      description: descriptionRef.current.value,
      proofofpayment: setProofUrlRef.current,
    };
    console.log(newData);
    const res = await createRepairBill(newData);
    if (res.success) {
      let ran1 = Math.random().toString(36);
      imageKeyRef.current = [ran1];
      clearForm();
      setSuccess(5);
    } else {
      deleteProof();
      console.log(res.errors);
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
    if (amountRef.current?.value <= 0) {
      tempErrors = {
        ...tempErrors,
        amountError: "is required and must be greater than 0.",
      };
    }
    if (paymentRef.current?.value.length <= 0) {
      tempErrors = {
        ...tempErrors,
        paymentError: "is required.",
      };
    }
    if (descriptionRef.current?.value.length < 1) {
      tempErrors = {
        ...tempErrors,
        descriptionError: "is required.",
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
      label: "Amount",
      ref: amountRef,
      type: "number",
      error: errors?.amountError,
      defaultValue: amountRef.current?.value,
    },
    {
      label: "Date of Payment",
      ref: paymentRef,
      type: "date",
      error: errors?.paymentError,
      defaultValue: paymentRef.current?.value,
    },
    {
      label: "Repair Description",
      ref: descriptionRef,
      type: "textarea",
      error: errors?.descriptionError,
      defaultValue: descriptionRef.current?.value,
    },
    {
      label: "Proof of Payment",
      type: "file",
      error: errors?.proofError,
      value: proofImage,
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
      <SectionLayout title="Repair Payment">
        <div className="flex flex-col gap-4">
          <Alert status={success} />
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
                ) : type == "textarea" ? (
                  <textarea
                    rows={5}
                    defaultValue={defaultValue}
                    id={label.toLowerCase().replace(" ", "")}
                    ref={ref}
                    className="px-4 p-2 rounded-md border border-slate-200"
                  ></textarea>
                ) : (
                  <input
                    id={label.toLowerCase().replace(" ", "")}
                    defaultValue={defaultValue}
                    ref={ref}
                    type={type}
                    className="px-4 p-2 rounded-md border border-slate-200"
                  />
                )}
              </div>
            )
          )}
          {isLoading ? (
            <span className="text-center hover:border-zinc-400 border-2 border-white transition-all p-2 px-4 rounded-md bg-zinc-900 w-full text-white">
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

export default RepairPayment;
