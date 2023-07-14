import FairCalculatorService from "./FairCalculatorService";

class CommonServices {
  getObjectByName = (name, objFor) => {
    let itemObj = null;
    if (objFor == "street") {
      FairCalculatorService.TOTAL_STREETS.map((item) => {
        if (item.streetName == name) {
          itemObj = item;
        }
      });
    } else {
      FairCalculatorService.TOTAL_AVENUES.map((item) => {
        if (item.avenueName == name) {
          itemObj = item;
        }
      });
    }
    return itemObj;
  };
}
export default new CommonServices();
