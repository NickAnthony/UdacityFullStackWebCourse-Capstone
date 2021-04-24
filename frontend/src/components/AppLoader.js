import React from "react";
import Loader from "react-loader-spinner";

const AppLoader = () => {
  return (
    <div className="Loader-wrapper">
      <Loader type="Puff" color="#4fc3f7" height={100} width={100} />
    </div>
  );
};

export default AppLoader;
