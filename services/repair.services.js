export const createRepairBill = async (newData) => {
  const res = await fetch("/api/repair", {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify(newData),
  });
  const result = await res.json();
  return result;
};

export const getRepairBill = async (newData) => {
  const res = await fetch("/api/repair/history", {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify(newData),
  });
  const result = await res.json();
  return result;
};

export const createRepairRequest = async (newData) => {
  const res = await fetch("/api/repair/sms", {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify(newData),
  });
  const result = await res.json();
  return result;
};
