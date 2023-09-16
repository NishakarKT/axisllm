import { useState, useEffect, memo } from "react";
import { Responsive, WidthProvider } from "react-grid-layout";
// vars
const CHART_HEIGHT = 360;

const ResponsiveReactGridLayout = WidthProvider(Responsive);

const Charts = ({ charts }) => {
  console.log("charts", charts);
  const [layouts, setLayouts] = useState({});
  const [currentBreakpoint, setCurrentBreakpoint] = useState("lg");
  const [mounted, setMounted] = useState(false);
  const [toolbox, setToolbox] = useState({ lg: [] });

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const layouts = {
      xl: charts.map((chart, i) => {
        // 12
        return {
          x: (i % 4) * 3,
          y: i / 4,
          w: 3,
          h: 1,
          maxH: 2,
          i: i.toString(),
        };
      }),
      lg: charts.map((chart, i) => {
        // 12
        return {
          x: (i % 3) * 4,
          y: i / 3,
          w: 4,
          h: 1,
          maxH: 2,
          i: i.toString(),
        };
      }),
      md: charts.map((chart, i) => {
        // 10
        return {
          x: (i % 2) * 5,
          y: i / 2,
          w: 5,
          h: 1,
          maxH: 2,
          i: i.toString(),
        };
      }),
      sm: charts.map((chart, i) => {
        // 6
        return {
          x: 0,
          y: i,
          w: 6,
          h: 1,
          maxH: 2,
          i: i.toString(),
        };
      }),
      xs: charts.map((chart, i) => {
        // 4
        return {
          x: 0,
          y: i,
          w: 4,
          h: 1,
          maxH: 2,
          i: i.toString(),
        };
      }),
    };
    setTimeout(() => setLayouts(layouts), 0);
  }, [charts]);

  return (
    <ResponsiveReactGridLayout
      style={{ overflowY: "hidden" }}
      className="layout"
      rowHeight={CHART_HEIGHT}
      cols={{ xl: 12, lg: 12, md: 10, sm: 6, xs: 4 }}
      breakpoints={{ xl: 1536, lg: 1200, md: 900, sm: 600, xs: 0 }}
      layouts={layouts}
      measureBeforeMount={false}
      useCSSTransforms={mounted}
      onLayoutChange={(layout, layouts) => setLayouts({ ...layouts })}
      onBreakpointChange={(breakpoint) => {
        setCurrentBreakpoint(breakpoint);
        setToolbox({
          ...toolbox,
          [breakpoint]: toolbox[breakpoint] || toolbox[currentBreakpoint] || [],
        });
      }}
    >
      {charts.map((chart, i) => {
        return (
          <div key={i}>
            <chart.component data={chart.data} x={chart.x} title={chart.title} delay={chart.delay} height={chart.height} />
          </div>
        );
      })}
    </ResponsiveReactGridLayout>
  );
};

export default memo(Charts);
