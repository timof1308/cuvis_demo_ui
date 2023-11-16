import { createContext } from "react";
import { CuvisMetadata, CuvisSpectraData, PluginView } from "../utils/mapper";

interface contextProps {
  image: [
    image: HTMLImageElement | undefined,
    setImage: (e: HTMLImageElement | undefined) => void
  ];
  files: [
    files: {label: string; value: string;}[] | undefined,
    setFiles: (e: {label: string; value: string;}[]) => void
  ];
  selectedFile: [
    selectedFile: string | undefined,
    setSelectedFile: (e: string) => void
  ];
  fileImageUrl: [
    fileImageUrl: string | undefined,
    setFileImageUrl: (e: string | undefined) => void
  ];
  metadata: [
    metadata: CuvisMetadata | undefined,
    setMetadata: (e: CuvisMetadata | undefined) => void
  ];
  activeSessionId: [
    activeSessionId: number,
    setActiveSessionId: (e: number) => void
  ];
  coordinates : [
    coordinates: {x: number; y: number},
    setCoordinates: (e: {x: number; y: number}) => void
  ];
  radius : [
    radius: number,
    setRadius: (e: number) => void
  ];
  selectedPlugin : [
    selectedPlugin: string | undefined,
    setSelectedPlugin: (e: string | undefined) => void
  ];
  pluginViews : [
    pluginViews: PluginView[] | undefined,
    setPluginViews: (e: PluginView[] | undefined) => void
  ];
}

const AppContext = createContext<contextProps | null>(null);

export default AppContext;
