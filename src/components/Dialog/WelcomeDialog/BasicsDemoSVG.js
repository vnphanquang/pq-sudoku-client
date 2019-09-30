import React from 'react';

import {useSpring, animated, useSprings} from 'react-spring';

const cursorDs = [
  'M251.671,233.146l13.513,12.3-6.531.549,3.716,8.015-2.478,1.1-3.6-8.125-4.617,4.282V233.146',
  'M173.6,114.048l13.514,12.3-6.531.549,3.716,8.016-2.478,1.1-3.6-8.125-4.618,4.282V114.048',
  'M251.671,233.146l13.513,12.3-6.531.549,3.716,8.015-2.478,1.1-3.6-8.125-4.617,4.282V233.146',
  'M173.6,160.5l13.514,12.3-6.531.549,3.716,8.015-2.478,1.1-3.6-8.125-4.618,4.282V160.5',
  'M173.6,206.95l13.514,12.3-6.531.549,3.716,8.015-2.478,1.1-3.6-8.125-4.618,4.282V206.95',
];

const snackbarYs = [431.656, 409.597, 387.538, 365.479, 343.42];
const snackbarTextYs = [445.353, 423.295, 401.237, 379.178, 357.119];
const snackbarTexts = ['Add', 'Edit', 'Save', 'Export'];

