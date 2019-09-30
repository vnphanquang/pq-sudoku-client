import React from 'react';
import { useSpring, animated } from 'react-spring';

const calc = (x, y) => [-(y - window.innerHeight / 2) / 20, (x - window.innerWidth / 2) / 20, .95]
const trans = (x, y, s) => `perspective(600px) rotateX(${x}deg) rotateY(${y}deg) scale(${s})`

function ThemeDemo({theme, overrideThemeType, ...others}) {
  const [props, set] = useSpring(() => ({ 
    xys: [0, 0, .75], 
    config: { 
      mass: 5, 
      tension: 200, 
      friction: 120 
    },
    from: {
      xys: [0, 0, 0.45]
    }
  }));

  return (
    <animated.svg 
      id="main" 
      xmlns="http://www.w3.org/2000/svg" 
      // width="100%"
      height="90%"
      viewBox="0 0 224.118 458.127"
      onMouseMove={({ clientX: x, clientY: y }) => set({ xys: calc(x, y) })}
      onMouseLeave={() => set({ xys: [0, 0, .75] })}
      style={{ transform: props.xys.interpolate(trans) }}
      {...others}
    >
      <defs>
        <style>{`
          #main {
            cursor: pointer;
          }
          .cls-2, .cls-4 {
            fill: #fff;
          }

          .cls-4 {
            font-size: 13px;
            font-family: Roboto-Regular, Roboto;
          }

          .cls-6, .cls-8 {
            fill: #d3d3d3;
          }

          .cls-7 {
            fill: tomato;
          }

          .cls-10, .cls-8, .cls-9 {
            fill-rule: evenodd;
          }

          .cls-10 {
            fill: #3d3942;
          }

          .cls-11 {
            fill: #003ba7;
          }

          .cls-12 {
            fill: #232323;
            stroke: #555;
            stroke-width: 2.06px;
          }

          .cls-13 {
            fill: #212121;
          }
        `}
        </style>
      </defs>
      <title>mobile-demo</title>
      <rect 
        id="bg-3" 
        data-name="bg" 
        x="10.134" y="54.534" 
        width="199.939" height="375.702"
        fill={overrideThemeType === 'light' ? '#CCC' : '#212121'}
        // opacity="0.25"
      />
      <g id="drawer">
        <rect 
          id="bg" 
          x="10.134" y="54.534" 
          width="44.571" height="375.702"
          fill={overrideThemeType === 'light' ? '#FFF' : '#424242'}
        />
        <path 
          id="export" 
          fill={overrideThemeType === 'light' ? '#212121' : '#FFF'}
          d="M176.486,202.611a6.328,6.328,0,0,0-6.125-5.285,6.217,6.217,0,0,0-5.541,3.535,5.267,5.267,0,0,0,.541,10.465H176.2a4.374,4.374,0,0,0,.291-8.715Zm-1.958,2.59-4.167,4.375L166.2,205.2h2.5v-3.5h3.333v3.5Z" 
          transform="translate(-137.941 -20.936)"/>
        <path 
          id="add" 
          fill={overrideThemeType === 'light' ? '#212121' : '#FFF'}
          d="M175.852,104.807c-8.016-6.123-17.1,2.965-10.981,10.982C172.887,121.912,181.976,112.824,175.852,104.807Zm-1.741,6.241h-3v3h-1.5v-3h-3v-1.5h3v-3h1.5v3h3Z" 
          transform="translate(-137.941 -20.936)"/>
        <path 
          id="save" 
          fill={overrideThemeType === 'light' ? '#212121' : '#FFF'}
          d="M174.528,149.812H162.861v15h15V153.145ZM172.2,162.481a2.6,2.6,0,0,1-3.671-3.671A2.6,2.6,0,0,1,172.2,162.481Zm.664-7.669h-8.333v-3.333h8.333Z" 
          transform="translate(-137.941 -20.936)"/>
      </g>
      <g id="appbar">
        <rect 
        id="bg-2" 
        data-name="bg" 
        x="10.134" 
        y="30.265" 
        width="199.939" height="24.269"
        fill={theme.colors.appBar[overrideThemeType]}
      />
        <text 
          transform="translate(54.706 47.048)"
          fill={overrideThemeType === 'light' ? '#212121' : '#FFF'}
        >
          pqSudoku
        </text>
        <path 
          id="drawerIcon" 
          d="M163.42,68.343H177.3V66.676H163.42Zm0-4.167H177.3V62.51H163.42Zm0-5.833V60.01H177.3V58.343Z" 
          transform="translate(-137.941 -20.936)"
          fill={overrideThemeType === 'light' ? '#212121' : '#FFF'}
        />
      </g>
      <g id="pixel">
        <path id="volume-btns" className="cls-6" d="M358.71,191.281h1.811a1.539,1.539,0,0,1,1.538,1.538v55.643A1.539,1.539,0,0,1,360.521,250H358.71a1.539,1.539,0,0,1-1.538-1.538V192.819A1.539,1.539,0,0,1,358.71,191.281Z" transform="translate(-137.941 -20.936)"/>
        <path id="power-btn" className="cls-7" d="M358.256,127.857h2.72a1.084,1.084,0,0,1,1.083,1.084v26.952a1.083,1.083,0,0,1-1.083,1.083h-2.72a1.084,1.084,0,0,1-1.084-1.083V128.941A1.085,1.085,0,0,1,358.256,127.857Z" transform="translate(-137.941 -20.936)"/>
        <path id="outer-frame" className="cls-8" d="M160.037,20.936H337.519a22.107,22.107,0,0,1,22.1,22.1V456.967a22.107,22.107,0,0,1-22.1,22.1H160.037a22.107,22.107,0,0,1-22.1-22.1V43.032A22.107,22.107,0,0,1,160.037,20.936Zm.9,2.091H336.01a21.138,21.138,0,0,1,21.128,21.127V455.7a21.138,21.138,0,0,1-21.128,21.128H160.939A21.138,21.138,0,0,1,139.812,455.7V44.154A21.137,21.137,0,0,1,160.939,23.027Z" transform="translate(-137.941 -20.936)"/>
        <path id="inner-frame" className="cls-9" d="M160.939,23.027H336.01a21.138,21.138,0,0,1,21.128,21.127V455.7a21.138,21.138,0,0,1-21.128,21.128H160.939A21.138,21.138,0,0,1,139.812,455.7V44.154A21.137,21.137,0,0,1,160.939,23.027ZM157.3,51.2h181.5a9.226,9.226,0,0,1,9.221,9.221V441.951a9.226,9.226,0,0,1-9.221,9.222H157.3a9.225,9.225,0,0,1-9.221-9.222V60.422A9.225,9.225,0,0,1,157.3,51.2Z" transform="translate(-137.941 -20.936)"/>
        <g id="camera">
          <path className="cls-10" d="M174.772,38.028a4.32,4.32,0,0,1-8.639,0h0a4.32,4.32,0,0,1,8.639,0Z" transform="translate(-137.941 -20.936)"/>
          <path d="M173.221,38.159a2.859,2.859,0,0,1-5.717,0v0a2.859,2.859,0,0,1,5.717,0v0Z" transform="translate(-137.941 -20.936)"/>
          <path className="cls-11" d="M173.033,38.159a2.671,2.671,0,1,1-5.341,0h0a2.671,2.671,0,1,1,5.341,0Z" transform="translate(-137.941 -20.936)"/>
          <path className="cls-12" d="M172.013,38.065a1.6,1.6,0,0,1-3.207,0v0a1.6,1.6,0,0,1,3.207,0Z" transform="translate(-137.941 -20.936)"/>
          <path className="cls-2" d="M168.156,38.9a2.813,2.813,0,0,0,2.858,1.453C170.436,39.6,168.734,39.162,168.156,38.9Z" transform="translate(-137.941 -20.936)"/>
        </g>
        <rect id="bottom-grill" className="cls-13" x="68.706" y="442.034" width="84.353" height="3.353" rx="1.676"/>
        <rect id="top-grill" className="cls-13" x="68.706" y="8.891" width="84.353" height="3.353" rx="1.676"/>
      </g>
    </animated.svg>
  )
}

export default React.memo(ThemeDemo);