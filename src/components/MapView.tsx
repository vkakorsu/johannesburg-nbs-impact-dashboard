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

const pillarLabels: Record<string, string> = {
  flood: "Flood management",
  heat: "Heat management",
  environment: "Environmental quality",
  socio: "Socio-economic",
};

// Leaflet with OpenStreetMap tiles. No API token is required, which avoids
// vendor lock in. Interactivity is intentionally light, in line with a
// communication focused MVP.
export default function MapView({ geojson }: Props) {
  const center: [number, number] = [-26.103, 28.101];
  const points = geojson.features.filter((f) => f.geometry.type === "Point");
  const lines = geojson.features.filter((f) => f.geometry.type === "LineString");

  // Determine which pillars are actually present in the data
  const activePillars = [...new Set(points.map((f) => f.properties.pillar))];
  const hasLines = lines.length > 0;

  return (
    <div className="relative overflow-hidden rounded-md border border-rule" style={{ height: 460 }}>
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

      {/* Map legend */}
      <div
        className="absolute bottom-3 left-3 z-[1000] rounded-md border border-rule bg-paper/95 px-3 py-2.5 text-xs shadow-sm backdrop-blur"
        style={{ pointerEvents: "auto" }}
      >
        <p className="mb-1.5 font-semibold text-charcoal/70" style={{ fontSize: "0.65rem", letterSpacing: "0.1em", textTransform: "uppercase" }}>
          Legend
        </p>
        <ul className="flex flex-col gap-1">
          {activePillars.map((pillar) => (
            <li key={pillar} className="flex items-center gap-2">
              <span
                className="inline-block h-2.5 w-2.5 shrink-0 rounded-full"
                style={{ backgroundColor: pillarColors[pillar] ?? "#3B7EA1" }}
              />
              <span className="text-charcoal/80">{pillarLabels[pillar] ?? pillar}</span>
            </li>
          ))}
          {hasLines && (
            <li className="flex items-center gap-2">
              <span className="inline-block h-0.5 w-2.5 shrink-0 rounded-full" style={{ backgroundColor: "#0B3D2E", borderTop: "2px dashed #0B3D2E" }} />
              <span className="text-charcoal/80">River corridor</span>
            </li>
          )}
        </ul>
      </div>
    </div>
  );
}
