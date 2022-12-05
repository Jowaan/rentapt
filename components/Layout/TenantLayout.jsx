import React, { useRef, useState, useEffect } from "react";
import { createUser, updateUser } from "../../services/user.services";
//firebase
import {
  ref,
  uploadBytes,
  getDownloadURL,
  deleteObject,
} from "firebase/storage";
import { v4 } from "uuid";
import { Alert } from "../../components";
import { storage } from "../../services/firebase";
import moment from "moment";
import { NotVisible, VisibleSvg } from "../Svg";
const TenantLayout = ({ modify, cancel, old }) => {
  console.log(old);
  useEffect(() => {
    if (modify) {
      setProfileUrlRef.current = old?.profile;
      setContractUrlRef.current = old?.contract;
      setValidIdUrlRef.current = old?.validid;
    }
  }, []);
  const [passwordToggle, setPasswordToggle] = useState(false);
  const [confirmPasswordToggle, setConfirmPasswordToggle] = useState(false);
  const [greenPassword, setGreenPassword] = useState(-1);
  const unitRef = useRef();
  const startrentRef = useRef();
  const lastNameRef = useRef(old?.lastname);
  const firstNameRef = useRef();
  const middleNameRef = useRef();
  const rentAmountRef = useRef();
  const contactRef = useRef();
  const depositRef = useRef();
  const advancePaymentRef = useRef();
  const usernameRef = useRef();
  const passwordRef = useRef();
  const confirmPasswordRef = useRef();

  const [errors, setErrors] = useState({});
  const [contractImage, setContractImage] = useState();
  const [validIdImage, setValidIdImage] = useState();
  const [isLoading, setIsLoading] = useState();
  const [success, setSuccess] = useState(-1);
  const setValidIdUrlRef = useRef();
  const setContractUrlRef = useRef();
  const setProfileUrlRef = useRef();
  const balanceRef = useRef();
  const availRef = useRef();

  const [profileImage, setProfileImage] = useState();
  // fix image
  const imageKeyRef = useRef([1, 2, 3]);
  const verifyHandler = () => {
    let tempErrors = {};
    if (
      unitRef.current?.value.length <= 0 ||
      unitRef.current?.value.length >= 16
    ) {
      tempErrors = {
        ...tempErrors,
        unitError:
          "is required and must be at least 1 characters. (Max length of 15 characters)",
      };
    }
    if (startrentRef.current?.value.length <= 0) {
      tempErrors = {
        ...tempErrors,
        startrentRef: "is required and must have a value.",
      };
    }
    if (
      lastNameRef.current?.value.length < 3 ||
      !/^[A-Za-z ]+$/.test(lastNameRef.current?.value) ||
      lastNameRef.current?.value.length >= 13
    ) {
      tempErrors = {
        ...tempErrors,
        lastNameError:
          "is required and must be at least 3 and letters only. (Max length of 12 letters)",
      };
    }
    if (
      firstNameRef.current?.value.length < 3 ||
      !/^[A-Za-z ]+$/.test(firstNameRef.current?.value) ||
      firstNameRef.current?.value.length >= 13
    ) {
      tempErrors = {
        ...tempErrors,
        firstNameError:
          "is required and must be at least 3 and letters only. (Max length of 12 letters)",
      };
    }
    if (
      middleNameRef.current?.value.length < 3 ||
      !/^[A-Za-z ]+$/.test(middleNameRef.current?.value) ||
      middleNameRef.current?.value.length >= 13
    ) {
      tempErrors = {
        ...tempErrors,
        middleNameError:
          "is required and must be at least 3 and letters only. (Max length of 12 letters)",
      };
    }

    if (rentAmountRef.current?.value <= 0) {
      tempErrors = {
        ...tempErrors,
        rentAmountError: "is required and must be at greater than 0.",
      };
    }
    if (contactRef.current?.value.length != 10) {
      tempErrors = {
        ...tempErrors,
        contactError: "is required and must be 10 digits.",
      };
    }
    if (depositRef.current?.value <= 0) {
      tempErrors = {
        ...tempErrors,
        depositError: "is required and must be greater than 0.",
      };
    }
    if (advancePaymentRef.current?.value <= 0) {
      tempErrors = {
        ...tempErrors,
        advancePaymentError: "is required and must be greater than 0.",
      };
    }
    if (usernameRef.current?.value.length < 5) {
      tempErrors = {
        ...tempErrors,
        usernameError: "is required and must be at least 5 characters.",
      };
    }
    if (passwordRef.current?.value.length < 8) {
      tempErrors = {
        ...tempErrors,
        passwordError: "is required and must be at least 8 characters.",
      };
    }
    if (passwordRef.current?.value != confirmPasswordRef.current?.value) {
      tempErrors = {
        ...tempErrors,
        confirmPasswordError: "is required and must be equal to Password.",
      };
    }
    if (modify) {
      if (balanceRef.current?.value < 0) {
        tempErrors = {
          ...tempErrors,
          balanceError: "is required and must be greater than or equal to 0.",
        };
      }
    }
    if (!setValidIdUrlRef.current) {
      if (validIdImage?.file.size > 3000000 || !validIdImage) {
        tempErrors = {
          ...tempErrors,
          validIdError: "is required and must be less than 3mb only.",
        };
      }
    }
    if (!setContractUrlRef.current) {
      if (contractImage?.file.size > 3000000 || !contractImage) {
        tempErrors = {
          ...tempErrors,
          contractError: "is required and must be less than 3mb only.",
        };
      }
    }
    if (!setProfileUrlRef.current) {
      if (profileImage?.file.size > 3000000 || !profileImage) {
        tempErrors = {
          ...tempErrors,
          profileError: "is required and must be less than 3mb only.",
        };
      }
    }
    setErrors(tempErrors);
    const numberOfErrors = Object.keys(tempErrors);
    console.log(numberOfErrors);
    if (numberOfErrors.length > 0) {
      return false;
    }
    return true;
  };
  const uploadValidId = () => {
    if (!validIdImage?.file) {
      if (modify) {
        uploadContract();
        return;
      } else {
        setIsLoading(false);
        return;
      }
    }
    if (modify) {
      deleteValidIdImage();
    }
    const imageRef = ref(storage, `images/${validIdImage.file.name + v4()}`);
    uploadBytes(imageRef, validIdImage.file)
      .then((snapshot) => {
        getDownloadURL(snapshot.ref).then((url) => {
          setValidIdUrlRef.current = url;
          uploadContract();
        });
      })
      .catch(() => {
        setIsLoading(false);
      });
  };
  const uploadContract = () => {
    console.log("Dito ka tingin", contractImage);
    if (!contractImage?.file || contractImage?.file == undefined) {
      if (modify) {
        uploadProfile();
        return;
      } else {
        setIsLoading(false);
        return;
      }
    }
    if (modify) {
      console.log("nadelet ba?");
      deleteContractImage();
    }
    const imageRef = ref(storage, `images/${contractImage.file.name + v4()}`);
    uploadBytes(imageRef, contractImage.file)
      .then((snapshot) => {
        getDownloadURL(snapshot.ref).then((url) => {
          setContractUrlRef.current = url;
          uploadProfile();
        });
      })
      .catch(() => {
        setIsLoading(false);
      });
  };
  const uploadProfile = () => {
    if (!profileImage?.file) {
      if (modify) {
        postSaveHandler();
        return;
      } else {
        setIsLoading(false);
        return;
      }
    }
    if (modify) {
      deleteProfileImage();
    }
    const imageRef = ref(storage, `images/${profileImage.file.name + v4()}`);
    uploadBytes(imageRef, profileImage.file)
      .then((snapshot) => {
        getDownloadURL(snapshot.ref).then((url) => {
          setProfileUrlRef.current = url;
          postSaveHandler();
        });
      })
      .catch(() => {
        setIsLoading(false);
      });
  };
  const deleteValidIdImage = () => {
    let pictureRef = ref(storage, setValidIdUrlRef.current);
    deleteObject(pictureRef)
      .then(() => {
        if (!modify) deleteContractImage();
        console.log("Passed 1");
      })
      .catch((error) => {
        console.log(error);
        if (!modify) deleteContractImage();
      });
  };
  const deleteContractImage = () => {
    let pictureRef = ref(storage, setContractUrlRef.current);
    deleteObject(pictureRef)
      .then(() => {
        if (!modify) deleteProfileImage();
        console.log("Passed 2");
      })
      .catch((error) => {
        console.log(error);
        if (!modify) deleteProfileImage();
      });
  };
  const deleteProfileImage = () => {
    let pictureRef = ref(storage, setProfileUrlRef.current);
    deleteObject(pictureRef)
      .then(() => {
        console.log("Passed 2");
      })
      .catch((error) => {
        console.log(error);
      });
  };
  const clearForm = () => {
    unitRef.current.value = null;
    startrentRef.current.value = "YYYY-MM-DD";
    lastNameRef.current.value = null;
    firstNameRef.current.value = null;
    middleNameRef.current.value = null;
    rentAmountRef.current.value = null;
    contactRef.current.value = null;
    depositRef.current.value = null;
    advancePaymentRef.current.value = null;
    usernameRef.current.value = null;
    passwordRef.current.value = null;
    setValidIdUrlRef.current = "";
    setContractUrlRef.current = "";
    setProfileUrlRef.current = "";
    setValidIdImage(null);
    setContractImage(null);
    setProfileImage(null);
  };
  const postSaveHandler = async () => {
    const newData = {
      lastname: lastNameRef.current.value,
      startofrent: startrentRef.current.value,
      firstname: firstNameRef.current.value,
      middlename: middleNameRef.current.value,
      rentamount: rentAmountRef.current.value,
      contact: contactRef.current.value,
      totaldeposit: depositRef.current.value,
      advancepayment: advancePaymentRef.current.value,
      username: usernameRef.current.value,
      password: passwordRef.current.value,
      validid: setValidIdUrlRef.current,
      contract: setContractUrlRef.current,
      profile: setProfileUrlRef.current,
    };
    if (!modify) {
      newData.unit = unitRef.current.value;
    } else {
      newData.availability = availRef.current.value;
      newData.tenantbalance = balanceRef.current.value * 1;
    }
    console.log(newData);
    let res = null;
    if (!modify) {
      res = await createUser(newData);
    } else {
      res = await updateUser(old?._id, newData);
    }
    console.log(res);
    if (res.success) {
      let ran1 = Math.random().toString(36);
      let ran2 = Math.random().toString(36);
      let ran3 = Math.random().toString(36);
      imageKeyRef.current = [ran1, ran2, ran3];
      console.log(imageKeyRef.current);
      if (!modify) {
        clearForm();
      }
      if (!modify) {
        setSuccess(1);
      } else {
        setSuccess(2);
      }
    } else {
      console.log(res.error);
      if (!modify) {
        deleteValidIdImage();
      }
      setErrors({ ...res.errors });
      setSuccess(0);
    }
    setIsLoading(false);
  };
  const saveHandler = () => {
    setSuccess(-1);
    setIsLoading(true);
    if (verifyHandler()) {
      uploadValidId();
      console.log("pwede");
    } else {
      setIsLoading(false);
    }
  };
  const fields = [
    {
      label: "Unit",
      ref: unitRef,
      type: modify ? "p" : "text",
      error: errors?.unitError,
      defaultValue: unitRef?.current?.value || old?.unit,
    },
    {
      label: "Rent Started",
      ref: startrentRef,
      type: "date",
      error: errors?.startrentRef,
      defaultValue: startrentRef.current?.value
        ? moment(startrentRef?.current?.value).format("YYYY-MM-DD")
        : old?.startofrent
        ? moment(old?.startofrent).format("yyyy-MM-DD")
        : "yyyy-mm-dd",
    },
    {
      label: "Last Name",
      ref: lastNameRef,
      type: "text",
      error: errors?.lastNameError,
      defaultValue: lastNameRef?.current?.value || old?.lastname,
    },
    {
      label: "First Name",
      ref: firstNameRef,
      type: "text",
      error: errors?.firstNameError,
      defaultValue: firstNameRef?.current?.value || old?.firstname,
    },
    {
      label: "Middle Name",
      ref: middleNameRef,
      type: "text",
      error: errors?.middleNameError,
      defaultValue: middleNameRef?.current?.value || old?.middlename,
    },
    {
      label: "Rent Amount",
      ref: rentAmountRef,
      type: "number",
      error: errors?.rentAmountError,
      defaultValue: rentAmountRef?.current?.value || old?.rentamount,
    },
    {
      label: "Contact (+63)",
      ref: contactRef,
      type: "number",
      error: errors?.contactError,
      defaultValue: contactRef?.current?.value || old?.contact,
    },
    {
      label: "Deposit",
      ref: depositRef,
      type: "number",
      error: errors?.depositError,
      defaultValue: depositRef?.current?.value || old?.totaldeposit,
    },
    {
      label: "Advance Payment",
      ref: advancePaymentRef,
      type: "number",
      error: errors?.advancePaymentError,
      defaultValue: advancePaymentRef?.current?.value || old?.advancepayment,
    },
    {
      label: "Username",
      ref: usernameRef,
      type: "text",
      error: errors?.usernameError,
      defaultValue: usernameRef?.current?.value || old?.username,
    },
    {
      label: "Password",
      ref: passwordRef,
      type: "password",
      error: errors?.passwordError,
      defaultValue: passwordRef?.current?.value || old?.password,
      toggle: passwordToggle,
      setToggle: () => setPasswordToggle(!passwordToggle),
    },
    {
      label: "Confirm Password",
      ref: confirmPasswordRef,
      type: "password",
      error: errors?.confirmPasswordError,
      defaultValue: confirmPasswordRef?.current?.value,
      toggle: confirmPasswordToggle,
      setToggle: () => setConfirmPasswordToggle(!confirmPasswordToggle),
      handler: () => {
        passwordRef.current?.value.length > 0
          ? passwordRef.current?.value == confirmPasswordRef.current?.value
            ? setGreenPassword(1)
            : setGreenPassword(0)
          : setGreenPassword(-1);
        console.log(
          passwordRef.current?.value == confirmPasswordRef.current?.value
        );
      },
    },
    {
      label: "Valid Id",
      type: "file",
      error: errors?.validIdError,
      changehandler: (e) => {
        try {
          setValidIdImage({
            url: URL?.createObjectURL(e.target?.files[0]),
            file: e.target?.files[0],
          });
        } catch (e) {
          console.log(e);
        }
      },
      preview: validIdImage?.url || old?.validid,
      key: imageKeyRef?.current[0],
    },
    {
      label: "Lease of Contract",
      type: "file",
      error: errors?.contractError,
      changehandler: (e) => {
        try {
          setContractImage({
            url: URL?.createObjectURL(e.target?.files[0]),
            file: e.target?.files[0],
          });
        } catch (e) {
          console.log(e);
        }
      },
      preview: contractImage?.url || old?.contract,
      key: imageKeyRef?.current[1],
    },
    {
      label: "Profile Picture",
      type: "file",
      error: errors?.profileError,
      changehandler: (e) => {
        try {
          setProfileImage({
            url: URL?.createObjectURL(e.target?.files[0]),
            file: e.target?.files[0],
          });
        } catch (e) {
          console.log(e);
        }
      },
      preview: profileImage?.url || old?.profile,
      key: imageKeyRef?.current[2],
    },
  ];
  return (
    <>
      {modify && <p className="text-2xl py-2">Update Tenant Information </p>}
      <Alert status={success} />
      <div className="grid grid-cols-1 mt-4 sm:grid-cols-2 gap-4">
        {modify && (
          <>
            <div className="flex flex-col justify-end">
              <label htmlFor="avail" className="text-lg">
                Availability
              </label>
              <select
                id="avail"
                ref={availRef}
                defaultValue={availRef.current?.value || old?.availability}
                className="px-4 p-2 rounded-md border border-slate-200"
              >
                <option value="vaccant">Vaccant</option>
                <option value="occupied">Occupied</option>
              </select>
            </div>
            <div className="flex flex-col justify-end">
              {errors?.balanceError && (
                <span className="text-rose-500">
                  Tenant Balance {errors?.balanceError}
                </span>
              )}
              <label htmlFor="balance" className="text-lg">
                Tenant Balance
              </label>
              <input
                defaultValue={old?.tenantbalance}
                id="balance"
                ref={balanceRef}
                type="number"
                className="px-4 p-2 rounded-md border border-slate-200"
              />
            </div>
          </>
        )}
        {fields.map(
          (
            {
              label,
              ref,
              type,
              error,
              changehandler,
              defaultValue,
              key,
              preview,
              setToggle,
              toggle,
              handler,
            },
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
                <>
                  <input
                    id={label.toLowerCase().replace(" ", "")}
                    type={type}
                    key={key}
                    className="px-4 p-2 rounded-md border border-slate-200"
                    onChange={changehandler}
                    accept="image/*"
                  />
                  {preview && (
                    <div className="mt-4">
                      <img
                        src={preview}
                        className="rounded-md max-h-96 aspect-video border object-contain w-full"
                      />
                    </div>
                  )}
                </>
              ) : type == "p" ? (
                <p className="cursor-not-allowed px-4 p-2 rounded-md border border-slate-200">
                  {defaultValue}
                </p>
              ) : (
                <div className="relative">
                  <input
                    defaultValue={defaultValue}
                    id={label.toLowerCase().replace(" ", "")}
                    ref={ref}
                    type={
                      type == "password" ? (toggle ? "text" : "password") : type
                    }
                    onChange={() => label == "Confirm Password" && handler()}
                    className={`${
                      label == "Confirm Password"
                        ? greenPassword == 1
                          ? "border-emerald-500"
                          : greenPassword == -1
                          ? "border-slate-200"
                          : greenPassword == 0 && "border-rose-500"
                        : "border-slate-200"
                    } w-full px-4 p-2 rounded-md border outline-0`}
                  />
                  {type == "password" && (
                    <button
                      onClick={setToggle}
                      className="absolute top-3 cursor-pointer right-5"
                    >
                      {toggle ? <VisibleSvg /> : <NotVisible />}
                    </button>
                  )}
                </div>
              )}
            </div>
          )
        )}
      </div>
      {!modify ? (
        <>
          {isLoading ? (
            <span className="block text-center mt-4 hover:border-zinc-400 border-2 border-white transition-all p-2 px-4 rounded-md bg-zinc-900 w-full text-white">
              Saving...
            </span>
          ) : (
            <button
              onClick={saveHandler}
              className=" mt-4 hover:border-zinc-400 border-2 border-white transition-all p-2 px-4 rounded-md bg-zinc-900 w-full text-white"
            >
              Save
            </button>
          )}
        </>
      ) : (
        <div className="flex gap-4 justify-end mt-4">
          {isLoading ? (
            <>
              <p className="p-2 px-4 rounded-md">Saving...</p>
            </>
          ) : (
            <>
              <button
                className="p-2 px-4 rounded-md bg-blue-500 text-white"
                onClick={saveHandler}
              >
                Confirm
              </button>
              <button
                className="p-2 px-4 rounded-md bg-slate-500 text-white"
                onClick={cancel}
              >
                Cancel
              </button>
            </>
          )}
        </div>
      )}
    </>
  );
};

export default TenantLayout;
