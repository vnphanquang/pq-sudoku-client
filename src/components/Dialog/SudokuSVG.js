import React from 'react';
import clsx from 'clsx';

const baseCellSize = 50; //px
const baseTextX = 20;
const baseTextY = 36;
//TODO: customizable styling for exports, receive styling props from ExportDialog
function SudokuSVG({
  className,
  svgRef,
  id,
  name,
  size,
  cellValues,
  outlineStrokeWidth=4, 
  outlineColor='#212121',
  subgridEdgeStrokeWidth=2.5, 
  subgridEdgeColor='#212121',
  lineStrokeWidth=0.5,
  lineColor='#212121',
  valueColor='#212121',
  backgroundColor='white',
}) {

  const styles = `
.verticals, .horizontals, .subgrid-edges {
  fill: none;
  stroke-miterlimit: 10;
}

.verticals, .horizontals {
  stroke-width: ${lineStrokeWidth}px;
  stroke: ${lineColor};
}

.subgrid-edges {
  stroke-width: ${subgridEdgeStrokeWidth}px;
  stroke: ${subgridEdgeColor};
}

#outline {
  stroke-miterlimit: 10;
  stroke-width: ${outlineStrokeWidth}px;
  stroke: ${outlineColor};
}

.values {
  font-size: 25px;
  color: ${valueColor};
  font-family: "Roboto", "Helvetica", "Arial", sans-serif;
}
  `;
  const startXY = outlineStrokeWidth / 2;
  const endXY = startXY + baseCellSize*size;

  const horizontals = [];
  const verticals = [];
  const values = [];
  
  const subGridEdge = Math.sqrt(size);

  let index = 0;
  let end = 0;
  let textXY = '';
  let value = 0;
  let valueXShift = 0;
  for (let row = 0; row < size; row++) {
    index = row + 1;
    end = startXY + baseCellSize*(index)
    horizontals.push(
      <line
        key={`horizontal-${index}`}
        className={clsx('horizontals', (index % subGridEdge === 0) && 'subgrid-edges')}
        x1={`${startXY}`}
        y1={`${end}`}
        x2={`${endXY}`}
        y2={`${end}`}
      />
    )
    verticals.push(
      <line 
      key={`vertical-${index}`}
      className={clsx('verticals', (index % subGridEdge === 0) && 'subgrid-edges')}
      x1={`${end}`}
      y1={`${startXY}`}
      x2={`${end}`}
      y2={`${endXY}`}
      />
    )
    for (let col = 0; col < size; col++) {
      value = cellValues[row][col];
      if (value.length === 2) valueXShift = 10;
      textXY = `${baseTextX + baseCellSize * col - valueXShift} ${baseTextY + baseCellSize * row}`
      values.push(
        <text
          key={`value-${row+1}-${col+1}`}
          className="values"
          transform={`translate(${textXY})`}
          data-name="values"
        >
          {cellValues[row][col]}
        </text>
      )
      valueXShift = 0;
    }
  }

  horizontals.pop();
  verticals.pop();

  return (
    <svg ref={svgRef} id={id} xmlns="http://www.w3.org/2000/svg" viewBox={`0 0 ${size*baseCellSize+outlineStrokeWidth} ${size*baseCellSize+outlineStrokeWidth}`} className={className}>

      <defs>
        <style>
          {styles}
        </style>
      </defs>

      <title>{`${name}-svg-export-pqsudoku`}</title>

      <g id="grid">
        <rect 
          id="outline" 
          x={startXY} 
          y={startXY} 
          width={baseCellSize * size} 
          height={baseCellSize * size} 
          rx="3"
          // fill={backgroundColor}
          fill="transparent"
        />
        <g id="horizontals">
          {horizontals}
        </g>
        <g id="verticals">
          {verticals}
        </g>
      </g>

      <g id="values">
        {values}
      </g>

    </svg>
  )
}

export default React.memo(SudokuSVG);