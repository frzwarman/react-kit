import { memo } from 'react';
import { cn } from '../../../shadcn/lib/utils';
import type { SectionBuilderProps, SectionLeaf, SectionNode } from './types';
import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
} from '../../../shadcn/ui/tabs';
import SectionContainer from './SectionContainer';

// Tailwind-safe literal class maps (1-12)
const GRID_COLS = {
  base: {
    1: 'grid-cols-1',
    2: 'grid-cols-2',
    3: 'grid-cols-3',
    4: 'grid-cols-4',
    5: 'grid-cols-5',
    6: 'grid-cols-6',
    7: 'grid-cols-7',
    8: 'grid-cols-8',
    9: 'grid-cols-9',
    10: 'grid-cols-10',
    11: 'grid-cols-11',
    12: 'grid-cols-12',
  } as Record<number, string>,
  sm: {
    1: 'sm:grid-cols-1',
    2: 'sm:grid-cols-2',
    3: 'sm:grid-cols-3',
    4: 'sm:grid-cols-4',
    5: 'sm:grid-cols-5',
    6: 'sm:grid-cols-6',
    7: 'sm:grid-cols-7',
    8: 'sm:grid-cols-8',
    9: 'sm:grid-cols-9',
    10: 'sm:grid-cols-10',
    11: 'sm:grid-cols-11',
    12: 'sm:grid-cols-12',
  } as Record<number, string>,
  md: {
    1: 'md:grid-cols-1',
    2: 'md:grid-cols-2',
    3: 'md:grid-cols-3',
    4: 'md:grid-cols-4',
    5: 'md:grid-cols-5',
    6: 'md:grid-cols-6',
    7: 'md:grid-cols-7',
    8: 'md:grid-cols-8',
    9: 'md:grid-cols-9',
    10: 'md:grid-cols-10',
    11: 'md:grid-cols-11',
    12: 'md:grid-cols-12',
  } as Record<number, string>,
  lg: {
    1: 'lg:grid-cols-1',
    2: 'lg:grid-cols-2',
    3: 'lg:grid-cols-3',
    4: 'lg:grid-cols-4',
    5: 'lg:grid-cols-5',
    6: 'lg:grid-cols-6',
    7: 'lg:grid-cols-7',
    8: 'lg:grid-cols-8',
    9: 'lg:grid-cols-9',
    10: 'lg:grid-cols-10',
    11: 'lg:grid-cols-11',
    12: 'lg:grid-cols-12',
  } as Record<number, string>,
  xl: {
    1: 'xl:grid-cols-1',
    2: 'xl:grid-cols-2',
    3: 'xl:grid-cols-3',
    4: 'xl:grid-cols-4',
    5: 'xl:grid-cols-5',
    6: 'xl:grid-cols-6',
    7: 'xl:grid-cols-7',
    8: 'xl:grid-cols-8',
    9: 'xl:grid-cols-9',
    10: 'xl:grid-cols-10',
    11: 'xl:grid-cols-11',
    12: 'xl:grid-cols-12',
  } as Record<number, string>,
};

const COL_SPAN = {
  base: {
    1: 'col-span-1',
    2: 'col-span-2',
    3: 'col-span-3',
    4: 'col-span-4',
    5: 'col-span-5',
    6: 'col-span-6',
    7: 'col-span-7',
    8: 'col-span-8',
    9: 'col-span-9',
    10: 'col-span-10',
    11: 'col-span-11',
    12: 'col-span-12',
  } as Record<number, string>,
  sm: {
    1: 'sm:col-span-1',
    2: 'sm:col-span-2',
    3: 'sm:col-span-3',
    4: 'sm:col-span-4',
    5: 'sm:col-span-5',
    6: 'sm:col-span-6',
    7: 'sm:col-span-7',
    8: 'sm:col-span-8',
    9: 'sm:col-span-9',
    10: 'sm:col-span-10',
    11: 'sm:col-span-11',
    12: 'sm:col-span-12',
  } as Record<number, string>,
  md: {
    1: 'md:col-span-1',
    2: 'md:col-span-2',
    3: 'md:col-span-3',
    4: 'md:col-span-4',
    5: 'md:col-span-5',
    6: 'md:col-span-6',
    7: 'md:col-span-7',
    8: 'md:col-span-8',
    9: 'md:col-span-9',
    10: 'md:col-span-10',
    11: 'md:col-span-11',
    12: 'md:col-span-12',
  } as Record<number, string>,
  lg: {
    1: 'lg:col-span-1',
    2: 'lg:col-span-2',
    3: 'lg:col-span-3',
    4: 'lg:col-span-4',
    5: 'lg:col-span-5',
    6: 'lg:col-span-6',
    7: 'lg:col-span-7',
    8: 'lg:col-span-8',
    9: 'lg:col-span-9',
    10: 'lg:col-span-10',
    11: 'lg:col-span-11',
    12: 'lg:col-span-12',
  } as Record<number, string>,
  xl: {
    1: 'xl:col-span-1',
    2: 'xl:col-span-2',
    3: 'xl:col-span-3',
    4: 'xl:col-span-4',
    5: 'xl:col-span-5',
    6: 'xl:col-span-6',
    7: 'xl:col-span-7',
    8: 'xl:col-span-8',
    9: 'xl:col-span-9',
    10: 'xl:col-span-10',
    11: 'xl:col-span-11',
    12: 'xl:col-span-12',
  } as Record<number, string>,
};

