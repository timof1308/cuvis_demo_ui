import React, { useState } from 'react';
import CuvisClient from '../utils/clients/CuvisClient';
import AppContext from '../context/createContext';
import { CuvisSpectraData } from '../utils/mapper';
import { Line } from '@ant-design/charts';
import { Row, Col } from 'antd';

export interface ISpectraDataLineChartProps {
}

const SpectraDataLineChart: React.FunctionComponent<ISpectraDataLineChartProps> = (props: ISpectraDataLineChartProps) => {
    const cuvisClient = new CuvisClient()
    const [spectraData, setSpectraData] = useState<CuvisSpectraData | undefined>(undefined)
    const [yAxisLegend, setYAxisLegend] = useState<string>("-")
    const {
        selectedFile: [selectedFile],
        coordinates: [coordinates],
        radius: [radius],
        activeSessionId: [activeSessionId],
        metadata: [metadata]
    } = React.useContext(AppContext)!;

    React.useEffect(() => {
        if (selectedFile) {
            cuvisClient.getCuvisSpectraData(selectedFile, activeSessionId, { x: coordinates.x, y: coordinates.y, radius: radius }).then((spectraData: CuvisSpectraData) => {
                setSpectraData(spectraData)
            })
            
            if (metadata && metadata.processingMode == "Reflectance") {
                setYAxisLegend("Reflectance [%]")
            } else {
                setYAxisLegend("Radiance [W / m^2 / sr / µm]")
            }
        }
    }, [coordinates, activeSessionId])

    const linePlotConfig = {
        data: spectraData ? spectraData.mapped : [],
        xField: 'wavelength',
        yField: 'averageSpectra',
        meta: {
            averageSpectra: {
                color: "#ccc",
                alias: "Average Spectra"
            },
            wavelength: {
                color: "#ccc",
                alias: "Wavelength (nm)"
            }
        }
    };

    return (
        <>
            <Row justify="center" align="middle" gutter={[8, 8]}>
                <Col span={1}>
                    <span style={{ color: "#8C8C8C", width: "100%", writingMode: "vertical-rl", textAlign: "center", transform: "rotate(180deg)" }}>
                        {yAxisLegend}
                    </span>
                </Col>
                <Col span={23}>

                    <Line {...linePlotConfig} />
                    <span style={{ color: "#8C8C8C", marginTop: "1rem" }}>Wavelength (nm)</span>
                </Col>
            </Row>
        </>
    );
}

export default SpectraDataLineChart;
