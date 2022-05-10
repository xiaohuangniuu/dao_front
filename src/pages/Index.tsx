import Header from "../components/Header";
import SystemPanel from "../components/SystemPanel";
import Proposals from "../components/Proposals";
import * as React from "react";

export default function Index() {
  return(
    <>
      <Header />
      <SystemPanel/>
      <Proposals/>
    </>
  )
}