function gridClasses(options: SectionNode['grid']): string {
  const cols = options?.cols ?? 1;
  const sm = options?.smCols;
  const md = options?.mdCols;
  const lg = options?.lgCols;
  const xl = options?.xlCols;
  const gap = options?.gap ?? 'gap-4';
  return cn(
    'grid',
    GRID_COLS.base[cols],
    sm ? GRID_COLS.sm[sm] : undefined,
    md ? GRID_COLS.md[md] : undefined,
    lg ? GRID_COLS.lg[lg] : undefined,
    xl ? GRID_COLS.xl[xl] : undefined,
    gap,
  );
}

function flexClasses(options: SectionNode['flex']): string {
  const direction = options?.direction ?? 'col';
  const wrap = options?.wrap ? 'flex-wrap' : 'flex-nowrap';
  const gap = options?.gap ?? 'gap-4';
  const align = options?.align ?? 'stretch';
  const justify = options?.justify ?? 'start';
  const alignClass =
    align === 'start'
      ? 'items-start'
      : align === 'center'
        ? 'items-center'
        : align === 'end'
          ? 'items-end'
          : 'items-stretch';
  const justifyClass =
    justify === 'start'
      ? 'justify-start'
      : justify === 'center'
        ? 'justify-center'
        : justify === 'between'
          ? 'justify-between'
          : 'justify-end';
  return cn('flex', `flex-${direction}`, wrap, gap, alignClass, justifyClass);
}

function leafSpanClasses(leaf: SectionLeaf): string | undefined {
  if (!leaf.span) return undefined;
  const parts: string[] = [];
  if (leaf.span.base) parts.push(COL_SPAN.base[leaf.span.base]);
  if (leaf.span.sm) parts.push(COL_SPAN.sm[leaf.span.sm]);
  if (leaf.span.md) parts.push(COL_SPAN.md[leaf.span.md]);
  if (leaf.span.lg) parts.push(COL_SPAN.lg[leaf.span.lg]);
  if (leaf.span.xl) parts.push(COL_SPAN.xl[leaf.span.xl]);
  return parts.join(' ');
}

function isLeaf(child: SectionNode | SectionLeaf): child is SectionLeaf {
  return (child as SectionLeaf).content !== undefined;
}

function shallowEqualSpan(a?: SectionLeaf['span'], b?: SectionLeaf['span']) {
  if (a === b) return true;
  if (!a || !b) return !a && !b;
  return (
    a.base === b.base &&
    a.sm === b.sm &&
    a.md === b.md &&
    a.lg === b.lg &&
    a.xl === b.xl
  );
}

function isReactElement(value: unknown): boolean {
  return (
    value !== null &&
    typeof value === 'object' &&
    '$$typeof' in (value as object)
  );
}

function shallowEqualLeaf(a: SectionLeaf, b: SectionLeaf) {
  // If renderKey is provided, use it for comparison
  if (a.renderKey !== undefined || b.renderKey !== undefined) {
    if ((a.renderKey ?? null) !== (b.renderKey ?? null)) return false;
  } else {
    // No renderKey: if content is a ReactElement, always re-render
    // (JSX creates new object refs each render, so we can't reliably compare)
    if (isReactElement(a.content) || isReactElement(b.content)) {
      return false;
    }
    // For primitives (string, number, null, undefined), compare directly
    if (a.content !== b.content) return false;
  }

  return (
    a.key === b.key &&
    a.hidden === b.hidden &&
    a.className === b.className &&
    a.labelLayout === b.labelLayout &&
    a.labelClassName === b.labelClassName &&
    a.valueClassName === b.valueClassName &&
    a.inlineLabelWidthClass === b.inlineLabelWidthClass &&
    shallowEqualSpan(a.span, b.span)
  );
}

