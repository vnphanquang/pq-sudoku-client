import React from 'react';
import clsx from 'clsx';

const baseCellSize = 50; //px
const baseTextX = 20;
const baseTextY = 36;
//TODO: customizable styling for exports, receive styling props from ExportDialog
function SudokuSVG({
  svgRef,
  id,
  name,
  gridSize=9,
  cellsData,
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
  const endXY = startXY + baseCellSize*gridSize;

  const horizontals = [];
  const verticals = [];
  const values = [];
  
  const subGridEdge = Math.sqrt(gridSize)

  let index = 0;
  let end = 0;
  let textXY = '';
  for (let row = 0; row < gridSize; row++) {
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

    for (let col = 0; col < gridSize; col++) {
      textXY = `${baseTextX + baseCellSize * col} ${baseTextY + baseCellSize * row}`
      values.push(
        <text
          key={`value-${row+1}-${col+1}`}
          className="values"
          transform={`translate(${textXY})`}
          data-name="values"
        >
          {cellsData[row][col]}
        </text>
      )
    }
  }

  horizontals.pop();
  verticals.pop();

  return (
    <svg ref={svgRef} id={id} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 454 454">

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
          width={baseCellSize * gridSize} 
          height={baseCellSize * gridSize} 
          rx="3"
          fill={backgroundColor}
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

export default SudokuSVG;