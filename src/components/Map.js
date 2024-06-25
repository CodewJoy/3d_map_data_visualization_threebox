import React, { useEffect, useRef } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import "threebox-plugin/dist/threebox.css";
import { Threebox } from "threebox-plugin";
import data from "../data/earthquakeData.json";
import { magnitudeConfig } from "../App";

mapboxgl.accessToken =
  "pk.eyJ1IjoiY29kZXdqb3kiLCJhIjoiY2xlenE0dnE2MDFueTNycDJrMnc5Y2twcCJ9.p7bcH7fkoTbnOYDRUyGVsw";

const ThreeDModuleMap = () => {
  const mapContainerRef = useRef(null);
  const getColor = (magnitude) => {
    for (const el of magnitudeConfig) {
      if (
        (el.min === undefined || magnitude >= el.min) &&
        (el.max === undefined || magnitude < el.max)
      ) {
        return el.color;
      }
    }
    return "white";
  };
  useEffect(() => {
    const map = new mapboxgl.Map({
      container: mapContainerRef.current,
      style: "mapbox://styles/mapbox/light-v9",
      center: [-115, 40],
      zoom: 4,
      pitch: 60,
    });

    map.on("style.load", function () {
      // Add the terrain source
      map.addSource("mapbox-dem", {
        type: "raster-dem",
        url: "mapbox://mapbox.terrain-rgb",
        tileSize: 512,
        maxzoom: 14,
      });
      // Set the terrain
      map.setTerrain({ source: "mapbox-dem", exaggeration: 1.5 });

      // Add a hillshade layer for better visualization
      map.addLayer({
        id: "hillshading",
        source: "mapbox-dem",
        type: "hillshade",
      });

      map.addLayer({
        id: "custom_layer",
        type: "custom",
        onAdd: function (map, mbxContext) {
          const tb = new Threebox(map, mbxContext, {
            defaultLights: true,
            // enableSelectingFeatures: true,
            enableSelectingObjects: true,
            enableTooltips: true,
          });
          window.tb = tb;
          data.features.forEach((point) => {
            const location = point.geometry.coordinates;
            const depth = -location[2];
            const magnitude = point.properties.mag;
            const color = getColor(point.properties.mag);
            const sphere = tb
              .sphere({
                color,
                radius: magnitude * 1000,
                material: "MeshStandardMaterial",
              })
              .setCoords([location[0], location[1], depth]);
            const time = new Date(point.properties.time).toLocaleString();
            sphere.addTooltip(
              `${point.properties.title}; Time: ${time}; Location: ${location[0]}, ${location[1]}, ${location[2]}`,
              true,
              sphere.anchor,
              true,
              1
            );
            tb.add(sphere);
          });
        },

        render: function (gl, matrix) {
          window.tb.update();
        },
      });
    });

    return () => {
      map.remove();
    };
  }, []);

  return (
    <div
      ref={mapContainerRef}
      style={{ position: "absolute", top: 0, bottom: 0, width: "100%" }}
    ></div>
  );
};

export default ThreeDModuleMap;
