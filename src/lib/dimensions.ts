export const DIMENSIONS = [
  // Layer 1: 智能座舱 & 软件体验
  { id: 'cockpit', name: '座舱体验', layer: 1 as const, weight: 1.2 },
  { id: 'software', name: '软件功能', layer: 1 as const, weight: 1.1 },
  { id: 'interaction', name: '交互设计', layer: 1 as const, weight: 1.15 },
  { id: 'voice', name: '语音助手', layer: 1 as const, weight: 1.25 },
  { id: 'navigation', name: '导航', layer: 1 as const, weight: 1.0 },
  { id: 'entertainment', name: '娱乐系统', layer: 1 as const, weight: 0.9 },
  { id: 'performance', name: '车机性能', layer: 1 as const, weight: 1.1 },
  // Layer 2: 辅助驾驶
  { id: 'adas', name: '辅助驾驶', layer: 2 as const, weight: 1.0 },
  // Layer 3: 整车基础
  { id: 'comfort', name: '舒适性', layer: 3 as const, weight: 0.8 },
  { id: 'power', name: '动力', layer: 3 as const, weight: 0.7 },
  { id: 'range', name: '续航/能耗', layer: 3 as const, weight: 0.85 },
  { id: 'safety', name: '安全性', layer: 3 as const, weight: 1.0 },
  { id: 'space', name: '空间', layer: 3 as const, weight: 0.7 },
  { id: 'exterior', name: '外观', layer: 3 as const, weight: 0.6 },
  { id: 'price', name: '价格/性价比', layer: 3 as const, weight: 0.9 },
  { id: 'service', name: '售后服务', layer: 3 as const, weight: 0.8 },
  { id: 'ota', name: 'OTA 升级', layer: 3 as const, weight: 0.95 },
];

export function getDimensionName(id: string): string {
  return DIMENSIONS.find(d => d.id === id)?.name || id;
}

export function getDimensionLayerColor(layer: number): string {
  switch (layer) {
    case 1: return '#06b6d4';
    case 2: return '#f59e0b';
    case 3: return '#10b981';
    default: return '#94a3b8';
  }
}
