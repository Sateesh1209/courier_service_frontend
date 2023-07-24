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
  getObjectById = (name, objFor) => {
    let itemObj = null;
    if (objFor == "street") {
      FairCalculatorService.TOTAL_STREETS.map((item) => {
        if (item.streetKey == name) {
          itemObj = item;
        }
      });
    } else {
      FairCalculatorService.TOTAL_AVENUES.map((item) => {
        if (item.avenueKey == name) {
          itemObj = item;
        }
      });
    }
    return itemObj;
  };
  capitalCase(str) {
    return str
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(" ");
  }
}
export default new CommonServices();
