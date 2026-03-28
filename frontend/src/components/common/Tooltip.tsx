import React from 'react';
import { Tooltip as ReactTooltip } from 'react-tooltip';
// import 'react-tooltip/dist/react-tooltip.css';

interface TooltipProps {
  id: string;
  content: string;
  children: React.ReactElement;
  place?: 'top' | 'right' | 'bottom' | 'left';
}

const Tooltip: React.FC<TooltipProps> = ({ 
  id, 
  content, 
  children, 
  place = 'top' 
}) => {
  return (
    <>
      {React.cloneElement(children, {
        ...{
          'data-tooltip-id': id,
          'data-tooltip-content': content,
          'data-tooltip-place': place
        }
      })}
      <ReactTooltip 
        id={id} 
        style={{ 
          backgroundColor: '#1C2128', 
          color: '#FFFFFF', 
          borderRadius: '8px',
          padding: '8px 12px',
          fontSize: '12px',
          fontFamily: 'Inter, sans-serif',
          fontWeight: 500,
          zIndex: 10000
        }}
      />
    </>
  );
};

export default Tooltip;
