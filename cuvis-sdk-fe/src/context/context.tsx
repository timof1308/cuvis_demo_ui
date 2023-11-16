import React, { useState } from "react";
import AppContext from "./createContext";
import { CuvisMetadata, PluginView } from "../utils/mapper";

const AppContextProvider = (props: {
  children: React.ReactElement<any, string | React.JSXElementConstructor<any>>
}) => {
  const [files, setFiles] = useState<{label: string; value: string;}[] | undefined>(undefined)
  const [selectedFile, setSelectedFile] = useState<string | undefined>(undefined)
  const [image, setImage] = useState<HTMLImageElement | undefined>(undefined)
  const [fileImageUrl, setFileImageUrl] = useState<string | undefined>(undefined)
  const [metadata, setMetadata] = useState<CuvisMetadata | undefined>(undefined)
  const [activeSessionId, setActiveSessionId] = useState<number>(0)
  const [coordinates, setCoordinates] = useState<{x: number; y: number}>({x: 50, y: 50})
  const [radius, setRadius] = useState<number>(2)
  const [selectedPlugin, setSelectedPlugin] = React.useState<string | undefined>(undefined);
  const [pluginViews, setPluginViews] = React.useState<PluginView[] | undefined>(undefined);

  React.useEffect(() => { }, [])

  return (
    <AppContext.Provider
      value={{
        files: [files, setFiles],
        selectedFile: [selectedFile, setSelectedFile],
        image: [image, setImage],
        fileImageUrl: [fileImageUrl, setFileImageUrl],
        metadata: [metadata, setMetadata],
        activeSessionId: [activeSessionId, setActiveSessionId],
        coordinates: [coordinates, setCoordinates],
        radius: [radius, setRadius],
        selectedPlugin: [selectedPlugin, setSelectedPlugin],
        pluginViews: [pluginViews, setPluginViews]
      }}
    >
      {props.children}
    </AppContext.Provider>
  );
};

export default AppContextProvider;
