
let id: any = 0;

export const setActiveFormStep = (value: any) => {
  console.log("VALUE IN SER",value);
  id = value;
}

export const getActiveFormStep = () => {
  return id;
}
