import React, { useState } from "react";
import { ReportTable, SectionLayout } from "../../components";
import { CogSvg, HomeSvg, ReportSvg } from "../../components/Svg";

const SummaryReport = () => {
  const [tab, setTab] = useState(0);
  const tabArr = ["rental", "repair", "utility record"];
  const tabIcon = [<HomeSvg />, <CogSvg />, <ReportSvg />];
  return (
    <div>
      <SectionLayout title="Summary Report">
        <div className="flex gap-4 ">
          {tabArr.map((item, index) => (
            <button
              onClick={() => setTab(index)}
              className={`flex flex-row items-center gap-4 p-4 px-4 rounded-md capitalize ${
                index == tab
                  ? "text-white bg-zinc-900 "
                  : "text-white bg-zinc-500"
              } `}
              key={index}
            >
              <span>{tabIcon[index]}</span>
              {item}
            </button>
          ))}
        </div>
        <ReportTable tab={tab} />
      </SectionLayout>
    </div>
  );
};

export default SummaryReport;
