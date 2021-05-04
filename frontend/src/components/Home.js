import React from "react";
import ActorColumn from './ActorColumn';
import MovieColumn from './MovieColumn';

/**
 * Represent the home route at "/".
 * @return {Component} NewActor component to create new actors.
 */
const Home = () => {
  return(
    <div className="Body-wrapper">
      <div className="Column-wrapper">
        <ActorColumn/>
        <MovieColumn/>
      </div>
    </div>
  );
};

export default Home;
