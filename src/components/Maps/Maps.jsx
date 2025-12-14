"use client";

import React, { useEffect, useRef } from "react";
// import H from "@here/maps-api-for-javascript";
import H from "@here/maps-api-for-javascript/bin/mapsjs.bundle.harp.js";
import { throttle } from "lodash";
// import H from "@here/maps-api-for-javascript/bin/mapsjs.bundle.js";

// 21.028424867572447, 105.80345268231493
const Maps = (props) => {
  const mapRef = useRef(null);
  const map = useRef(null);
  const platform = useRef(null);
  const { apikey, className } = props;
  //Tao ham custom map
  const addDraggableMaker = (map, behavior) => {
    var marker = new H.map.Marker(
      { lat: 21.028424867572447, lng: 105.80345268231493 },
      {
        volatility: true,
      }
    );
    marker.draggable = true;
    map.addObject(marker);
    map.addEventListener(
      "dragstart",
      (e) => {
        const target = e.target;
        const pointer = e.currentPointer;
        if (target instanceof H.map.Marker) {
          const targetPosition = map.geoToScreen(target.getGeometry());
          target["offset"] = new H.math.Point(
            pointer.viewportX - targetPosition.x,
            pointer.viewportY - targetPosition.y
          );
          behavior.disable();
        }
      },
      false
    );
    map.addEventListener(
      "dragend",
      (e) => {
        const target = e.target;

        if (target instanceof H.map.Marker) {
          behavior.enable();
          const finalCoordinates = target.getGeometry();
          // console.log(
          //   "Marker dropped at:",
          //   finalCoordinates.lat,
          //   finalCoordinates.lng
          // );
        }
      },
      false
    );
    const throttledDrag = throttle((e) => {
      const target = e.target;
      const pointer = e.currentPointer;
      if (target instanceof H.map.Marker) {
        target.setGeometry(
          map.screenToGeo(
            pointer.viewportX - target["offset"].x,
            pointer.viewportY - target["offset"].y
          )
        );
        // Lấy vị trí hiện tại của marker
        const markerPosition = map.geoToScreen(target.getGeometry());
        const mapWidth = map.getViewPort().width; // Lấy chiều rộng của bản đồ
        const mapHeight = map.getViewPort().height; // Lấy chiều cao của bản đồ

        // Kiểm tra nếu marker gần sát biên của bản đồ và tự động di chuyển bản đồ
        const panThreshold = 50; // Khoảng cách từ biên mà bản đồ sẽ tự động di chuyển
        if (markerPosition.x < panThreshold) {
          map.setCenter(
            map.screenToGeo(mapWidth / 2 - panThreshold, mapHeight / 2)
          );
        } else if (markerPosition.x > mapWidth - panThreshold) {
          map.setCenter(
            map.screenToGeo(mapWidth / 2 + panThreshold, mapHeight / 2)
          );
        }
        if (markerPosition.y < panThreshold) {
          map.setCenter(
            map.screenToGeo(mapWidth / 2, mapHeight / 2 - panThreshold)
          );
        } else if (markerPosition.y > mapHeight - panThreshold) {
          map.setCenter(
            map.screenToGeo(mapWidth / 2, mapHeight / 2 + panThreshold)
          );
        }
      }
    }, 40);
    map.addEventListener("drag", throttledDrag, false);
  };
  useEffect(() => {
    if (!map.current) {
      platform.current = new H.service.Platform({ apikey });

      const engineType = H.Map.EngineType["HARP"];
      const layers = platform.current.createDefaultLayers({ engineType });

      const newMap = new H.Map(mapRef.current, layers.vector.normal.map, {
        engineType,
        pixelRatio: window.devicePixelRatio,
        center: {
          lat: 21.028424867572447,
          lng: 105.80345268231493,
        },
        zoom: 17,
      });
      window.addEventListener("resize", () => newMap.getViewPort().resize());
      const behavior = new H.mapevents.Behavior(
        new H.mapevents.MapEvents(newMap)
      );
      // H.ui.UI.createDefault(newMap, layers);
      addDraggableMaker(newMap, behavior);
      map.current = newMap;
    }
  }, [apikey]);
  console.log(map);

  return <div className={className} ref={mapRef} />;
};

export default Maps;