const SectionLeafRenderer = memo(
  function SectionLeafRenderer({
    leaf,
    renderLeaf,
  }: {
    leaf: SectionLeaf;
    renderLeaf?: (leaf: SectionLeaf) => React.ReactNode;
  }) {
    if (leaf.hidden) return null;
    const span = leafSpanClasses(leaf);

    // If a custom renderLeaf is provided, let it fully control rendering
    if (renderLeaf) {
      return <div className={cn(span, leaf.className)}>{renderLeaf(leaf)}</div>;
    }

    // Default rendering with optional label support
    const hasLabel =
      leaf.label !== undefined && leaf.label !== null && leaf.label !== '';
    const layout = leaf.labelLayout ?? 'stacked';
    const labelBaseCls = 'text-xs text-muted-foreground';
    const valueBaseCls = 'text-sm leading-6';

    if (!hasLabel) {
      return (
        <div className={cn(span, leaf.className, leaf.valueClassName)}>
          {leaf.content}
        </div>
      );
    }

    if (layout === 'inline') {
      const labelWidth = leaf.inlineLabelWidthClass ?? 'w-32';
      return (
        <div className={cn(span, leaf.className, 'flex items-start gap-4')}>
          <div className={cn(labelWidth, labelBaseCls, leaf.labelClassName)}>
            {leaf.label}
          </div>
          <div className={cn('flex-1', valueBaseCls, leaf.valueClassName)}>
            {leaf.content}
            {leaf.description ? (
              <div className={cn('mt-1', labelBaseCls)}>{leaf.description}</div>
            ) : null}
          </div>
        </div>
      );
    }

    // Stacked layout
    return (
      <div className={cn(span, leaf.className, 'flex flex-col')}>
        <div className={cn(labelBaseCls, leaf.labelClassName)}>
          {leaf.label}
        </div>
        <div className={cn(valueBaseCls, leaf.valueClassName)}>
          {leaf.content}
        </div>
        {leaf.description ? (
          <div className={cn('mt-1', labelBaseCls)}>{leaf.description}</div>
        ) : null}
      </div>
    );
  },
  (prev, next) =>
    shallowEqualLeaf(prev.leaf, next.leaf) &&
    prev.renderLeaf === next.renderLeaf,
);

function SectionNodeRenderer({
  node,
  renderLeaf,
}: {
  node: SectionNode;
  renderLeaf?: (leaf: SectionLeaf) => React.ReactNode;
}) {
  if (node.hidden) return null;
  const layout = node.layout ?? 'grid';
  const containerClass =
    layout === 'grid'
      ? gridClasses(node.grid)
      : layout === 'flex'
        ? flexClasses(node.flex)
        : '';

  if (layout === 'tabs' && node.tabs && node.tabs.length > 0) {
    const defaultTabId = node.defaultTabId ?? node.tabs[0]?.id;
    return (
      <SectionContainer
        title={node.title}
        description={node.subtitle}
        variant={node.variant}
        className={node.className}
        headerClassName={node.headerClassName}
        contentClassName={node.contentClassName}
      >
        <Tabs defaultValue={defaultTabId} className={cn('space-y-2')}>
          <TabsList className={cn(node.tabsListClassName)}>
            {node.tabs.map((tab) => (
              <TabsTrigger
                key={tab.id}
                value={tab.id}
                className={cn(tab.className)}
              >
                {tab.label}
              </TabsTrigger>
            ))}
          </TabsList>
          {node.tabs.map((tab) => (
            <TabsContent
              key={tab.id}
              value={tab.id}
              className={cn(node.tabsContentClassName, tab.contentClassName)}
            >
              <SectionNodeRenderer node={tab.node} renderLeaf={renderLeaf} />
            </TabsContent>
          ))}
        </Tabs>
      </SectionContainer>
    );
  }

  return (
    <SectionContainer
      title={node.title}
      description={node.subtitle}
      variant={node.variant}
      className={node.className}
      headerClassName={node.headerClassName}
      contentClassName={node.contentClassName}
    >
      <div className={containerClass}>
        {(node.children ?? []).map((child) => {
          if (isLeaf(child)) {
            return (
              <SectionLeafRenderer
                key={child.key}
                leaf={child}
                renderLeaf={renderLeaf}
              />
            );
          }
          if ((child as SectionNode).hidden) return null;
          return (
            <div key={(child as SectionNode).id} className="col-span-full">
              <SectionNodeRenderer
                node={child as SectionNode}
                renderLeaf={renderLeaf}
              />
            </div>
          );
        })}
      </div>
    </SectionContainer>
  );
}

export default function SectionBuilder({
  sections,
  className,
  renderLeaf,
}: SectionBuilderProps) {
  return (
    <div className={cn('space-y-6', className)}>
      {sections.map((section) => (
        <SectionNodeRenderer
          key={section.id}
          node={section}
          renderLeaf={renderLeaf}
        />
      ))}
    </div>
  );
}
