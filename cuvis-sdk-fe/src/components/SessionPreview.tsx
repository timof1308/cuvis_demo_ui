import { Skeleton } from 'antd';
import * as React from 'react';
import AppContext from '../context/createContext';

export interface ISessionPreviewProps {
    id: number;
}

const SessionPreview: React.FunctionComponent<ISessionPreviewProps> = (props: ISessionPreviewProps) => {
    const [image, setImage] = React.useState<string | undefined>(undefined)

    const {
        selectedFile: [selectedFile],
        activeSessionId: [activeSessionId, setActiveSessionId],
        selectedPlugin: [selectedPlugin]
    } = React.useContext(AppContext)!;

    const fetchImage = async () => {
        try {
            let body: string | undefined = undefined
            if (selectedPlugin) {
                body = JSON.stringify({ plugin: selectedPlugin })
            } else {
                body = JSON.stringify({ plugin: "01_CIR.xml" })
            }

            const response = await fetch(`${window.location.protocol}//${window.location.hostname}:8000/files/${selectedFile}/${props.id}/image`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Access-Control-Allow-Origin": "*"
                },
                body
            });

            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            const blob = await response.blob();
            readBlob(blob);
        } catch (error) {
            console.error('Error fetching image:', error);
        }
    };

    const readBlob = (blob: any) => {
        const reader = new FileReader();
        reader.onload = () => {
            setImage(reader.result as string);
        };
        reader.readAsDataURL(blob);
    };

    React.useEffect(() => {
        fetchImage()
    }, [selectedPlugin])

    return (
        <>
            {image ? (
                <img src={image} style={{ margin: "0.1rem", width: "96px", height: "96px" }} onClick={() => {
                    if (props.id != activeSessionId) { setActiveSessionId(props.id) }
                }} />
            ) : (
                <Skeleton.Image active={true} style={{ margin: "0.1rem" }} />
            )}
        </>
    );
}

export default SessionPreview;