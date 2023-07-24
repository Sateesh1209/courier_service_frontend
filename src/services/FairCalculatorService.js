import pQueue from "./PriorityQueue";

class FairCalculator {
  ROUTE_MAP = {
    a1sA: {
      a2sA: 1,
    },
    a1sB: {
      a1sA: 1,
    },
    a1sC: {
      a1sB: 1,
      a2sC: 1,
    },
    a1sD: {
      a1sC: 1,
      a2sD: 1,
    },
    a1sE: {
      a1sD: 1,
      a2sE: 1,
    },
    a1sF: {
      a1sE: 1,
    },
    a1sG: {
      a1sF: 1,
      a2sG: 1,
    },
    a2sA: {
      a3sA: 1,
      a2sB: 1,
    },
    a2sB: {
      a1sB: 1,
      a2sA: 1,
      a2sC: 1,
    },
    a2sC: {
      a2sB: 1,
      a2sD: 1,
      a3sC: 1,
    },
    a2sD: {
      a1sD: 1,
      a2sC: 1,
      a2sE: 1,
      a3sD: 1,
    },
    a2sE: {
      a2sD: 1,
      a2sF: 1,
      a3sE: 1,
    },
    a2sF: {
      a1sF: 1,
      a2sE: 1,
      a2sG: 1,
    },
    a2sG: {
      a2sF: 1,
      a3sG: 1,
    },
    a3sA: {
      a4sA: 1,
    },
    a3sB: {
      a2sB: 1,
      a3sA: 1,
    },
    a3sC: {
      a3sB: 1,
      a4sC: 1,
    },
    a3sD: {
      a2sD: 1,
      a3sC: 1,
      a4sD: 1,
    },
    a3sE: {
      a3sD: 1,
      a4sE: 1,
    },
    a3sF: {
      a2sF: 1,
      a3sE: 1,
    },
    a3sG: {
      a3sF: 1,
      a4sG: 1,
    },
    a4sA: {
      a4sB: 1,
      a5sA: 1,
    },
    a4sB: {
      a3sB: 1,
      a4sC: 1,
    },
    a4sC: {
      a4sD: 1,
      a5sC: 1,
    },
    a4sD: {
      a3sD: 1,
      a4sE: 1,
      a5sD: 1,
    },
    a4sE: {
      a4sF: 1,
      a5sE: 1,
    },
    a4sF: {
      a3sF: 1,
      a4sG: 1,
    },
    a4sG: {
      a5sG: 1,
    },
    a5sA: {
      a6sA: 1,
    },
    a5sB: {
      a4sB: 1,
      a5sA: 1,
    },
    a5sC: {
      a5sB: 1,
      a6sC: 1,
    },
    a5sD: {
      a4sD: 1,
      a5sC: 1,
      a6sD: 1,
    },
    a5sE: {
      a5sD: 1,
      a6sE: 1,
    },
    a5sF: {
      a4sF: 1,
      a5sE: 1,
    },
    a5sG: {
      a5sF: 1,
      a6sG: 1,
    },
    a6sA: {
      a6sB: 1,
      a7sA: 1,
    },
    a6sB: {
      a5sB: 1,
      a6sA: 1,
      a6sC: 1,
    },
    a6sC: {
      a6sB: 1,
      a6sD: 1,
      a7sC: 1,
    },
    a6sD: {
      a5sD: 1,
      a6sC: 1,
      a6sE: 1,
      a7sD: 1,
    },
    a6sE: {
      a6sD: 1,
      a6sF: 1,
      a7sE: 1,
    },
    a6sF: {
      a5sF: 1,
      a6sE: 1,
      a6sG: 1,
    },
    a6sG: {
      a6sF: 1,
      a7sG: 1,
    },
    a7sA: {},
    a7sB: {
      a6sB: 1,
      a7sA: 1,
    },
    a7sC: {
      a7sB: 1,
    },
    a7sD: {
      a6sD: 1,
      a7sC: 1,
    },
    a7sE: {
      a7sD: 1,
    },
    a7sF: {
      a6sF: 1,
      a7sE: 1,
    },
    a7sG: {
      a7sF: 1,
    },
  };
  BLOCKS = [
    {
      id: "r1c1",
      topRoutes: ["a1sA", "a1sB"],
      rightRoutes: ["a1sB", "a2sB"],
      bottomRoutes: ["a2sA", "a2sB"],
      leftRoutes: ["a1sA", "a2sA"],
      label: "Block 1",
    },
    {
      id: "r1c2",
      topRoutes: ["a1sB", "a1sC"],
      rightRoutes: ["a1sC", "a2sC"],
      bottomRoutes: ["a2sB", "a2sC"],
      leftRoutes: ["a1sB", "a2sB"],
      label: "Block 2",
    },
    {
      id: "r1c3",
      topRoutes: ["a1sC", "a1sD"],
      rightRoutes: ["a1sD", "a2sD"],
      bottomRoutes: ["a2sC", "a2sD"],
      leftRoutes: ["a1sC", "a2sC"],
      label: "Block 3",
    },
    {
      id: "r1c4",
      topRoutes: ["a1sD", "a1sE"],
      rightRoutes: ["a1sE", "a2sE"],
      bottomRoutes: ["a2sD", "a2sE"],
      leftRoutes: ["a1sD", "a2sD"],
      label: "Block 4",
    },
    {
      id: "r1c5",
      topRoutes: ["a1sE", "a1sF"],
      rightRoutes: ["a1sF", "a2sF"],
      bottomRoutes: ["a2sE", "a2sF"],
      leftRoutes: ["a1sE", "a2sE"],
      label: "Block 5",
    },
    {
      id: "r1c6",
      topRoutes: ["a1sF", "a1sG"],
      rightRoutes: ["a1sG", "a2sG"],
      bottomRoutes: ["a2sF", "a2sG"],
      leftRoutes: ["a1sF", "a2sF"],
      label: "Block 6",
    },
    {
      id: "r2c1",
      topRoutes: ["a2sA", "a2sB"],
      rightRoutes: ["a2sB", "a3sB"],
      bottomRoutes: ["a3sA", "a3sB"],
      leftRoutes: ["a2sA", "a3sA"],
      label: "Block 7",
    },
    {
      id: "r2c2",
      topRoutes: ["a2sB", "a2sC"],
      rightRoutes: ["a2sC", "a3sC"],
      bottomRoutes: ["a3sB", "a3sC"],
      leftRoutes: ["a2sB", "a3sB"],
      label: "Block 8",
    },
    {
      id: "r2c3",
      topRoutes: ["a2sC", "a2sD"],
      rightRoutes: ["a2sD", "a3sD"],
      bottomRoutes: ["a3sC", "a3sD"],
      leftRoutes: ["a2sC", "a3sC"],
      label: "Block 9",
    },
    {
      id: "r2c4",
      topRoutes: ["a2sD", "a2sE"],
      rightRoutes: ["a2sE", "a3sE"],
      bottomRoutes: ["a3sD", "a3sE"],
      leftRoutes: ["a2sD", "a3sD"],
      label: "Block 10",
    },
    {
      id: "r2c5",
      topRoutes: ["a2sE", "a2sF"],
      rightRoutes: ["a2sF", "a3sF"],
      bottomRoutes: ["a3sE", "a3sF"],
      leftRoutes: ["a2sE", "a3sE"],
      label: "Block 11",
    },
    {
      id: "r2c6",
      topRoutes: ["a2sF", "a2sG"],
      rightRoutes: ["a2sG", "a3sG"],
      bottomRoutes: ["a3sF", "a3sG"],
      leftRoutes: ["a2sF", "a3sF"],
      label: "Block 12",
    },
    {
      id: "r3c1",
      topRoutes: ["a3sA", "a3sB"],
      rightRoutes: ["a3sB", "a4sB"],
      bottomRoutes: ["a4sA", "a4sB"],
      leftRoutes: ["a3sA", "a4sA"],
      label: "Block 13",
    },
    {
      id: "r3c2",
      topRoutes: ["a3sB", "a3sC"],
      rightRoutes: ["a3sC", "a4sC"],
      bottomRoutes: ["a4sB", "a4sC"],
      leftRoutes: ["a3sB", "a4sB"],
      label: "Block 14",
    },
    {
      id: "r3c3",
      topRoutes: ["a3sC", "a3sD"],
      rightRoutes: ["a3sD", "a4sD"],
      bottomRoutes: ["a4sC", "a4sD"],
      leftRoutes: ["a3sC", "a4sC"],
      label: "Block 15",
    },
    {
      id: "r3c4",
      topRoutes: ["a3sD", "a3sE"],
      rightRoutes: ["a3sE", "a4sE"],
      bottomRoutes: ["a4sD", "a4sE"],
      leftRoutes: ["a3sD", "a4sD"],
      label: "Block 16",
    },
    {
      id: "r3c5",
      topRoutes: ["a3sE", "a3sF"],
      rightRoutes: ["a3sF", "a4sF"],
      bottomRoutes: ["a4sE", "a4sF"],
      leftRoutes: ["a3sE", "a4sE"],
      label: "Block 17",
    },
    {
      id: "r3c6",
      topRoutes: ["a3sF", "a3sG"],
      rightRoutes: ["a3sG", "a4sG"],
      bottomRoutes: ["a4sF", "a4sG"],
      leftRoutes: ["a3sF", "a4sF"],
      label: "Block 18",
    },
    {
      id: "r4c1",
      topRoutes: ["a4sA", "a4sB"],
      rightRoutes: ["a4sB", "a5sB"],
      bottomRoutes: ["a5sA", "a5sB"],
      leftRoutes: ["a4sA", "a5sA"],
      label: "Block 19",
    },
    {
      id: "r4c2",
      topRoutes: ["a4sB", "a4sC"],
      rightRoutes: ["a4sC", "a5sC"],
      bottomRoutes: ["a5sB", "a5sC"],
      leftRoutes: ["a4sB", "a5sB"],
      label: "Block 20",
    },
    {
      id: "r4c3",
      topRoutes: ["a4sC", "a4sD"],
      rightRoutes: ["a4sD", "a5sD"],
      bottomRoutes: ["a5sC", "a5sD"],
      leftRoutes: ["a4sC", "a5sC"],
      label: "Block 21",
    },
    {
      id: "r4c4",
      topRoutes: ["a4sD", "a4sE"],
      rightRoutes: ["a4sE", "a5sE"],
      bottomRoutes: ["a5sD", "a5sE"],
      leftRoutes: ["a4sD", "a5sD"],
      label: "Block 22",
    },
    {
      id: "r4c5",
      topRoutes: ["a4sE", "a4sF"],
      rightRoutes: ["a4sF", "a5sF"],
      bottomRoutes: ["a5sE", "a5sF"],
      leftRoutes: ["a4sE", "a5sE"],
      label: "Block 23",
    },
    {
      id: "r4c6",
      topRoutes: ["a4sF", "a4sG"],
      rightRoutes: ["a4sG", "a5sG"],
      bottomRoutes: ["a5sF", "a5sG"],
      leftRoutes: ["a4sF", "a5sF"],
      label: "Block 24",
    },
    {
      id: "r5c1",
      topRoutes: ["a5sA", "a5sB"],
      rightRoutes: ["a5sB", "a6sB"],
      bottomRoutes: ["a6sA", "a6sB"],
      leftRoutes: ["a5sA", "a6sA"],
      label: "Block 25",
    },
    {
      id: "r5c2",
      topRoutes: ["a5sB", "a5sC"],
      rightRoutes: ["a5sC", "a6sC"],
      bottomRoutes: ["a6sB", "a6sC"],
      leftRoutes: ["a5sB", "a6sB"],
      label: "Block 26",
    },
    {
      id: "r5c3",
      topRoutes: ["a5sC", "a5sD"],
      rightRoutes: ["a5sD", "a6sD"],
      bottomRoutes: ["a6sC", "a6sD"],
      leftRoutes: ["a5sC", "a6sC"],
      label: "Block 27",
    },
    {
      id: "r5c4",
      topRoutes: ["a5sD", "a5sE"],
      rightRoutes: ["a5sE", "a6sE"],
      bottomRoutes: ["a6sD", "a6sE"],
      leftRoutes: ["a5sD", "a6sD"],
      label: "Block 28",
    },
    {
      id: "r5c5",
      topRoutes: ["a5sE", "a5sF"],
      rightRoutes: ["a5sF", "a6sF"],
      bottomRoutes: ["a6sE", "a6sF"],
      leftRoutes: ["a5sE", "a6sE"],
      label: "Block 29",
    },
    {
      id: "r5c6",
      topRoutes: ["a5sF", "a5sG"],
      rightRoutes: ["a5sG", "a6sG"],
      bottomRoutes: ["a6sF", "a6sG"],
      leftRoutes: ["a5sF", "a6sF"],
      label: "Block 30",
    },
    {
      id: "r6c1",
      topRoutes: ["a6sA", "a6sB"],
      rightRoutes: ["a6sB", "a7sB"],
      bottomRoutes: ["a7sA", "a7sB"],
      leftRoutes: ["a6sA", "a7sA"],
      label: "Block 31",
    },
    {
      id: "r6c2",
      topRoutes: ["a6sB", "a6sC"],
      rightRoutes: ["a6sC", "a7sC"],
      bottomRoutes: ["a7sB", "a7sC"],
      leftRoutes: ["a6sB", "a7sB"],
      label: "Block 32",
    },
    {
      id: "r6c3",
      topRoutes: ["a6sC", "a6sD"],
      rightRoutes: ["a6sD", "a7sD"],
      bottomRoutes: ["a7sC", "a7sD"],
      leftRoutes: ["a6sC", "a7sC"],
      label: "Block 33",
    },
    {
      id: "r6c4",
      topRoutes: ["a6sD", "a6sE"],
      rightRoutes: ["a6sE", "a7sE"],
      bottomRoutes: ["a7sD", "a7sE"],
      leftRoutes: ["a6sD", "a7sD"],
      label: "Block 34",
    },
    {
      id: "r6c5",
      topRoutes: ["a6sE", "a6sF"],
      rightRoutes: ["a6sF", "a7sF"],
      bottomRoutes: ["a7sE", "a7sF"],
      leftRoutes: ["a6sE", "a7sE"],
      label: "Block 35",
    },
    {
      id: "r6c6",
      topRoutes: ["a6sF", "a6sG"],
      rightRoutes: ["a6sG", "a7sG"],
      bottomRoutes: ["a7sF", "a7sG"],
      leftRoutes: ["a6sF", "a7sF"],
      label: "Block 36",
    },
  ];
  TOTAL_AVENUES = [
    {
      avenueName: "1st Avenue",
      avenueKey: "a1",
    },
    {
      avenueName: "2nd Avenue",
      avenueKey: "a2",
    },
    {
      avenueName: "3rd Avenue",
      avenueKey: "a3",
    },
    {
      avenueName: "4th Avenue",
      avenueKey: "a4",
    },
    {
      avenueName: "5th Avenue",
      avenueKey: "a5",
    },
    {
      avenueName: "6th Avenue",
      avenueKey: "a6",
    },
    {
      avenueName: "7th Avenue",
      avenueKey: "a7",
    },
  ];

