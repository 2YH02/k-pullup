import ReportClient from "./report-client";

const PullupReport = ({ params }: { params: { id: string } }) => {
  const { id } = params;

  console.log(id);
  return (
    <>
      <ReportClient id={~~id} lat={123} lng={123} />
    </>
  );
};

export default PullupReport;
