import React, { useEffect, useState } from "react";
import { FormattedMessage } from "react-intl";
import generateMockData from "../lib/generateMockData";
import mapGraphData from "../lib/mapGraphData";
import mapGridData from "../lib/mapGridData";
import { UserDetails } from "../routes";
import Graph from "./graph/Graph";
import TopList from "./table/TopList";

export { getStaticProps, getStaticPaths } from "../translations/getStaticPath";

const Users = () => {
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
          pathname: UserDetails.href,
          query: { user: row.name },
        })}
        title={<FormattedMessage defaultMessage="Användare" />}
        rows={gridData}
      />
    </>
  );
};

export default Users;