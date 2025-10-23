import type {
  FieldValues,
  Path,
  Control,
  UseFormGetValues,
} from 'react-hook-form';
import type { SectionNode } from '../../section/types';
import { FormBuilderField } from './FormBuilderField';
import type {
  FormBuilderFieldConfig,
  FormBuilderSectionConfig,
} from '../types';
import { cn } from '../../../../shadcn/lib/utils';

interface BuildSectionNodesOptions<TFieldValues extends FieldValues> {
  sections: Array<FormBuilderSectionConfig<TFieldValues>>;
  control: Control<TFieldValues>;
  handleFieldDependencies: (
    field: FormBuilderFieldConfig<TFieldValues, string | Path<TFieldValues>>,
  ) => { disabled?: boolean; hidden?: boolean } | Record<string, never>;
  handleFieldChange: (
    field: FormBuilderFieldConfig<TFieldValues, string | Path<TFieldValues>>,
    value: unknown,
    ...extras: unknown[]
  ) => void;
  onFieldChange?: (
    name: Path<TFieldValues> | string,
    value: unknown,
    allValues: TFieldValues,
  ) => void;
  getValues: UseFormGetValues<TFieldValues>;
}

export function buildSectionNodes<TFieldValues extends FieldValues>(
  options: BuildSectionNodesOptions<TFieldValues>,
): SectionNode[] {
  const {
    sections,
    control,
    handleFieldDependencies,
    handleFieldChange,
    onFieldChange,
    getValues,
  } = options;

  const buildLeavesFromFields = (
    fields?: Array<
      FormBuilderFieldConfig<TFieldValues, string | Path<TFieldValues>>
    >,
  ): SectionNode['children'] =>
    (fields ?? [])
      .map((field) => {
        const fieldState = handleFieldDependencies(field);

        const isHiddenType = field.type === 'hidden';
        if (!isHiddenType && (field.hidden || fieldState.hidden)) return null;
        if (fieldState.hidden) return null;

        const spanMd = Math.max(1, Math.min(12, field.gridCols ?? 1));

        return {
          key: field.name,
          span: isHiddenType ? undefined : { base: 1, md: spanMd },
          className: cn(
            field.wrapperClassName,
            isHiddenType ? 'hidden' : undefined,
          ),
          hidden: isHiddenType ? false : field.hidden,
          content: (
            <FormBuilderField
              key={field.name}
              field={{
                ...field,
                disabled: field.disabled || fieldState.disabled,
              }}
              control={control}
              onChange={(value, ...extras) => {
                handleFieldChange(field, value, ...extras);
                onFieldChange?.(
                  field.name as Path<TFieldValues> | string,
                  value,
                  getValues(),
                );
              }}
              onFieldChange={onFieldChange}
            />
          ),
        };
      })
      .filter(Boolean) as SectionNode['children'];

  const buildSectionNode = (
    section: FormBuilderSectionConfig<TFieldValues>,
    sectionIndex: number,
  ): SectionNode => {
    const baseNode: SectionNode = {
      id: section.id ?? `section-${sectionIndex}`,
      title: section.title,
      subtitle: section.description,
      variant: section.variant ?? 'plain',
      className: section.className,
      layout:
        section.layout ??
        (section.tabs && section.tabs.length > 0 ? 'tabs' : 'grid'),
      grid: section.grid ?? { cols: 1, mdCols: 2, gap: 'gap-4' },
      flex: section.flex,
      hidden: section.hidden,
    };

    if (baseNode.layout === 'tabs' && section.tabs && section.tabs.length > 0) {
      baseNode.defaultTabId = section.defaultTabId ?? section.tabs[0]?.id;
      baseNode.tabsListClassName = section.tabsListClassName;
      baseNode.tabsContentClassName = section.tabsContentClassName;
      baseNode.tabs = section.tabs.map((tab, _tabIdx) => {
        const nestedNodes = tab.sections.map((subSection, subIdx) =>
          buildSectionNode(subSection, subIdx),
        );
        const containerNode: SectionNode = {
          id: `${baseNode.id}-tab-${tab.id}`,
          variant: 'plain',
          layout: 'grid',
          grid: section.grid ?? { cols: 1, mdCols: 2, gap: 'gap-4' },
          children: nestedNodes,
        };
        return {
          id: tab.id,
          label: tab.label,
          className: tab.className,
          contentClassName: tab.contentClassName,
          node: containerNode,
        };
      });
      return baseNode;
    }

    baseNode.children = buildLeavesFromFields(section.fields);
    return baseNode;
  };

  return sections.map((section, sectionIndex) =>
    buildSectionNode(section, sectionIndex),
  );
}
