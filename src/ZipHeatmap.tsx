import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import * as L from 'leaflet';
import 'leaflet.heat';
import zipData from './USCities.json';

interface Location {
	zip_code: number;
	latitude: number;
	longitude: number;
	city: string;
	state: string;
	county: string;
}

const zipArr: Location[] = zipData;

const zipToCoords = function(zip: number): [number, number] {
	const found = zipArr.find((element) => element.zip_code === zip)
	if (!found) {
		return [0, 0]
	}
	return [found.latitude, found.longitude]
}

interface ZipHeatmapProps {
	zipCodes: number[];
}

const HeatLayer: React.FC<{ points: [number, number][] }> = ({ points }) => {
	const map = useMap();

	useEffect(() => {
		if (points.length === 0) return;

		const heatLayer = (L as any).heatLayer(points, {
			radius: 25,
			blur: 15,
			maxZoom: 10,
		}).addTo(map);

		return () => {
			map.removeLayer(heatLayer);
		};
	}, [map, points]);

	return null;
};

const ZipHeatmap: React.FC<ZipHeatmapProps> = ({ zipCodes }) => {
	const [coords, setCoords] = useState<[number, number][]>([]);

	useEffect(() => {
		const resolvedCoords = zipCodes
			.map(zip => zipToCoords(zip))
			.filter((c): c is [number, number] => c[0] != 0 || c[1] != 0)
			.filter((c): c is [number, number] => !!c);
		setCoords(resolvedCoords);
	}, [zipCodes]);

	return (
		<MapContainer center={[39.8283, -98.5795]} zoom={4} style={{ height: '600px', width: '100%' }}>
			<TileLayer
				attribution='&copy; OpenStreetMap contributors'
				url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
			/>
			<HeatLayer points={coords} />
		</MapContainer>
	);
};

export default ZipHeatmap;

