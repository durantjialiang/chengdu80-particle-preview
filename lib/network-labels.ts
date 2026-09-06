export type NodeLabelAnchor = {
  id: string;
  x: number;
  y: number;
  visibility: number;
  width: number;
  labelX: number;
  labelY: number;
};

/** Greedy screen-space label packing; only labels move, campus coordinates never do.
 * The caller supplies a priority-sorted array and reuses it each frame.
 */
export function placeNetworkLabels(
  anchors: readonly NodeLabelAnchor[],
  width: number,
  height: number,
) {
  for (let i = 0; i < anchors.length; i++) {
    const item = anchors[i];
    if (item.visibility <= 0.15) continue;
    let bestPenalty = Infinity,
      bestX = 0,
      bestY = 0;
    for (let attempt = 0; attempt < 24; attempt++) {
      const lane = Math.floor(attempt / 2);
      const dy = (lane % 2 ? -1 : 1) * Math.ceil(lane / 2) * 40;
      const x = Math.max(
        8,
        Math.min(
          width - item.width - 8,
          item.x + (attempt % 2 ? -item.width - 14 : 14),
        ),
      );
      const y = Math.max(8, Math.min(height - 42, item.y - 16 + dy));
      let penalty = Math.abs(dy) * 0.08;
      for (let j = 0; j < i; j++) {
        const placed = anchors[j];
        if (placed.visibility <= 0.15) continue;
        if (
          x < placed.labelX + placed.width + 7 &&
          x + item.width + 7 > placed.labelX &&
          y < placed.labelY + 37 &&
          y + 37 > placed.labelY
        )
          penalty += 10000;
      }
      if (penalty < bestPenalty) {
        bestPenalty = penalty;
        bestX = x;
        bestY = y;
      }
      if (penalty < 10000) break;
    }
    item.labelX = bestX;
    item.labelY = bestY;
  }
  return anchors;
}
