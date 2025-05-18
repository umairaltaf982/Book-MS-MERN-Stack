import { useState, useCallback } from 'react'
import { GoogleMap, useJsApiLoader, Marker, InfoWindow } from '@react-google-maps/api'

const containerStyle = {
  width: '100%',
  height: '400px'
}

// Default center (you can change this to your desired location)
const defaultCenter = {
  lat: 40.7128,
  lng: -74.0060 // New York coordinates
}

// List of bookstore locations (you can replace with your actual data)
const bookstores = [
  { id: 1, name: "Main Street Books", position: { lat: 40.7128, lng: -74.0060 }, address: "123 Main St, New York, NY" },
  { id: 2, name: "Central Book Shop", position: { lat: 40.7200, lng: -74.0100 }, address: "456 Central Ave, New York, NY" },
  { id: 3, name: "Harbor Books", position: { lat: 40.7300, lng: -74.0200 }, address: "789 Harbor Blvd, New York, NY" }
]

function GoogleMapComponent() {
  const [selectedStore, setSelectedStore] = useState(null)
  const [map, setMap] = useState(null)

  // Load the Google Maps JavaScript API
  const { isLoaded, loadError } = useJsApiLoader({
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY || "YOUR_API_KEY_HERE"
  })

  const onLoad = useCallback(function callback(map) {
    setMap(map)
  }, [])

  const onUnmount = useCallback(function callback() {
    setMap(null)
  }, [])

  if (loadError) return <div>Error loading maps</div>
  if (!isLoaded) return <div>Loading maps...</div>

  return (
    <div className="map-container">
      <h2>Find Bookstores Near You</h2>
      <GoogleMap
        mapContainerStyle={containerStyle}
        center={defaultCenter}
        zoom={13}
        onLoad={onLoad}
        onUnmount={onUnmount}
      >
        {bookstores.map(store => (
          <Marker
            key={store.id}
            position={store.position}
            onClick={() => setSelectedStore(store)}
          />
        ))}

        {selectedStore && (
          <InfoWindow
            position={selectedStore.position}
            onCloseClick={() => setSelectedStore(null)}
          >
            <div className="info-window">
              <h3>{selectedStore.name}</h3>
              <p>{selectedStore.address}</p>
              <button 
                onClick={() => window.open(`https://www.google.com/maps/dir/?api=1&destination=${selectedStore.position.lat},${selectedStore.position.lng}`, '_blank')}
              >
                Get Directions
              </button>
            </div>
          </InfoWindow>
        )}
      </GoogleMap>
    </div>
  )
}

export default GoogleMapComponent