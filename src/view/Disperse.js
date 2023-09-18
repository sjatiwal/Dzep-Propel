import React, { useState, useEffect,useRef } from "react";
import { RiErrorWarningLine } from "react-icons/ri";


const Disperse = () => {
  const [amountError, setAmountError] = useState("");
  const [duplicateError, setDuplicateError] = useState("");
  const [line, setLine] = useState("");
  const [duplicateLine, setDuplicateLine] = useState([]);
  const [bgColor, setBgColor] = useState(false);
  const [addressIndex,setAddressIndex]=useState([0])
  const [textareaValue, setTextareaValue] = useState("");
  const [openInput,setOpenInput]=useState(false)
  const [data, setData] = useState([]);

// check errors
  useEffect(()=>{ 
   for (let i = 0; i < data.length; i++) {
    const parsedAmount = parseInt(data[i].amount, 10);
    if (isNaN(parsedAmount)) {
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
  },[data])

// To adjust line no. after keeping firstaddress or combining them 
 useEffect(()=>{
     const lineData = textareaValue.split("\n")
      setAddressIndex([...Array(lineData.length).keys()]);
 },[textareaValue])

// on submit
  const onSubmit = () => {
    setData([])
    const lineData = textareaValue.split("\n")
    const addressAmountData= lineData.map((item)=>{return item.split("=")})
    setAddressIndex([...Array(lineData.length).keys()]);

    const maindata =[]
   
    for(let i=0;i<addressAmountData.length;i++){
       const subdata={}
      subdata.address = addressAmountData[i][0];
      subdata.amount = addressAmountData[i][1];
      maindata.push(subdata);
    }
   
    setData(maindata)

  };

  const convertDuplicatedDataToTextarea = (data) => {
    return data.map((item) => `${item.address}=${item.amount}`).join("\n");
  };


// To keep First address, amount pair
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
    const updatedTextareaValue = convertDuplicatedDataToTextarea(filterFirstData);
    setData(filterFirstData);
    setTextareaValue(updatedTextareaValue)
    setAmountError("");
    setDuplicateError("");
    setDuplicateLine([]);
  };

  const combineBalance = () => {
    const combinedData = {};
   
    data.forEach((item) => {
      const { address, amount } = item;
      const combineAmount = parseInt(amount,10)
      if (!combinedData[address]) {
        combinedData[address] = combineAmount;
      } else {
        combinedData[address] += combineAmount;
      }
    });

// To combine amount with same address
 const combinedDataArray = Object.keys(combinedData).map((address) => ({
      address,
      amount: combinedData[address],
    }));
    const updatedTextareaValue = convertDuplicatedDataToTextarea(combinedDataArray);
    setData(combinedDataArray);
    setTextareaValue(updatedTextareaValue)
    setAmountError("");
    setDuplicateError("");
    setDuplicateLine([]);
    setBgColor(true);
  };

  const handleTextareaChange = (event) => {
    setTextareaValue(event.target.value); 
  };
  const handleKeyDown = (event) => {
    const lineData = textareaValue.split("\n")
    if (event.key === "Enter") {
      setAddressIndex([...Array(lineData.length+1).keys()]);
    }
  };

//synchronousScroll of address,amount and line number
  const [div1ScrollTop, setDiv1ScrollTop] = useState(0);
  const [div2ScrollTop, setDiv2ScrollTop] = useState(0);
  const div1Ref = useRef(null);
  const div2Ref = useRef(null);
  
  const handleDiv1Scroll = (event) => {
    setDiv1ScrollTop(event.target.scrollTop);
  };

  const handleDiv2Scroll = (event) => {
    setDiv2ScrollTop(event.target.scrollTop);
  };
  useEffect(() => {
    if (div2Ref.current) {
      div2Ref.current.scrollTop = div1ScrollTop;
       }
}, [div1ScrollTop]);

useEffect(()=>{

if(div1Ref.current){
  div1Ref.current.scrollTop = div1ScrollTop
  setDiv1ScrollTop(div2ScrollTop);
}},[div2ScrollTop]) 

  return (
    <div className="px-[2px]" onClick={()=>setOpenInput(false)}>
      <div className="mt-[20px] pl-[5px]">Token Address</div>
      <div className="relative" onClick={(e)=>{e.stopPropagation();setOpenInput(!openInput)}}><input className="border-[1px] border-black w-full pl-[5px] mt-[5px] h-[50px] bg-custom-blue" placeholder="Select or search by address"/>
      {openInput&&<div className="absolute bg-custom-blue text-custom-grey-index w-full h-[50px] pl-[5px] flex justify-center items-center">No Data</div>}
      </div>
      
      <div className="text-custom-grey-text pl-[5px] mt-[20px] my-[15px]">
        Addresses with Amounts
      </div>
      <div className="relative bg-custom-blue p-[16px] rounded-[12px] overflow-scroll">
        <div className="relative h-[200px]">
          <div  ref={div1Ref}  onScroll={handleDiv1Scroll} style={{ scrollbarWidth: 0 }}  className="absolute  text-custom-grey-index bg-custom-bg-grey border-r-2 border-r-custom-grey-border h-[200px] w-[30px] overflow-hidden pr-[2px] text-right">
           {addressIndex.map((lineNumber)=>{return <div key={lineNumber}>{lineNumber+1}</div>})}
           </div> 
           <div>
           <textarea  ref={div2Ref}  onScroll={handleDiv2Scroll} className="bg-custom-bg-grey focus:outline-none caret-transparent w-full ml-[30px] break-all font-bold pl-[2px] h-[200px]" type="text-area"  
           value={textareaValue} 
           onChange={handleTextareaChange} 
           onKeyDown={handleKeyDown}  />
           </div>
           </div>
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
