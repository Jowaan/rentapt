import React from "react";

import ModalLayout from "../Layout/ModalLayout";
import TenantLayout from "../Layout/TenantLayout";

const UpdateModal = ({ cancel, unit }) => {
  return (
    <ModalLayout image={true}>
      <TenantLayout modify={true} cancel={cancel} old={unit} />
    </ModalLayout>
  );
};

export default UpdateModal;
