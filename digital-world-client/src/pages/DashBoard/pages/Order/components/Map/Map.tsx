import { MapPin } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import ReactMapGL, { MapRef, Marker, NavigationControl } from 'react-map-gl'
import { MarkerDragEvent } from 'react-map-gl/dist/esm/types'

export default function Map({
  longitude,
  latitude,
  handleUpdateCoordinates
}: {
  longitude: number
  latitude: number
  handleUpdateCoordinates: (latitude: number, longitude: number) => void
}) {
  const [viewport, setViewport] = useState({
    latitude,
    longitude,
    zoom: 15
  })

  const [marker, setMarker] = useState({
    latitude,
    longitude
  })
  const mapRef = useRef<MapRef>(null)

  useEffect(() => {
    setViewport((prevViewport) => ({
      ...prevViewport,
      latitude,
      longitude
    }))
    setMarker({ latitude, longitude })
    mapRef.current?.flyTo({ center: [longitude, latitude], duration: 2000 })
  }, [latitude, longitude])

  const handleMarkerDrag = (event: MarkerDragEvent<mapboxgl.Marker>) => {
    const latitude = event.lngLat.lat
    const longitude = event.lngLat.lng

    setMarker({ latitude, longitude })
    handleUpdateCoordinates(latitude, longitude)
  }

  return (
    <ReactMapGL
      {...viewport}
      ref={mapRef}
      mapStyle='mapbox://styles/mapbox/streets-v9'
      mapboxAccessToken={import.meta.env.VITE_MAPBOX_TOKEN}
      onMove={(event) => {
        setViewport(event.viewState)
      }}
      styleDiffing
    >
      <Marker
        longitude={marker.longitude}
        latitude={marker.latitude}
        draggable={true}
        onDragEnd={handleMarkerDrag}
        anchor='bottom'
      >
        <MapPin size={20} fill='#d00' />
      </Marker>
      <NavigationControl />
    </ReactMapGL>
  )
}
