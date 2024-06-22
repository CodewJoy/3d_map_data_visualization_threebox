import React, { useEffect, useRef } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import "threebox-plugin/dist/threebox.css";
import { Threebox } from "threebox-plugin";
import data from "../data/earthquakeData.json";

mapboxgl.accessToken =
  "pk.eyJ1IjoiY29kZXdqb3kiLCJhIjoiY2xlenE0dnE2MDFueTNycDJrMnc5Y2twcCJ9.p7bcH7fkoTbnOYDRUyGVsw";

const ThreeDModuleMap = () => {
  const mapContainerRef = useRef(null);
  const getColor = (magnitude) => {
    if (magnitude <= 2.5) return "green";
    if (magnitude <= 4.0) return "yellow";
    if (magnitude <= 5.5) return "orange";
    if (magnitude <= 7.0) return "red";
    return "darkred";
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
          console.log("Data loaded:", data); // Check if data is loaded
          data.features.forEach((point) => {
            const location = point.geometry.coordinates;
            const magnitude = point.properties.mag;
            console.log(
              point,
              location,
              "mag",
              point.properties.mag,
              "height",
              location[2]
            );
            const color = getColor(point.properties.mag);

            const sphere = tb
              .sphere({
                color,
                radius: magnitude * 1000,
                material: "MeshStandardMaterial",
              })
              .setCoords([location[0], location[1], location[2]]);
            const time = new Date(point.properties.time).toLocaleString();
            console.log(time);
            sphere.addTooltip(
              `${point.properties.title}, Time: ${time}`,
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
