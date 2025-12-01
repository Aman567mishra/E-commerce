import React from "react";
import Footer from "./Footer";
import WaveDivider from "./WaveDivider";

const DividerFooter = ({ showFooter = true, showDivider = true }) => {
  return (
    <>
      {showDivider && <WaveDivider />}
      {showFooter && <Footer />}
    </>
  );
};

export default DividerFooter;
