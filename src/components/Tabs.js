import React, { useState } from 'react';
import cn from 'classnames';
import PropTypes from 'prop-types';

const Label = ({ labelId, panelId, selected, onClick, children }) => (
  <button
    role="tab"
    aria-selected={selected}
    aria-controls={panelId}
    id={labelId}
    onClick={onClick}
    className={cn('nav-item', 'nav-link', 'mr-1', {
      'border-bottom': !selected,
      active: selected
    })}
  >
    {children}
  </button>
);

const Panel = ({ selected, panelId, labelId, children }) => (
  <div
    aria-hidden={!selected}
    aria-labelledby={labelId}
    className={cn('tab-pane', { active: selected })}
    id={panelId}
    key={labelId}
    role="tabpanel"
  >
    {selected ? children : null}
  </div>
);

Panel.propTypes = {
  selected: PropTypes.bool.isRequired,
  panelId: PropTypes.string.isRequired,
  labelId: PropTypes.string.isRequired,
  children: PropTypes.node.isRequired
};

const Tabs = ({ uuid, labels, children }) => {
  const [activeTab, setActiveTab] = useState(0);

  return (
    <div className="tabs">
      <div role="tablist" className="nav nav-tabs">
        {labels.map((label, i) => (
          <Label
            selected={activeTab === i}
            panelId={`panel-${uuid}-${i}`}
            labelId={`label-${uuid}-${i}`}
            onClick={() => setActiveTab(i)}
            key={`label-${uuid}-${i}`}
          >
            {label}
          </Label>
        ))}
      </div>
      <div role="tabpanel" className="tab-content">
        {children.map((panel, i) => (
          <Panel
            key={`panel-${uuid}-${i}`}
            selected={activeTab === i}
            panelId={`panel-${uuid}-${i}`}
            labelId={`label-${uuid}-${i}`}
          >
            {panel}
          </Panel>
        ))}
      </div>
    </div>
  );
};

Tabs.propTypes = {
  uuid: PropTypes.string.isRequired,
  labels: PropTypes.arrayOf(PropTypes.node).isRequired,
  children: PropTypes.arrayOf(PropTypes.element).isRequired
};

export default Tabs;
