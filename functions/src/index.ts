import {onRequest} from "firebase-functions/v2/https";

interface StationInformation {
  station_id: string;
  external_id: string;
  name: string;
  short_name: string;
  lat: number;
  lon: number;
  rental_methods: string[];
  capacity: number;
  electric_bike_surcharge_waiver: boolean;
  is_charging: boolean;
  eightd_has_key_dispenser: boolean;
  has_kiosk: boolean;
}

interface StationStatus {
  station_id: string;
  num_bikes_available: number;
  num_bikes_disabled: number;
  num_docks_available: number;
  num_docks_disabled: number;
  is_installed: number;
  is_renting: number;
  last_reported: number;
  eightd_has_available_keys: number;
  is_charging: number;
}

type Station = Pick<StationInformation, "name"> &
  Pick<StationStatus, "num_bikes_available" | "num_docks_available"> & {
    distance: number;
  };

export const getNearStationsAvailability = onRequest(
  async (request, response) => {
    const latitudeStr = request.query.lat;
    const longitudeStr = request.query.lon;
    console.log(typeof latitudeStr);
    console.log(typeof longitudeStr);
    if (typeof latitudeStr !== "string" || typeof longitudeStr != "string") {
      response.status(400).send({
        success: false,
      });
      return;
    }
    const latitude = Number(latitudeStr);
    const longitude = Number(longitudeStr);
    try {
      const infoRes = await fetch(
        "https://gbfs.mex.lyftbikes.com/gbfs/en/station_information.json"
      );
      const stationsData = await infoRes.json();
      const stationInformation: StationInformation[] =
        stationsData.data.stations;
      const stations = new Map<string, Station>();
      for (const station of stationInformation) {
        const distance = Math.sqrt(
          Math.pow(station.lon - longitude, 2) +
            Math.pow(station.lat - latitude, 2)
        );
        stations.set(station.station_id, {
          name: station.name,
          distance,
          num_docks_available: 0,
          num_bikes_available: 0,
        });
      }
      const statusRes = await fetch(
        "https://gbfs.mex.lyftbikes.com/gbfs/en/station_status.json"
      );
      const statusData = await statusRes.json();
      const stationStatus: StationStatus[] = statusData.data.stations;
      for (const station of stationStatus) {
        if (!stations.has(station.station_id)) continue;
        const temp = stations.get(station.station_id) as Station;
        temp.num_bikes_available = station.num_bikes_available;
        temp.num_docks_available = station.num_docks_available;
      }
      const stationsArr = Array.from(stations, ([key, value]) => {
        if (value.num_bikes_available === 0) value.distance = 9999;
        return {
          id: key,
          ...value,
        };
      });
      stationsArr.sort((a, b) => {
        if (a.distance < b.distance) return -1;
        if (a.distance > b.distance) return 1;
        return 0;
      });
      response.status(200).send({
        stations: stationsArr.slice(0, 3),
      });
    } catch (e) {
      console.log(e);
      response.status(500).send({error: e});
    }
  }
);
