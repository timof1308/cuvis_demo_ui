import { mapMetadata, mapSpectraData, mapPluginViews } from "../mapper";
import ApiClient from "./ApiClient";

export default class CuvisClient extends ApiClient {
    public getFiles = async () => {
        return this.get('files', '', { disableErrorNotification: true }, undefined);
    }

    public getCuvisMetadata = async (file_name: string, session_id: number) => {
        return this.get(`files/${file_name}/${session_id}/metadata`, '',{ disableErrorNotification: true }, mapMetadata);
    }

    public getCuvisPluginViews = async (processing_mode: string) => {
        return this.get(`views/${processing_mode}`, '',{ disableErrorNotification: true }, mapPluginViews);
    }

    public getCuvisImage = async (file_name: string, session_id: number, channels: number[]) => {
        return this.post(`files/${file_name}/${session_id}/image`, { channels }, '',{ disableErrorNotification: true }, undefined);
    }

    public getCuvisSpectraData = async (file_name: string, session_id: number, body: {x: number, y: number, radius: number}) => {
        return this.post(`files/${file_name}/${session_id}/spectra`, body, '',{ disableErrorNotification: true }, mapSpectraData);
    }
}
