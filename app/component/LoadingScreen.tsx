import React from "react";
import { LoadingScreenProps } from "../lib/types";

function LoadingScreen({ loadingText }: LoadingScreenProps) {
  return (
    <div className="flex h-screen justify-center">
      <div className="m-auto">
        <div className="flex flex-col items-center">
          <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-gray-700"></div>
          <p className="mt-4 text-gray-700 font-bold text-xl">{loadingText}</p>
        </div>
      </div>
    </div>
  );
}

export default LoadingScreen;
