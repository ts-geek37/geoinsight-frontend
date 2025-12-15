"use client";
type Props = { showOpportunity: boolean };

const SegmentsLegend: React.FC<Props> = ({ showOpportunity = true }) => {
  return (
    <div className="absolute bottom-4 z-1000 left-4 bg-background backdrop-blur-sm rounded-lg shadow-card border border-border p-3">
      <p className="text-xs font-medium text-foreground mb-2">Store Segments</p>
      <div className="space-y-1.5">
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-segment-champion" />
          <span className="text-xs text-muted-foreground">Champion</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-segment-promising" />
          <span className="text-xs text-muted-foreground">Promising</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-segment-attention" />
          <span className="text-xs text-muted-foreground">Needs Attention</span>
        </div>
        {showOpportunity && (
          <div className="flex items-center gap-2 pt-1 border-t border-border">
            <span className="w-3 h-3 rounded-full bg-segment-opportunity" />
            <span className="text-xs text-muted-foreground">Opportunity</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default SegmentsLegend;
