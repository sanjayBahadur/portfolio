// Type declarations for atlas packages
declare module "world-atlas/countries-110m.json" {
    import type { Topology, GeometryCollection } from "topojson-specification";

    const data: Topology<{
        countries: GeometryCollection<{ name: string }>;
    }>;

    export default data;
}

declare module "us-atlas/states-10m.json" {
    import type { Topology, GeometryCollection } from "topojson-specification";

    const data: Topology<{
        states: GeometryCollection<{ name: string }>;
    }>;

    export default data;
}

// Extend react-globe.gl types if needed
declare module "react-globe.gl" {
    import { FC } from "react";
    import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

    export interface GlobeMethods {
        pointOfView: (
            pov: { lat?: number; lng?: number; altitude?: number },
            transitionMs?: number
        ) => void;
        controls: () => OrbitControls | undefined;
        scene: () => THREE.Scene;
        camera: () => THREE.Camera;
        renderer: () => THREE.WebGLRenderer;
    }

    export interface GlobeProps {
        ref?: React.RefObject<GlobeMethods | undefined>;
        width?: number;
        height?: number;
        backgroundColor?: string;
        globeImageUrl?: string;
        showAtmosphere?: boolean;
        atmosphereColor?: string;
        atmosphereAltitude?: number;
        onGlobeReady?: () => void;

        // Polygons
        polygonsData?: object[];
        polygonCapColor?: (d: object) => string;
        polygonSideColor?: (d: object) => string;
        polygonStrokeColor?: (d: object) => string;
        polygonAltitude?: (d: object) => number;
        polygonLabel?: (d: object) => string;
        onPolygonHover?: (polygon: object | null) => void;
        onPolygonClick?: (polygon: object | null) => void;

        // Points
        pointsData?: object[];
        pointLat?: (d: object) => number;
        pointLng?: (d: object) => number;
        pointRadius?: (d: object) => number;
        pointColor?: (d: object) => string;
        pointAltitude?: number;

        // Rings
        ringsData?: object[];
        ringLat?: (d: object) => number;
        ringLng?: (d: object) => number;
        ringMaxRadius?: (d: object) => number;
        ringPropagationSpeed?: (d: object) => number;
        ringRepeatPeriod?: (d: object) => number;
        ringColor?: (d: object) => () => string;
    }

    const Globe: FC<GlobeProps>;
    export default Globe;
}
