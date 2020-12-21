let contact = {};
let organization = {};
let compliance: never[] = [];
let doYouHaveOtherOffice = true

export const setCompliance = (value: any) => {
  compliance = value;
}

export const getCompliance = () => {
  return compliance;
}

// function  will return arrray of ids
export const returnArray = (val: any) => {
  let valArray: any[] = [];
  val.map((item: any) => {
    valArray.push(parseInt(item.id));
  });
  return valArray;
}

export const setOtherOffice = (value: boolean) => {
  doYouHaveOtherOffice = value;
}

export const getOtherOffice = () => {
  return doYouHaveOtherOffice;
}