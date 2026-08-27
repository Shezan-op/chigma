import React from 'react';
import type { ChigmaNode } from '../../models/node';
import {
  RectangleRenderer,
  EllipseRenderer,
  LineRenderer,
  ArrowRenderer,
  PolygonRenderer,
  PencilRenderer
} from './ShapeRenderers';
import { TextRenderer } from './TextRenderer';
import { ImageRenderer } from './ImageRenderer';
import { IconRenderer } from './IconRenderer';
import { SvgRenderer } from './SvgRenderer';
import {
  BarChartRenderer,
  LineChartRenderer,
  PieChartRenderer,
  DonutChartRenderer
} from './ChartRenderers';
import {
  ButtonRenderer,
  InputRenderer,
  TextareaRenderer,
  CheckboxRenderer,
  RadioRenderer,
  ToggleRenderer,
  DropdownRenderer,
  NavbarRenderer,
  SidebarRenderer,
  CardRenderer,
  AvatarRenderer,
  BadgeRenderer,
  TableRenderer,
  TabsRenderer,
  BreadcrumbRenderer,
  ProgressRenderer,
  SliderRenderer,
  PaginationRenderer,
  ModalRenderer,
  ToastRenderer
} from './WireframeRenderers';
import { FrameRenderer } from './FrameRenderer';
import { GroupRenderer } from './GroupRenderer';

interface NodeRendererProps {
  node: ChigmaNode;
}

export const NodeRenderer: React.FC<NodeRendererProps> = React.memo(({ node }) => {
  if (!node.visible) return null;

  const { x = 0, y = 0, width = 100, height = 100, rotation = 0, opacity = 1 } = node;

  const cx = width / 2;
  const cy = height / 2;
  const transform = rotation ? `translate(${x}, ${y}) rotate(${rotation} ${cx} ${cy})` : `translate(${x}, ${y})`;

  const renderContent = () => {
    switch (node.type) {
      // Shapes
      case 'rectangle':
        return <RectangleRenderer node={node} />;
      case 'ellipse':
        return <EllipseRenderer node={node} />;
      case 'line':
        return <LineRenderer node={node} />;
      case 'arrow':
        return <ArrowRenderer node={node} />;
      case 'polygon':
        return <PolygonRenderer node={node} />;
      case 'pencil':
        return <PencilRenderer node={node} />;

      // Vector Assets & Icons
      case 'icon':
        return <IconRenderer node={node as any} />;
      case 'svg':
        return <SvgRenderer node={node as any} />;

      // Text
      case 'text':
        return <TextRenderer node={node} />;

      // Containers
      case 'frame':
        return <FrameRenderer node={node} />;
      case 'group':
        return <GroupRenderer node={node} />;

      // Media
      case 'image':
        return <ImageRenderer node={node} />;

      // Charts
      case 'bar-chart':
        return <BarChartRenderer node={node} />;
      case 'line-chart':
        return <LineChartRenderer node={node} />;
      case 'pie-chart':
        return <PieChartRenderer node={node} />;
      case 'donut-chart':
        return <DonutChartRenderer node={node} />;

      // Wireframe components
      case 'button':
        return <ButtonRenderer node={node} />;
      case 'input':
        return <InputRenderer node={node} />;
      case 'textarea':
        return <TextareaRenderer node={node} />;
      case 'checkbox':
        return <CheckboxRenderer node={node} />;
      case 'radio':
        return <RadioRenderer node={node} />;
      case 'toggle':
        return <ToggleRenderer node={node} />;
      case 'dropdown':
        return <DropdownRenderer node={node} />;
      case 'navbar':
        return <NavbarRenderer node={node} />;
      case 'sidebar':
        return <SidebarRenderer node={node} />;
      case 'card':
        return <CardRenderer node={node} />;
      case 'avatar':
        return <AvatarRenderer node={node} />;
      case 'badge':
        return <BadgeRenderer node={node} />;
      case 'table':
        return <TableRenderer node={node} />;
      case 'tabs':
        return <TabsRenderer node={node} />;
      case 'breadcrumb':
        return <BreadcrumbRenderer node={node} />;
      case 'progress':
        return <ProgressRenderer node={node} />;
      case 'slider':
        return <SliderRenderer node={node} />;
      case 'pagination':
        return <PaginationRenderer node={node} />;
      case 'modal':
        return <ModalRenderer node={node} />;
      case 'toast':
        return <ToastRenderer node={node} />;

      default:
        return null;
    }
  };

  return (
    <g
      id={`svg_node_${node.id}`}
      data-node-id={node.id}
      transform={transform}
      opacity={opacity}
      style={{ pointerEvents: 'all' }}
    >
      {renderContent()}
    </g>
  );
});
