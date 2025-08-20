import type React from 'react';

export type SectionLayout = 'grid' | 'flex';

export interface SectionGridOptions {
  cols?: number;
  smCols?: number;
  mdCols?: number;
  lgCols?: number;
  xlCols?: number;
  gap?: string; // Tailwind gap classes like 'gap-4' (optional)
}

export interface SectionFlexOptions {
  direction?: 'row' | 'col';
  wrap?: boolean;
  gap?: string; // Tailwind gap classes like 'gap-4'
  align?: 'start' | 'center' | 'end' | 'stretch';
  justify?: 'start' | 'center' | 'between' | 'end';
}

export interface SectionBase {
  id: string;
  title?: string;
  subtitle?: string;
  variant?: 'card' | 'separator' | 'plain';
  className?: string;
  headerClassName?: string;
  contentClassName?: string;
  hidden?: boolean;
}

export interface SectionLeaf {
  key: string;
  content: React.ReactNode;
  className?: string;
  // Optional label & layout
  label?: React.ReactNode;
  labelLayout?: 'inline' | 'stacked';
  labelClassName?: string;
  valueClassName?: string;
  inlineLabelWidthClass?: string; // e.g. 'w-32' when labelLayout is 'inline'
  description?: React.ReactNode;
  span?: {
    base?: number;
    sm?: number;
    md?: number;
    lg?: number;
    xl?: number;
  };
  hidden?: boolean;
  renderKey?: string | number;
}

export interface SectionNode extends SectionBase {
  layout?: SectionLayout;
  grid?: SectionGridOptions;
  flex?: SectionFlexOptions;
  children?: Array<SectionNode | SectionLeaf>;
}

export interface SectionBuilderProps {
  sections: SectionNode[];
  renderLeaf?: (leaf: SectionLeaf) => React.ReactNode;
  className?: string;
}
