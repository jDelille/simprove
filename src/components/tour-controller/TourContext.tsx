"use client";

import { createContext, useContext } from "react";

export const TourContext = createContext({
  isTourActive: false,
});

export const useTour = () => useContext(TourContext);