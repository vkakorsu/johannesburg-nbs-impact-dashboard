import { MapContainer, TileLayer, CircleMarker, Polyline, Popup, Tooltip } from "react-leaflet";
import "leaflet/dist/leaflet.css";

interface Props {
  geojson: {
    features: Array<{
      properties: { id: string; name: string; pillar: string; type: string; summary: string };
      geometry:
        | { type: "Point"; coordinates: [number, number] }
        | { type: "LineString"; coordinates: [number, number][] };
    }>;
  };
}

const pillarColors: Record<string, string> = {
  flood: "#3B7EA1",
  heat: "#B4643C",
  environment: "#2F6B52",
  socio: "#8A6D3B",
};

// Leaflet with OpenStreetMap tiles. No API token is required, which avoids
// vendor lock in. Interactivity is intentionally light, in line with a
// communication focused MVP.
export default function MapView({ geojson }: Props) {
  const center: [number, number] = [-26.103, 28.101];
  const points = geojson.features.filter((f) => f.geometry.type === "Point");
  const lines = geojson.features.filter((f) => f.geometry.type === "LineString");

  return (
    <div className="overflow-hidden rounded-md border border-rule" style={{ height: 460 }}>
      <MapContainer
        center={center}
        zoom={14}
        scrollWheelZoom={false}
        style={{ height: "100%", width: "100%" }}
        attributionControl={true}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {lines.map((f, idx) => {
          const coords = (f.geometry as { coordinates: [number, number][] }).coordinates.map(
            ([lng, lat]) => [lat, lng] as [number, number],
          );
          return (
            <Polyline
              key={`line-${idx}`}
              positions={coords}
              pathOptions={{ color: "#0B3D2E", weight: 4, opacity: 0.7, dashArray: "6 6" }}
            >
              <Tooltip>{f.properties.name}</Tooltip>
            </Polyline>
          );
        })}
        {points.map((f) => {
          const [lng, lat] = (f.geometry as { coordinates: [number, number] }).coordinates;
          const color = pillarColors[f.properties.pillar] ?? "#3B7EA1";
          return (
            <CircleMarker
              key={f.properties.id}
              center={[lat, lng]}
              radius={9}
              pathOptions={{ color, fillColor: color, fillOpacity: 0.85, weight: 2 }}
            >
              <Popup>
                <strong>{f.properties.name}</strong>
                <br />
                <span style={{ color, fontWeight: 600 }}>{f.properties.type}</span>
                <br />
                {f.properties.summary}
              </Popup>
            </CircleMarker>
          );
        })}
      </MapContainer>
    </div>
  );
}
