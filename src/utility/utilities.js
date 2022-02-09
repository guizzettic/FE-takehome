export const sortShipmentData = (shipments) => {
  let currDate = new Date();
  let groupDeliveries = new Array(7).fill([]);

  shipments
    // filtering out deliveries in the past and not in the next week
    .filter((shipment) => {
      let estimatedArrival = new Date(
        shipment.estimatedArrival.replace(/-/g, '/')
      );
      let nextWeekDiff = new Date(currDate.getTime() + 7 * 24 * 60 * 60 * 1000);

      return estimatedArrival > currDate && nextWeekDiff >= estimatedArrival;
    })
    // sorting by date in increasing manner
    .sort((a, b) => {
      let first = new Date(a.estimatedArrival),
        second = new Date(b.estimatedArrival);
      return first - second;
    })
    // push delivery object to the groupDeliveries index, index based on how many until delivery time
    // ex: [[{id: 1}, {id: 3}], [none], [none], [{id: 2}, {id: 5}, {id: 4}], ...]
    .forEach((index) => {
      let groupIndex = Math.round(
        (new Date(index.estimatedArrival).valueOf() - currDate.valueOf()) /
          (24 * 60 * 60 * 1000)
      );
      groupDeliveries[groupIndex] = [...groupDeliveries[groupIndex], index];
    });

  return groupDeliveries;
};
