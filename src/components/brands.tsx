import React, { useEffect, useState } from "react";
import { FormattedMessage } from "react-intl";
import generateMockData from "../lib/generateMockData";
import mapGraphData from "../lib/mapGraphData";
import mapGridData from "../lib/mapGridData";
import { BrandDetails } from "../routes";
import Graph from "./graph/Graph";
import TopList from "./table/TopList";

export { getStaticProps, getStaticPaths } from "../translations/getStaticPath";

const Brands = () => {
  const [graphData, setGraphData] = useState([]);
  const [gridData, setGridData] = useState([]);
  useEffect(() => {
    const res = mapGraphData(generateMockData());
    setGraphData(res);
    setGridData(mapGridData(res));
  }, []);

  return (
    <>
      <Graph data={graphData.slice(0, 5)} />
      <TopList
        getDetailsLink={(row) => ({
          pathname: BrandDetails.href,
          query: { brand: row.name },
        })}
        title={<FormattedMessage defaultMessage="Märken" />}
        rows={gridData}
      />
    </>
  );
};

export default Brands;
