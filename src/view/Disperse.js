import React, { useState, useEffect,useRef } from "react";
import { RiErrorWarningLine } from "react-icons/ri";
import debounce from "lodash/debounce"; 


const Disperse = () => {
  const [amountError, setAmountError] = useState("");
  const [duplicateError, setDuplicateError] = useState("");
  const [line, setLine] = useState("");
  const [duplicateLine, setDuplicateLine] = useState([]);
  const [bgColor, setBgColor] = useState(false);
  const [addressIndex,setAddressIndex]=useState([0])
  const [textareaValue, setTextareaValue] = useState("");
  const [success,setSuccess]=useState(false)
  const [data, setData] = useState([]);

// check errors
  useEffect(()=>{ 
 
    let isAmountErrorSet = false;
    let isDuplicateErrorSet = false;

   for (let i = 0; i < data.length; i++) {
  
   const regex= /[^0-9.]/;
   const parsedAmount = regex.test(data[i].amount)
    
    if (parsedAmount) {
      setAmountError("wrong_amount");
      setLine(`Line ${i + 1} wrong amount`);
      isAmountErrorSet = true;
      break;
    }
    if(!parsedAmount && data[i].amount<0){
      setAmountError("wrong_amount");
      setLine(`Line ${i + 1} wrong amount`);
      isAmountErrorSet = true;
      break;
    }
    if(!parsedAmount && data[i].amount>=0 && i===data.length-1){
    setAmountError("")
    }
  }

  const duplicateAddresses = [];
  const duplicateIndices = {};
    for (let i = 0; i < data.length-1; i++) {
      for (let j = i + 1; j < data.length; j++) {
        if (data[i].address === data[j].address) {
          const address = data[i].address;
          if (!duplicateIndices[address]) {
            duplicateIndices[address] = [i + 1];
          }
          if(duplicateIndices[address] && !duplicateIndices[address].includes(j+1)){
            duplicateIndices[address].push(j + 1);
          }
        }
      }
    }
  
  
  for (const address in duplicateIndices) {
    if (duplicateIndices[address].length > 1) {
 
      setDuplicateError("duplicate_address");
      duplicateAddresses.push(
        `Address ${address} encountered duplicate in Line: ${duplicateIndices[address].join(', ')}`
      );
      isDuplicateErrorSet = true;
    }
  }
  setDuplicateLine(duplicateAddresses);

  if (data.length>0 && !isAmountErrorSet && !isDuplicateErrorSet) {
  setSuccess(true)
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
    setAmountError("");
    setDuplicateError("");
    setDuplicateLine([]);
    setSuccess(false);
    const lineData = textareaValue.split("\n")
    const addressAmountData= lineData.map((item)=>{return item.split(/[ ,=]+/)})
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
    setSuccess(true)
  };


// To combine amount with same address
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
    setSuccess(true)
  };

// Success alert
useEffect(()=>{
  if(success){

  setTimeout(() => {
    alert("Success")
  }, 10);
    
  }
},[success])

// On text change
  const handleTextareaChange = (event) => {
    setTextareaValue(event.target.value); 
  };

// on Press Enter 
  const handleKeyDown = (event) => {
    const lineData = textareaValue.split("\n")
    if (event.key === "Enter") {
      setAddressIndex([...Array(lineData.length+1).keys()]);
    }
  };

//synchronousScroll of address,amount and line number
  const div1Ref = useRef(null);
  const div2Ref = useRef(null);
  const [scrollPosition, setScrollPosition] = useState(0);

  const debouncedSetScrollPosition = useRef(
    debounce((position) => {
      setScrollPosition(position);
    }, 0) 
  ).current;

  const handleDiv1Scroll = (event) => {
    debouncedSetScrollPosition(event.target.scrollTop);
  };

  const handleDiv2Scroll = (event) => {
    debouncedSetScrollPosition(event.target.scrollTop);
  };
  
  useEffect(() => {
    if (div1Ref.current) {
      div1Ref.current.scrollTop = scrollPosition;
    }
    if (div2Ref.current) {
      div2Ref.current.scrollTop = scrollPosition;
    }
  }, [scrollPosition]);


  return (
    <div className="px-[2px]"> 
      <div className="text-custom-grey-text pl-[5px] mt-[20px] my-[15px]">
        Addresses with Amounts
      </div>
      <div className="relative bg-custom-blue p-[16px] rounded-[12px] overflow-scroll">
        <div className="relative h-[200px]">
          <div  ref={div1Ref}  onScroll={handleDiv1Scroll} style={{ scrollbarWidth: 0 }}  className="absolute leading-[20px]  text-custom-grey-index bg-custom-bg-grey border-r-2 border-r-custom-grey-border h-[200px] w-[30px] overflow-hidden pr-[2px] text-right">
           {addressIndex.map((lineNumber)=>{return <div key={lineNumber}>{lineNumber+1}</div>})}
           </div> 
           <div>
           <textarea  ref={div2Ref}  onScroll={handleDiv2Scroll} className="bg-custom-bg-grey  leading-[20px] focus:outline-none w-full ml-[30px] break-all font-bold pl-[2px] h-[200px]" type="text-area"  
           value={textareaValue} 
           onChange={handleTextareaChange} 
           onKeyDown={handleKeyDown} 
           spellCheck="false" />
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