function BasicsDemoSVG({themeType}) {
  const timeRef = React.useRef(null);
  const [step, setStep] = React.useState(0);
  const rootProps = useSpring({
    opacity: 1,
    from: {
      opacity: 0,
    }
  });
  const drawerProps = useSpring({
    opacity: (step === 0 || step === 2) ? 0 : 1,
  });
  const gridProps = useSpring({
    delay: (step === 1) ? 500 : 0,
    opacity: (step > 1) ? 1 : 0,
    from: {
      opacity: 0
    }
  });
  const cursorProps = useSpring({
    delay: 300,
    d: cursorDs[step],
    from: {
      d: cursorDs[0]
    }
  });
  const valuesProps = useSpring({
    delay: (step === 2) ? 150 : 0,
    opacity: (step > 2) ? 1 : 0,
    from: {
      opacity: 0,
    }
  });

  const snackbarSprings = useSprings(snackbarTexts.length, snackbarTexts.map((text, index) => {
    const currentState = step - index;
    return {
      opacity: (currentState > 0) ? 1 : 0,
      delay: (currentState > 0) ? 500 : 0,
      rectY: (currentState > 0) ? snackbarYs[currentState] : snackbarYs[0],
      textTransform: `translate(150 ${(currentState > 0) ? snackbarTextYs[currentState] : snackbarTextYs[0]})`,
    }
  }))

  function handlerStepper() {
    setStep((step) => {
      if (step === 4) return 0
      else return step + 1;
    })
  }

  React.useEffect(() => {
    timeRef.current = setTimeout(handlerStepper, 2000);
    return () => {
      clearTimeout(timeRef.current);
    }
  })

  return (
    <animated.svg 
      id="main" 
      xmlns="http://www.w3.org/2000/svg" 
      viewBox="0 0 224.118 458.127" 
      height="100%"
      style={rootProps}
      onClick={handlerStepper}>
      <defs>
        <style>{`
          #main {
            cursor: pointer;
          }
          
          .cls-1, .cls-2, .cls-3 {
            fill: none;
            stroke: ${themeType === 'light' ? '#212121' : '#FFF'};
            stroke-miterlimit: 10;
          }
          
          #cursor {
            fill: ${themeType === 'light' ? '#212121' : '#FFF'};
          }

          .cls-4, .cls-8 {
            font-family: Roboto-Regular, Roboto;
            fill: ${themeType === 'light' ? '#212121' : '#FFF'};
          }

          .cls-1 {
            stroke-width: 4px;
          }

          .cls-2 {
            stroke-width: 0.5px;
          }

          .cls-3 {
            stroke-width: 2.5px;
          }

          .cls-4 {
            isolation: isolate;
            font-size: 10.278px;
          }

          .cls-5 {
            fill: #424242;
          }

          .cls-6, .cls-8 {
            fill: #fff;
          }

          .cls-7 {
            fill: #696969;
          }

          .cls-8 {
            font-size: 13px;
          }

          .cls-11, .cls-9 {
            fill: #d3d3d3;
          }

          .cls-10 {
            fill: tomato;
          }

          .cls-11, .cls-12, .cls-13 {
            fill-rule: evenodd;
          }

          .cls-13 {
            fill: #3d3942;
          }

          .cls-14 {
            fill: #003ba7;
          }

          .cls-15 {
            fill: #232323;
            stroke: #555;
            stroke-width: 2.06px;
          }

          .cls-16 {
            fill: #212121;
          }

          .cls-17 {
            fill: #646464;
          }
    
          .cls-18 {
            font-family: Roboto-Regular, Roboto;
            font-size: 12px;
            fill: #FFFFFF;
          }


        `}
        </style>
      </defs>
      <title>basics-demo</title>
      <rect 
        id="bg-3" 
        data-name="bg" 
        x="10.134" y="54.534" 
        width="199.939" height="375.702"
        fill={themeType === 'light' ? '#FFF' : '#303030'}
      />
      <animated.g id="grid" style={gridProps}>
        <g id="grid-2" data-name="grid">
          <rect id="outline" className="cls-1" x="17.604" y="136.564" width="185" height="185" rx="1.233"/>
          <g id="horizontals">
            <line className="cls-2" x1="17.604" y1="157.119" x2="202.604" y2="157.119"/>
            <line className="cls-2" x1="17.604" y1="177.675" x2="202.604" y2="177.675"/>
            <line className="cls-3" x1="17.604" y1="198.23" x2="202.604" y2="198.23"/>
            <line className="cls-2" x1="17.604" y1="218.786" x2="202.604" y2="218.786"/>
            <line className="cls-2" x1="17.604" y1="239.341" x2="202.604" y2="239.341"/>
            <line className="cls-3" x1="17.604" y1="259.897" x2="202.604" y2="259.897"/>
            <line className="cls-2" x1="17.604" y1="280.453" x2="202.604" y2="280.453"/>
            <line className="cls-2" x1="17.604" y1="301.008" x2="202.604" y2="301.008"/>
          </g>
          <g id="verticals">
            <line className="cls-2" x1="38.16" y1="136.564" x2="38.16" y2="321.564"/>
            <line className="cls-2" x1="58.715" y1="136.564" x2="58.715" y2="321.564"/>
            <line className="cls-3" x1="79.271" y1="136.564" x2="79.271" y2="321.564"/>
            <line className="cls-2" x1="99.826" y1="136.564" x2="99.826" y2="321.564"/>
            <line className="cls-2" x1="120.382" y1="136.564" x2="120.382" y2="321.564"/>
            <line className="cls-3" x1="140.938" y1="136.564" x2="140.938" y2="321.564"/>
            <line className="cls-2" x1="161.493" y1="136.564" x2="161.493" y2="321.564"/>
            <line className="cls-2" x1="182.049" y1="136.564" x2="182.049" y2="321.564"/>
          </g>
        </g>
        <animated.g id="values" style={valuesProps}>
          <text className="cls-4" transform="translate(45.553 150.543)">6</text>
          <text className="cls-4" transform="translate(66.107 150.543)">5</text>
          <text className="cls-4" transform="translate(86.664 150.543)">1</text>
          <text className="cls-4" transform="translate(148.332 150.543)">7</text>
          <text className="cls-4" transform="translate(168.885 150.543)">4</text>
          <text className="cls-4" transform="translate(189.442 150.543)">9</text>
          <text className="cls-4" transform="translate(45.553 171.097)">7</text>
          <text className="cls-4" transform="translate(66.107 171.097)">4</text>
          <text className="cls-4" transform="translate(86.664 171.097)">5</text>
          <text className="cls-4" transform="translate(107.219 171.097)">9</text>
          <text className="cls-4" transform="translate(148.332 171.097)">6</text>
          <text className="cls-4" transform="translate(168.885 171.097)">1</text>
          <text className="cls-4" transform="translate(189.442 171.097)">2</text>
          <text className="cls-4" transform="translate(45.553 191.652)">2</text>
          <text className="cls-4" transform="translate(107.219 191.652)">6</text>
          <text className="cls-4" transform="translate(148.332 191.652)">3</text>
          <text className="cls-4" transform="translate(168.885 191.652)">5</text>
          <text className="cls-4" transform="translate(45.553 212.21)">9</text>
          <text className="cls-4" transform="translate(66.107 212.21)">6</text>
          <text className="cls-4" transform="translate(86.664 212.21)">8</text>
          <text className="cls-4" transform="translate(107.219 212.21)">7</text>
          <text className="cls-4" transform="translate(189.442 212.21)">5</text>
          <text className="cls-4" transform="translate(24.997 232.765)">5</text>
          <text className="cls-4" transform="translate(168.885 232.765)">7</text>
          <text className="cls-4" transform="translate(189.442 232.765)">6</text>
          <text className="cls-4" transform="translate(24.997 253.32)">7</text>
          <text className="cls-4" transform="translate(66.107 253.32)">3</text>
          <text className="cls-4" transform="translate(107.219 253.32)">5</text>
          <text className="cls-4" transform="translate(127.775 253.32)">6</text>
          <text className="cls-4" transform="translate(24.997 273.877)">6</text>
          <text className="cls-4" transform="translate(45.553 273.877)">5</text>
          <text className="cls-4" transform="translate(66.107 273.877)">8</text>
          <text className="cls-4" transform="translate(86.664 273.877)">4</text>
          <text className="cls-4" transform="translate(24.997 294.432)">4</text>
          <text className="cls-4" transform="translate(45.553 294.432)">3</text>
          <text className="cls-4" transform="translate(107.219 294.432)">1</text>
          <text className="cls-4" transform="translate(127.775 294.432)">5</text>
          <text className="cls-4" transform="translate(148.332 294.432)">8</text>
          <text className="cls-4" transform="translate(24.997 314.987)">9</text>
          <text className="cls-4" transform="translate(45.553 314.987)">1</text>
          <text className="cls-4" transform="translate(86.664 314.987)">6</text>
          <text className="cls-4" transform="translate(107.219 314.987)">8</text>
          <text className="cls-4" transform="translate(148.332 314.987)">5</text>
          <text className="cls-4" transform="translate(189.442 314.987)">4</text>
        </animated.g>
      </animated.g>
      <g id="drawer">
        <animated.rect 
          id="bg" 
          className="cls-5" 
          x="10.134" y="54.534" 
          width="44.571" height="375.702"
          style={drawerProps} 
        />
        <animated.path 
          id="export" 
          className="cls-6" 
          d="M176.486,202.611a6.328,6.328,0,0,0-6.125-5.285,6.217,6.217,0,0,0-5.541,3.535,5.267,5.267,0,0,0,.541,10.465H176.2a4.374,4.374,0,0,0,.291-8.715Zm-1.958,2.59-4.167,4.375L166.2,205.2h2.5v-3.5h3.333v3.5Z" 
          transform="translate(-137.941 -20.936)"
          style={drawerProps}
        />
        <animated.path 
          id="add" 
          className="cls-6" 
          d="M175.852,104.807c-8.016-6.123-17.1,2.965-10.981,10.982C172.887,121.912,181.976,112.824,175.852,104.807Zm-1.741,6.241h-3v3h-1.5v-3h-3v-1.5h3v-3h1.5v3h3Z" 
          transform="translate(-137.941 -20.936)"
          style={drawerProps}
        />
        <animated.path 
          id="save" 
          className="cls-6" 
          d="M174.528,149.812H162.861v15h15V153.145ZM172.2,162.481a2.6,2.6,0,0,1-3.671-3.671A2.6,2.6,0,0,1,172.2,162.481Zm.664-7.669h-8.333v-3.333h8.333Z" 
          transform="translate(-137.941 -20.936)"
          style={drawerProps}
        />
      </g>
      <g id="appbar">
        <rect id="bg-2" data-name="bg" className="cls-7" x="10.134" y="30.265" width="199.939" height="24.269"/>
        <text className="cls-8" transform="translate(54.706 47.048)">pqSudoku</text>
        <path id="drawerIcon" className="cls-6" d="M163.42,68.343H177.3V66.676H163.42Zm0-4.167H177.3V62.51H163.42Zm0-5.833V60.01H177.3V58.343Z" transform="translate(-137.941 -20.936)"/>
      </g>
      <g id="snackbars">
        {
          snackbarSprings.map((props, index) => (
            <React.Fragment key={`snackbar-${index}`}>
              <animated.rect 
                className="cls-17"
                x="140"
                y={props.rectY}
                width="65"
                height="18.882"
                rx="3"
                opacity={props.opacity}
              />
              <animated.text
                className="cls-18"
                transform={props.textTransform}
                opacity={props.opacity}
              >
                {snackbarTexts[index]}
              </animated.text>
            </React.Fragment>
          ))
        }
      </g>
      <animated.path 
        id="cursor"
        transform="translate(-137.941 -20.936)"
        d={cursorProps.d}
      />
      <g id="pixel">
        <path id="volume-btns" className="cls-9" d="M358.71,191.281h1.811a1.539,1.539,0,0,1,1.538,1.538v55.643A1.539,1.539,0,0,1,360.521,250H358.71a1.539,1.539,0,0,1-1.538-1.538V192.819A1.539,1.539,0,0,1,358.71,191.281Z" transform="translate(-137.941 -20.936)"/>
        <path id="power-btn" className="cls-10" d="M358.256,127.857h2.72a1.084,1.084,0,0,1,1.083,1.084v26.952a1.083,1.083,0,0,1-1.083,1.083h-2.72a1.084,1.084,0,0,1-1.084-1.083V128.941A1.085,1.085,0,0,1,358.256,127.857Z" transform="translate(-137.941 -20.936)"/>
        <path id="outer-frame" className="cls-11" d="M160.037,20.936H337.519a22.107,22.107,0,0,1,22.1,22.1V456.967a22.107,22.107,0,0,1-22.1,22.1H160.037a22.107,22.107,0,0,1-22.1-22.1V43.032A22.107,22.107,0,0,1,160.037,20.936Zm.9,2.091H336.01a21.138,21.138,0,0,1,21.128,21.127V455.7a21.138,21.138,0,0,1-21.128,21.128H160.939A21.138,21.138,0,0,1,139.812,455.7V44.154A21.137,21.137,0,0,1,160.939,23.027Z" transform="translate(-137.941 -20.936)"/>
        <path id="inner-frame" className="cls-12" d="M160.939,23.027H336.01a21.138,21.138,0,0,1,21.128,21.127V455.7a21.138,21.138,0,0,1-21.128,21.128H160.939A21.138,21.138,0,0,1,139.812,455.7V44.154A21.137,21.137,0,0,1,160.939,23.027ZM157.3,51.2h181.5a9.226,9.226,0,0,1,9.221,9.221V441.951a9.226,9.226,0,0,1-9.221,9.222H157.3a9.225,9.225,0,0,1-9.221-9.222V60.422A9.225,9.225,0,0,1,157.3,51.2Z" transform="translate(-137.941 -20.936)"/>
        <g id="camera">
          <path className="cls-13" d="M174.772,38.028a4.32,4.32,0,0,1-8.639,0h0a4.32,4.32,0,0,1,8.639,0Z" transform="translate(-137.941 -20.936)"/>
          <path d="M173.221,38.159a2.859,2.859,0,0,1-5.717,0v0a2.859,2.859,0,0,1,5.717,0v0Z" transform="translate(-137.941 -20.936)"/>
          <path className="cls-14" d="M173.033,38.159a2.671,2.671,0,1,1-5.341,0h0a2.671,2.671,0,1,1,5.341,0Z" transform="translate(-137.941 -20.936)"/>
          <path className="cls-15" d="M172.013,38.065a1.6,1.6,0,0,1-3.207,0v0a1.6,1.6,0,0,1,3.207,0Z" transform="translate(-137.941 -20.936)"/>
          <path className="cls-6" d="M168.156,38.9a2.813,2.813,0,0,0,2.858,1.453C170.436,39.6,168.734,39.162,168.156,38.9Z" transform="translate(-137.941 -20.936)"/>
        </g>
        <rect id="bottom-grill" className="cls-16" x="68.706" y="442.034" width="84.353" height="3.353" rx="1.676"/>
        <rect id="top-grill" className="cls-16" x="68.706" y="8.891" width="84.353" height="3.353" rx="1.676"/>
      </g>
    </animated.svg>
  );
}

export default React.memo(BasicsDemoSVG);

