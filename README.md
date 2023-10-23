# ecobici-bike-finder
This API allows you to find nearby ECOBICI stations with information about available bikes and docks. It's hosted as a cloud function for Firebase

---
Currently there is only one function available accessed through:

[GET] https://getnearstationsavailability-viiqohozqq-uc.a.run.app/[https://getnearstationsavailability-viiqohozqq-uc.a.run.app/]

## Query parameters
- lat: The latitude of your location
- lon: The longitude of your location

## Example request
`[GET] https://getnearstationsavailability-viiqohozqq-uc.a.run.app/?lat=100&lon=100`

## Response
The API will respond with a JSON object containing an array of the three nearest ECOBICI stations. The response will have the following schema:
```
{
  stations: {
    id: string - ECOBICI station id
    name: string - ECOBICI station name
    distance: number - Euclidian distance from your location to the station
    num_bikes_available: number - Bikes available in that station
    num_docks_available: number - Docks available in that station
  }[]
}
```

---
## Apple shortcut
There is an Apple shortcut available.
https://www.icloud.com/shortcuts/05f58b5509a74f67a2ea6fba67989f6f
![IMG_0082](https://github.com/CarlosLecval/ecobici-bike-finder/assets/61945879/e2ac36e0-dd7f-4f9a-a186-d3553167aa6b)

