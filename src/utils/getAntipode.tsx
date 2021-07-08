import { Coordinates } from "../components/AntipodeMaster";

const findAntipode = (coord: Coordinates): Coordinates => {
  const { lat, lng } = coord;
  const antipodeLat = -lat;
  const antipodeLng = lng > 0 ? lng - 180 : lng + 180;
  const antipodeCoord = { lat: antipodeLat, lng: antipodeLng };

  return antipodeCoord;
};

export const getAntipode = (coord: Coordinates[]): Coordinates[] => {
  let antipodeCoords: Coordinates[] = [];
  coord.forEach((c) => {
    antipodeCoords.push(findAntipode(c));
  });

  return antipodeCoords;
};
