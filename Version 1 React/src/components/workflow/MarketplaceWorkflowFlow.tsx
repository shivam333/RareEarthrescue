import { useMemo } from "react";
import { motion } from "motion/react";
import {
  Background,
  Controls,
  Edge,
  MarkerType,
  MiniMap,
  Node,
  NodeProps,
  Position,
  ReactFlow,
  ReactFlowProvider,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";

type WorkflowStep = {
  title: string;
  body: string;
};

type WorkflowNodeData = {
  title: string;
  body: string;
  step: number;
};

function WorkflowNode(props: NodeProps) {
  const data = props.data as WorkflowNodeData;
  return (
    <div>
      <span className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-[#ddcfbc] bg-white/88 font-display text-sm font-bold text-[#9a7337]">
        {data.step}
      </span>
      <strong className="mt-4 block font-display text-[1.02rem] tracking-[-0.03em] text-[#11283d]">
        {data.title}
      </strong>
      <p className="mt-3 text-sm leading-7 text-[#5d6c79]">{data.body}</p>
    </div>
  );
}

function buildNodes(steps: ReadonlyArray<WorkflowStep>): Node[] {
  return steps.map((step, index) => ({
    id: String(index + 1),
    position: { x: index * 270, y: index % 2 === 0 ? 30 : 190 },
    sourcePosition: Position.Right,
    targetPosition: Position.Left,
    data: { title: step.title, body: step.body, step: index + 1 },
    draggable: false,
    selectable: false,
    style: {
      width: 230,
      borderRadius: 24,
      border: "1px solid rgba(216, 207, 191, 0.92)",
      background: "linear-gradient(180deg, rgba(255,252,247,0.96), rgba(246,239,227,0.92))",
      boxShadow: "0 18px 55px rgba(46,41,31,0.08)",
      padding: "18px 18px 16px",
    },
    type: "workflow",
  }));
}

function buildEdges(steps: ReadonlyArray<WorkflowStep>): Edge[] {
  return steps.slice(0, -1).map((_, index) => ({
    id: `edge-${index + 1}-${index + 2}`,
    source: String(index + 1),
    target: String(index + 2),
    type: "smoothstep",
    animated: true,
    markerEnd: { type: MarkerType.ArrowClosed, color: "#b88b3c" },
    style: {
      stroke: "#b88b3c",
      strokeWidth: 2.2,
    },
  }));
}

export function MarketplaceWorkflowFlow({
  steps,
  audienceLabel,
}: {
  steps: ReadonlyArray<WorkflowStep>;
  audienceLabel: string;
}) {
  const nodes = useMemo(() => buildNodes(steps), [steps]);
  const edges = useMemo(() => buildEdges(steps), [steps]);
  const nodeTypes = useMemo(() => ({ workflow: WorkflowNode }), []);

  return (
    <motion.div
      initial={{ opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.45 }}
      className="overflow-hidden rounded-[30px] border border-[#d8cfbf] bg-[linear-gradient(180deg,rgba(255,252,247,0.92),rgba(244,236,224,0.88))] shadow-[0_24px_80px_rgba(46,41,31,0.08)]"
    >
      <div className="flex items-center justify-between border-b border-[#e0d7c9] px-5 py-4">
        <div>
          <p className="text-[0.72rem] font-bold uppercase tracking-[0.18em] text-[#8a7b65]">
            Workflow diagram
          </p>
          <h3 className="mt-2 font-display text-[1.2rem] tracking-[-0.04em] text-[#2f3426]">
            {audienceLabel}
          </h3>
        </div>
        <span className="rounded-full border border-[#ddd4c7] bg-white/82 px-4 py-2 text-[0.72rem] font-bold uppercase tracking-[0.14em] text-[#8d6d39]">
          React Flow
        </span>
      </div>

      <div className="h-[420px]">
        <ReactFlowProvider>
          <ReactFlow
            nodes={nodes}
            edges={edges}
            nodeTypes={nodeTypes}
            fitView
            fitViewOptions={{ padding: 0.12 }}
            nodesConnectable={false}
            nodesDraggable={false}
            elementsSelectable={false}
            panOnDrag={false}
            zoomOnScroll={false}
            zoomOnPinch={false}
            zoomOnDoubleClick={false}
            proOptions={{ hideAttribution: true }}
          >
            <MiniMap
              pannable={false}
              zoomable={false}
              className="!hidden xl:!block"
              nodeColor={() => "#d6c5aa"}
              maskColor="rgba(255,250,242,0.78)"
            />
            <Controls showInteractive={false} className="!shadow-none" />
            <Background gap={24} color="rgba(104,90,59,0.07)" />
          </ReactFlow>
        </ReactFlowProvider>
      </div>
    </motion.div>
  );
}
