import React, { useState } from "react";
import { RiErrorWarningLine } from "react-icons/ri";

const Disperse = () => {
  const [amountError, setAmountError] = useState("");
  const [duplicateError, setDuplicateError] = useState("");
  const [line, setLine] = useState("");
  const [duplicateLine, setDuplicateLine] = useState([]);
  const [bgColor, setBgColor] = useState(false);

  const [data, setData] = useState([
    {
      address: "0x2CB99F193549681e06C6770dDD5543812B4FaFE8",
      amount: 10,
    },
    {
      address: "0xEb0D38c92deB969b689acA94D962A07515CC5204",
      amount: 20,
    },
    {
      address: "0xF4aDE8368DDd835B70b625CF7E3E1Bc5791D18C1",
      amount: 40,
    },
    {
      address: "0x09ae5A64465c18718a46b3aD946270BD3E5e6aaB",
      amount: 4,
    },
    {
      address: "0x8B3392483BA26D65E331dB86D4F430E9B3814E5e",
      amount: 56,
    },
  ]);
  const onSubmit = () => {
    for (let i = 0; i < data.length; i++) {
      if (typeof data[i].amount !== "number") {
        setAmountError("wrong_amount");
        setLine(`Line ${i + 1} wrong amount`);
        break;
      }
    }

    const duplicateAddresses = [];
    for (let i = 0; i < data.length; i++) {
      for (let j = i + 1; j < data.length; j++) {
        if (data[i].address === data[j].address) {
          setDuplicateError("duplicate_address");
          duplicateAddresses.push(
            `Address ${data[i].address} encountered duplicate in Line: ${
              i + 1
            }, ${j + 1}`
          );
          setDuplicateLine(duplicateAddresses);
        }
      }
    }
  };

  const keepfirstOne = () => {
    const firstAddress = {};
    data.filter((item) => {
      if (firstAddress[item.address]) {
        return false;
      } else {
        firstAddress[item.address] = item.amount;
        return true;
      }
    });
    const filterFirstData = Object.keys(firstAddress).map((address) => ({
      address,
      amount: firstAddress[address],
    }));

    setData(filterFirstData);
    setAmountError("");
    setDuplicateError("");
    setDuplicateLine([]);
  };
  const combineBalance = () => {
    const combinedData = {};

    data.forEach((item) => {
      const { address, amount } = item;
      if (!combinedData[address]) {
        combinedData[address] = amount;
      } else {
        combinedData[address] += amount;
      }
    });

    const combinedDataArray = Object.keys(combinedData).map((address) => ({
      address,
      amount: combinedData[address],
    }));

    setData(combinedDataArray);
    setAmountError("");
    setDuplicateError("");
    setDuplicateLine([]);
    setBgColor(true);
  };
  return (
    <div className="px-[2px]">
      <div className="text-custom-grey-text pl-[5px] my-[15px]">
        Addresses with Amounts
      </div>
      <div className="bg-custom-blue pl-[20px] pt-[20px] pb-[100px] rounded-[12px]">
        {data.map((item, index) => {
          return (
            <div className="flex flex-row" key={index}>
              <div className="text-custom-grey-index bg-custom-bg-grey border-r-2 border-r-custom-grey-border w-[30px] pr-[2px] text-right">
                {index + 1}
              </div>
              <div className="break-all font-bold pl-[2px]">
                {item.address} {item.amount}
              </div>
            </div>
          );
        })}
      </div>
      <div className="text-custom-grey-text pl-[5px] mt-[10px]">
        Seperated by ',' or ' ' or '='
      </div>
      {amountError === "wrong_amount" && (
        <div className="w-full flex flex-row h-[50px] items-center border-[1px] border-custom-red text-custom-red mt-[30px] rounded-[5px]">
          <RiErrorWarningLine size={25} className="ml-[10px] mr-[50px]" />
          {line}
        </div>
      )}
      {duplicateError === "duplicate_address" &&
        amountError !== "wrong_amount" && (
          <div>
            <div className="flex flex-row text-custom-red justify-between px-[10px] mt-[30px] pb-[5px]">
              <div>Duplicated</div>
              <div className="flex flex-row">
                <button onClick={keepfirstOne}>Keep the first one</button>
                <div className="mx-[20px]">|</div>
                <button onClick={combineBalance}>Combine Balance</button>
              </div>
            </div>
            <div className="flex flex-row border-[1px] border-custom-red text-custom-red py-[5px] rounded-[5px]">
              <RiErrorWarningLine size={25} className="ml-[10px] mr-[50px]" />
              <div>
                {duplicateLine.map((item, index) => {
                  return <div key={index}>{item}</div>;
                })}
              </div>
            </div>
          </div>
        )}
      <div>
        <button
          className={`w-full ${
            bgColor ? "bg-custom-purple" : "bg-custom-darkBlue"
          } h-[70px] text-white mt-[35px] rounded-[5px]`}
          onClick={onSubmit}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default Disperse;
