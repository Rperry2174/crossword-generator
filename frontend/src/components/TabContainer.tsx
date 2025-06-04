import React, { useState } from 'react';

interface Theme {
  colors: any;
  typography: any;
  spacing: any;
  borderRadius: any;
  shadow: any;
}

interface Tab {
  id: string;
  label: string;
  content: React.ReactNode;
  icon?: string;
}

interface TabContainerProps {
  tabs: Tab[];
  defaultTab?: string;
  theme: Theme;
}

const TabContainer: React.FC<TabContainerProps> = ({ tabs, defaultTab, theme }) => {
  const [activeTab, setActiveTab] = useState(defaultTab || tabs[0]?.id);

  return (
    <div style={{ width: '100%' }}>
      {/* Tab Headers */}
      <div style={{
        display: 'flex',
        backgroundColor: theme.colors.surface,
        borderRadius: `${theme.borderRadius.lg} ${theme.borderRadius.lg} 0 0`,
        padding: theme.spacing.xs,
        gap: theme.spacing.xs
      }}>
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: theme.spacing.sm,
              padding: `${theme.spacing.md} ${theme.spacing.lg}`,
              border: 'none',
              backgroundColor: activeTab === tab.id ? theme.colors.background : 'transparent',
              cursor: 'pointer',
              fontSize: theme.typography.fontSize.sm,
              fontWeight: activeTab === tab.id ? theme.typography.fontWeight.semibold : theme.typography.fontWeight.medium,
              color: activeTab === tab.id ? theme.colors.primary : theme.colors.text.secondary,
              borderRadius: theme.borderRadius.md,
              transition: 'all 0.2s ease',
              boxShadow: activeTab === tab.id ? theme.shadow.sm : 'none',
              position: 'relative'
            }}
            onMouseEnter={(e) => {
              if (activeTab !== tab.id) {
                e.currentTarget.style.backgroundColor = theme.colors.surfaceHover;
                e.currentTarget.style.color = theme.colors.text.primary;
              }
            }}
            onMouseLeave={(e) => {
              if (activeTab !== tab.id) {
                e.currentTarget.style.backgroundColor = 'transparent';
                e.currentTarget.style.color = theme.colors.text.secondary;
              }
            }}
          >
            {tab.icon && (
              <span style={{
                fontSize: theme.typography.fontSize.base,
                opacity: activeTab === tab.id ? 1 : 0.7
              }}>
                {tab.icon}
              </span>
            )}
            <span>{tab.label}</span>
            {activeTab === tab.id && (
              <div style={{
                position: 'absolute',
                bottom: '-1px',
                left: '50%',
                transform: 'translateX(-50%)',
                width: '12px',
                height: '2px',
                backgroundColor: theme.colors.primary,
                borderRadius: '1px'
              }} />
            )}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div style={{
        backgroundColor: theme.colors.background,
        borderRadius: `0 0 ${theme.borderRadius.lg} ${theme.borderRadius.lg}`,
        minHeight: '200px'
      }}>
        {tabs.find(tab => tab.id === activeTab)?.content}
      </div>
    </div>
  );
};

export default TabContainer;