  TOTAL_STREETS = [
    {
      streetName: "A Street",
      streetKey: "sA",
    },
    {
      streetName: "B Street",
      streetKey: "sB",
    },
    {
      streetName: "C Street",
      streetKey: "sC",
    },
    {
      streetName: "D Street",
      streetKey: "sD",
    },
    {
      streetName: "E Street",
      streetKey: "sE",
    },
    {
      streetName: "F Street",
      streetKey: "sF",
    },
    {
      streetName: "G Street",
      streetKey: "sG",
    },
  ];
  findShortRoute = (pickupPoint, dropPoint) => {
    const routeMap = this.ROUTE_MAP;
    const distances = {};
    const previous = {};

    for (const point in routeMap) {
      distances[point] = point === pickupPoint ? 0 : Infinity;
    }

    pQueue.enqueue(pickupPoint, 0);

    while (!pQueue.isEmpty()) {
      const { element: currentPoint } = pQueue.dequeue();

      if (currentPoint === dropPoint) {
        break;
      }

      if (!routeMap[currentPoint]) {
        continue;
      }

      for (const neighbor in routeMap[currentPoint]) {
        const currDistance = routeMap[currentPoint][neighbor];
        const totalDistance = distances[currentPoint] + currDistance;

        if (totalDistance < distances[neighbor]) {
          distances[neighbor] = totalDistance;
          previous[neighbor] = currentPoint;
          pQueue.enqueue(neighbor, totalDistance);
        }
      }
    }

    const shortestPath = [dropPoint];
    let point = dropPoint;

    while (previous[point]) {
      shortestPath.unshift(previous[point]);
      point = previous[point];
    }

    return shortestPath;
  };
}



export default new FairCalculator();
