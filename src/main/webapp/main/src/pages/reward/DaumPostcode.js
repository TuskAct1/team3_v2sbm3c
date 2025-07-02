import React from "react";
import DaumPostcodeEmbed from "react-daum-postcode";

const DaumPostcode = ({ onComplete }) => {
  const handleComplete = (data) => {
    const fullAddress = data.address;
    const extraAddress = data.buildingName ? ` (${data.buildingName})` : "";
    onComplete({
      zonecode: data.zonecode,
      address: fullAddress + extraAddress,
    });
  };

  return (
    <div>
      <DaumPostcodeEmbed onComplete={handleComplete} />
    </div>
  );
};

export default DaumPostcode;
