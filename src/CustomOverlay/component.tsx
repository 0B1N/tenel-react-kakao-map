import ReactDOM from "react-dom";

import * as React from "react";

import { IKakao } from "tenel-kakao-map";

import PropTypes from "prop-types";

import KakaoMapContext from "../Map/context";
import CustomOverlayContext from "./context";

import _hooks from "./hooks";

declare var kakao: IKakao;

export interface IKakaoMapsCustomOverlayProps {
  className?: string;
  position: { lat: number, lng: number };
  content: HTMLElement | string;
  clickable?: boolean;
  xAnchor?: number;
  yAnchor?: number;
  zIndex?: number;
  /** 단위 : m */
  altitude?: number;
  /** 단위 : m */
  range?: number;
}

const toElement = <K extends keyof HTMLElementTagNameMap>(html: string, tagName = "div" as K): HTMLElementTagNameMap[K] => {
  const element = document.createElement(tagName);
  element.innerHTML = html;
  return element;
};

const CustomOverlay: React.FunctionComponent<IKakaoMapsCustomOverlayProps> = (props) => {
  const { map } = React.useContext(KakaoMapContext);

  const [state, setState] = React.useState(() => {
    const content = typeof props.content === "string"
      ? toElement(props.content, "div")
      : props.content;

    const options = {
      map,
      content,
      xAnchor: props.xAnchor,
      yAnchor: props.yAnchor,
      clickable: props.clickable,
    };
    const customOverlay = new kakao.maps.CustomOverlay(options);

    return { content, customOverlay };
  });

  React.useEffect(() => {
    const content = typeof props.content === "string"
      ? toElement(props.content, "div")
      : props.content;

    setState((prev) => ({ ...prev, content }));
    state.customOverlay.setContent(content);
  }, [props.content]);

  _hooks.useInit(state.customOverlay);
  _hooks.useRange(state.customOverlay, props.range!);
  _hooks.useZIndex(state.customOverlay, props.zIndex!);
  _hooks.usePosition(state.customOverlay, props.position);
  _hooks.useAltitude(state.customOverlay, props.altitude!);

  return (
    <CustomOverlayContext.Provider value={{ customOverlay: state.customOverlay }}>
      {ReactDOM.createPortal(props.children, state.content)}
    </CustomOverlayContext.Provider>
  );
};

CustomOverlay.defaultProps = {
  clickable: true,
  xAnchor: 0.5,
  yAnchor: 0.5,
  zIndex: 0,
  range: 500,
  altitude: 2,
};

CustomOverlay.propTypes = {
  /** 맵에 표시될 좌표 */
  position: PropTypes.shape({
    lat: PropTypes.number.isRequired,
    lng: PropTypes.number.isRequired,
  }).isRequired,
  /** 컨텐츠의 x축 위치 ( 0 ~ 1 ) */
  xAnchor: PropTypes.number,
  /** 컨텐츠의 y축 위치 ( 0 ~ 1 ) */
  yAnchor: PropTypes.number,
  /** 클릭 가능 여부 */
  clickable: PropTypes.bool,
  /** z-index 속성 값 */
  zIndex: PropTypes.number,
  /** 표시될 최대 거리 ( 로드맵 only ) */
  range: PropTypes.number,
  /** 고도 ( 로드맵 only ) */
  altitude: PropTypes.number,
  /** (e: { position: { lat: number, lng: number } }) => void */
};

export default CustomOverlay;
