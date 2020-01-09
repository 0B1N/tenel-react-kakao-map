import { IKakao, IKakaoMouseEvent, IKakaoCopyrightPosition } from "tenel-kakao-map";

import * as React from "react";

import KakaoMapContext from "./context";

import _hooks from "./hooks";

declare var kakao: IKakao;

export interface IKakaoMapsMapProps {
  container: HTMLElement;
  center: { lat: number, lng: number };
  overlayMapTypes?: (keyof typeof kakao.maps.MapTypeId)[];
  cursor?: string;
  draggable?: boolean;
  zoomable?: boolean;
  level?: {
    value: number,
    min?: number;
    max?: number;
    options?: { animate: { duration: number } },
  };
  copyright?: {
    position: keyof IKakaoCopyrightPosition;
    reverse?: boolean;
  };
  bounds?: {
    value: [{ lat: number, lng: number }, { lat: number, lng: number }],
    paddingTop?: number;
    paddingRight?: number;
    paddingBottom?: number;
    paddingLeft?: number;
  };
  onZoomStart?: () => void;
  onZoomChange?: () => void;
  onTilesLoaded?: () => void;
  onMapTypeIdChange?: () => void;
  onIdle?: () => void;
  onBoundsChanged?: () => void;
  onClick?: (e: IKakaoMouseEvent) => void;
  onRightClick?: (e: IKakaoMouseEvent) => void;
  onDoubleClick?: (e: IKakaoMouseEvent) => void;
  onDrag?: (e: IKakaoMouseEvent) => void;
  onDragEnd?: (e: IKakaoMouseEvent) => void;
  onDragStart?: (e: IKakaoMouseEvent) => void;
  onMouseMove?: (e: IKakaoMouseEvent) => void;
}

const KakaoMap: React.FunctionComponent<IKakaoMapsMapProps> = (props) => {
  const [map] = React.useState(() => {
    const latlng = new kakao.maps.LatLng(props.center.lat, props.center.lng);
    const options = { center: latlng };
    return new kakao.maps.Map(props.container, options);
  });

  React.useEffect(() => {
    props.onZoomStart && kakao.maps.event.addListener(map, "zoom_start", props.onZoomStart);
    props.onZoomChange && kakao.maps.event.addListener(map, "zoom_changed", props.onZoomChange);
    props.onTilesLoaded && kakao.maps.event.addListener(map, "tilesloaded", props.onTilesLoaded);
    props.onMapTypeIdChange && kakao.maps.event.addListener(map, "maptypeid_changed", props.onMapTypeIdChange);
    props.onIdle && kakao.maps.event.addListener(map, "idle", props.onIdle);
    props.onBoundsChanged && kakao.maps.event.addListener(map, "bounds_changed", props.onBoundsChanged);
    props.onClick && kakao.maps.event.addListener(map, "click", props.onClick);
    props.onDoubleClick && kakao.maps.event.addListener(map, "dblclick", props.onDoubleClick);
    props.onDrag && kakao.maps.event.addListener(map, "drag", props.onDrag);
    props.onDragEnd && kakao.maps.event.addListener(map, "dragend", props.onDragEnd);
    props.onDragStart && kakao.maps.event.addListener(map, "dragstart", props.onDragStart);
    props.onMouseMove && kakao.maps.event.addListener(map, "mousemove", props.onMouseMove);
    props.onRightClick && kakao.maps.event.addListener(map, "rightclick", props.onRightClick);

    return () => {
      props.onZoomStart && kakao.maps.event.removeListener(map, "zoom_start", props.onZoomStart);
      props.onZoomChange && kakao.maps.event.removeListener(map, "zoom_changed", props.onZoomChange);
      props.onTilesLoaded && kakao.maps.event.removeListener(map, "tilesloaded", props.onTilesLoaded);
      props.onMapTypeIdChange && kakao.maps.event.removeListener(map, "maptypeid_changed", props.onMapTypeIdChange);
      props.onIdle && kakao.maps.event.removeListener(map, "idle", props.onIdle);
      props.onBoundsChanged && kakao.maps.event.removeListener(map, "bounds_changed", props.onBoundsChanged);
      props.onClick && kakao.maps.event.removeListener(map, "click", props.onClick);
      props.onDoubleClick && kakao.maps.event.removeListener(map, "dblclick", props.onDoubleClick);
      props.onDrag && kakao.maps.event.removeListener(map, "drag", props.onDrag);
      props.onDragEnd && kakao.maps.event.removeListener(map, "dragend", props.onDragEnd);
      props.onDragStart && kakao.maps.event.removeListener(map, "dragstart", props.onDragStart);
      props.onMouseMove && kakao.maps.event.removeListener(map, "mousemove", props.onMouseMove);
      props.onRightClick && kakao.maps.event.removeListener(map, "rightclick", props.onRightClick);
    };
  }, []);

  _hooks.useCenter(map, props.center);
  _hooks.useDrag(map, props.draggable!);
  _hooks.useZoom(map, props.zoomable!, props.level!.min!, props.level!.max!, props.level!.value!, props.level!.options!.animate.duration!);
  _hooks.useCursor(map, props.cursor);
  _hooks.useBounds(map, props.bounds!);
  _hooks.useCopyright(map, props.copyright!);
  _hooks.useOverlayMapTypes(map, props.overlayMapTypes!);

  return (
    <KakaoMapContext.Provider value={{ map }}>
      {props.children}
    </KakaoMapContext.Provider>
  );
};

KakaoMap.defaultProps = {
  zoomable: true,
  draggable: true,
  copyright: { position: "BOTTOMLEFT", reverse: false },
  level: {
    value: 3,
    min: 1,
    max: 14,
    options: { animate: { duration: 300 } },
  },
};

export default (() => KakaoMap)();
