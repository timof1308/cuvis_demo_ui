import React, { useContext } from 'react';
import { Form, Layout, Row, Select, Skeleton, Slider, Image, Typography, Descriptions, Divider, Col, Button } from 'antd';
import { SearchOutlined, DownloadOutlined } from '@ant-design/icons';
import Navbar from './Navbar';
import Container from './Container';
import colors from './_variables.module.scss';
import CuvisClient from '../utils/clients/CuvisClient';
import AppContext from '../context/createContext';
import { CuvisMetadata, PluginView } from '../utils/mapper';
import SpectraDataLineChart from './SpectraDataLineChart';
import { SliderMarks } from 'antd/es/slider';
import SessionPreview from './SessionPreview';
import './App.scss';

const App: React.FunctionComponent = () => {
  const { Content, Footer } = Layout;
  const { Text } = Typography;


  const contentStyle: React.CSSProperties = {
    backgroundColor: colors.primary,
    textAlign: "center",
    maxWidth: "100%",
    marginBottom: "200px"
  };

  const loaded: React.MutableRefObject<boolean> = React.useRef(false)
  const cuvisClient = new CuvisClient()
  const {
    selectedFile: [selectedFile, setSelectedFile],
    files: [files, setFiles],
    fileImageUrl: [fileImageUrl, setFileImageUrl],
    metadata: [metadata, setMetadata],
    coordinates: [coordinates, setCoordinates],
    activeSessionId: [activeSessionId, setActiveSessionId],
    selectedPlugin: [selectedPlugin, setSelectedPlugin],
    pluginViews: [pluginViews, setPluginViews],
  } = useContext(AppContext)!;

  const [channelOptions, setChannelOptions] = React.useState<{ label: string; value: number; }[] | undefined>(undefined)
  const [redMarks, setRedMarks] = React.useState<SliderMarks>({});
  const [greenMarks, setGreenMarks] = React.useState<SliderMarks>({});
  const [blueMarks, setBlueMarks] = React.useState<SliderMarks>({});
  const [selectedRedChannel, setSelectedRedChannel] = React.useState<number | undefined>(undefined);
  const [selectedGreenChannel, setSelectedGreenChannel] = React.useState<number | undefined>(undefined);
  const [selectedBlueChannel, setSelectedBlueChannel] = React.useState<number | undefined>(undefined);
  const [availableSessionIds, setAvailableSessionIds] = React.useState<number[]>([]);

  const [isPreviewVisible, setPreviewVisible] = React.useState(false);

  const convertToDisplayName = (filename: string): string => {
    const withoutExtension = filename.split('.')[0]; // Remove the extension
    const words = withoutExtension.split('_');

    // Capitalize each word and join with spaces
    const displayName = words.map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');

    return displayName;
  }

  const handleFileSelectionChange = (value: string) => {
    setSelectedFile(value)
    setFileImageUrl(undefined)
  };

  const handlePluginSelectionChange = (value: string) => {
    setSelectedPlugin(value)
  };

  const handleRedChannelSelectionChange = async (value: number) => {
    setSelectedPlugin(undefined)
    // only set value if it is in the metadata.wavelengths
    if (metadata && metadata.wavelengths.includes(value)) {
      setSelectedRedChannel(value)
    }
  };
  const handleGreenChannelSelectionChange = async (value: number) => {
    setSelectedPlugin(undefined)
    // only set value if it is in the metadata.wavelengths
    if (metadata && metadata.wavelengths.includes(value)) {
      setSelectedGreenChannel(value)
    }
  };
  const handleBlueChannelSelectionChange = async (value: number) => {
    setSelectedPlugin(undefined)
    // only set value if it is in the metadata.wavelengths

    if (metadata && metadata.wavelengths.includes(value)) {
      setSelectedBlueChannel(value)
    }
  };

  const fetchImage = async () => {
    try {
      let body: string | undefined = undefined
      if (selectedPlugin && metadata) {
        body = JSON.stringify({ plugin: selectedPlugin, processingMode: metadata.processingMode })
      } else {
        body = JSON.stringify({ channels: [selectedRedChannel, selectedGreenChannel, selectedBlueChannel] })
      }

      const response = await fetch(`${window.location.protocol}//${window.location.hostname}:8000/files/${selectedFile}/${activeSessionId}/image`, {
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

  const downloadFile = async () => {
    if (!selectedFile) return
    fetch(`${window.location.protocol}//${window.location.hostname}:8000/files/${selectedFile}/download`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/document',
        "Access-Control-Allow-Origin": "*"
      },
    })
      .then((response: Response) => response.blob())
      .then((blob: Blob) => {
        // Create blob link to download
        const url = window.URL.createObjectURL(
          new Blob([blob]),
        );
        const link: HTMLAnchorElement = document.createElement('a');
        link.setAttribute('id', `${selectedFile}_download_link`)
        link.href = url;
        link.setAttribute(
          'download',
          selectedFile
        );

        // Append to html link element page
        document.body.appendChild(link);

        // Start download
        link.click();

        // Clean up and remove the link
        document.body.removeChild(link);
      });
  };

  const readBlob = (blob: any) => {
    const reader = new FileReader();
    reader.onload = () => {
      setFileImageUrl(reader.result as string);
    };
    reader.readAsDataURL(blob);
  };

  const findClosestNumber = (target: number, numbers: number[]): number | null => {
    if (numbers.length === 0) {
      return null;
    }

    let closestNumber = numbers[0];
    let closestDifference = Math.abs(target - closestNumber);

    for (const number of numbers) {
      const difference = Math.abs(target - number);
      if (difference < closestDifference) {
        closestNumber = number;
        closestDifference = difference;
      }
    }

    return closestNumber;
  }

  if (!loaded.current) {
    loaded.current = true

    cuvisClient.getFiles().then((availableFiles: any) => {
      const fileOptions: { label: string; value: string }[] = []
      // add files to fileOptions
      for (const file of availableFiles.files) {
        fileOptions.push({
          label: convertToDisplayName(file),
          value: file,
        });
      }

      setFiles(fileOptions)
    })
  }

  React.useEffect(() => {
    if (selectedFile) {
      cuvisClient.getCuvisMetadata(selectedFile, activeSessionId).then((md: CuvisMetadata) => {
        setMetadata(md)
        setChannelOptions(undefined)

        let avSesIds = []
        for (let i: number = 0; i < md.sessionLength; i++) {
          avSesIds.push(i)
        }
        setAvailableSessionIds(avSesIds)

        setSelectedRedChannel(findClosestNumber(650, md ? md.wavelengths : []) || 450)
        setSelectedGreenChannel(findClosestNumber(550, md ? md.wavelengths : []) || 450)
        setSelectedBlueChannel(findClosestNumber(450, md ? md.wavelengths : []) || 450)

        const lowerRed = findClosestNumber(600, md.wavelengths)
        const upperRed = findClosestNumber(700, md.wavelengths)
        const lowerGreen = findClosestNumber(500, md.wavelengths)
        const upperGreen = findClosestNumber(600, md.wavelengths)
        const lowerBlue = findClosestNumber(400, md.wavelengths)
        const upperBlue = findClosestNumber(500, md.wavelengths)
        setRedMarks({
          [lowerRed!]: {
            label: <Text italic>{lowerRed}</Text>,
          },
          [upperRed!]: {
            label: <Text italic>{upperRed} nm</Text>,
          },
        })
        setGreenMarks({
          [lowerGreen!]: {
            label: <Text italic>{lowerGreen}</Text>,
          },
          [upperGreen!]: {
            label: <Text italic>{upperGreen} nm</Text>,
          },
        })
        setBlueMarks({
          [lowerBlue!]: {
            label: <Text italic>{lowerBlue}</Text>,
          },
          [upperBlue!]: {
            label: <Text italic>{upperBlue} nm</Text>,
          },
        })

        cuvisClient.getCuvisPluginViews(md.processingMode).then((plugin_views: PluginView[]) => {
          setPluginViews(plugin_views)

          fetchImage()

          setSelectedPlugin(plugin_views[0].value)
        })
      })
    }
  }, [selectedFile])

  React.useEffect(() => {
    if (metadata) {
      let _options: { label: string; value: number; }[] = []
      for (const channel of metadata.wavelengths) {
        _options.push({ label: channel.toString(), value: channel });
      }
      setChannelOptions(_options)
    }
  }, [metadata])

  React.useEffect(() => {
    if (selectedFile) { fetchImage() }
  }, [selectedRedChannel, selectedGreenChannel, selectedBlueChannel, selectedPlugin, activeSessionId])

  const [form] = Form.useForm();

  const handleMouseMove = (e: any) => {
    const x = e.nativeEvent.offsetX;
    const y = e.nativeEvent.offsetY;

    setCoordinates({ x, y })
  }

  const pointStyle: React.CSSProperties = {
    position: 'absolute',
    width: '4px',
    height: '4px',
    backgroundColor: '#00ff00',
    borderRadius: '50%',
    transform: `translate(${coordinates.x - 2}px, ${coordinates.y - 2}px)`,
  };

  const magnifyStyle: React.CSSProperties = {
    position: "absolute",
    display: "block",
    fontSize: "1.25rem",
    textAlign: "end",
    top: 0,
    right: 0,
    width: "auto",
    height: "auto",
    color: "white",
    padding: "0.35rem",
    borderBottomLeftRadius: "0.25rem",
    backgroundColor: "rgba(0,0,0,0.5)",
  }

  return (
    <>
      <Navbar />

      <Container>
        <Form
          form={form}
          layout="vertical"
        >
          <Row justify="center" align="middle" id="topBox">
            <Col span={11}>
              <Form.Item label="Select File">
                <Select
                  id="inputID"
                  placeholder="Please select a demo file"
                  style={{ width: "100%" }}
                  onChange={handleFileSelectionChange}
                  options={files}
                />
              </Form.Item>
            </Col>
            <Col span={2}>
            </Col>
            <Col span={11}>
              <Form.Item
                label="Predefined View Configurations"
              >
                <Select
                  allowClear
                  disabled={!selectedFile}
                  style={{ width: '100%' }}
                  placeholder="Please select a configuration"
                  value={selectedPlugin}
                  onChange={handlePluginSelectionChange}
                  options={pluginViews}
                />
              </Form.Item>
            </Col>
          </Row>
        </Form>
        <Divider style={{ background: colors.blue, margin: ".5rem 0" }} />

        <Content style={contentStyle}>
          {fileImageUrl ? (
            <>
              <Row justify="center" align="middle" style={{ marginBottom: "2rem" }} id="topBox">
                <Col span={11}>
                  <Row>
                    <Col span={24}>
                      <Form
                        form={form}
                        layout="horizontal"
                      >
                        <Form.Item label="Red">
                          <Slider
                            disabled={!selectedFile}
                            marks={redMarks}
                            value={selectedRedChannel}
                            min={metadata ? metadata.wavelengths[0] : 0}
                            max={metadata ? metadata.wavelengths[metadata ? metadata.wavelengths.length - 1 : 0] : 1}
                            included={false}
                            onChange={handleRedChannelSelectionChange}
                          />
                        </Form.Item>
                        <Form.Item label="Green">
                          <Slider
                            disabled={!selectedFile}
                            marks={greenMarks}
                            value={selectedGreenChannel}
                            min={metadata ? metadata.wavelengths[0] : 0}
                            max={metadata ? metadata.wavelengths[metadata ? metadata.wavelengths.length - 1 : 0] : 1}
                            included={false}
                            onChange={handleGreenChannelSelectionChange}
                          />
                        </Form.Item>
                        <Form.Item label="Blue">
                          <Slider
                            disabled={!selectedFile}
                            marks={blueMarks}
                            value={selectedBlueChannel}
                            min={metadata ? metadata.wavelengths[0] : 0}
                            max={metadata ? metadata.wavelengths[metadata ? metadata.wavelengths.length - 1 : 0] : 1}
                            included={false}
                            onChange={handleBlueChannelSelectionChange}
                          />
                        </Form.Item>
                      </Form>
                    </Col>
                    <Col span={24}>
                      <Row justify="center" align="middle" >
                        <Row style={{ position: 'relative' }}>
                          <div style={{ position: "relative" }}>
                            <img
                              src={fileImageUrl}
                              onClick={(e: any) => handleMouseMove(e)} />
                            <span
                              style={magnifyStyle}
                              onClick={() => setPreviewVisible(true)}>
                              <SearchOutlined />
                            </span>
                          </div>
                          {coordinates.x !== null && coordinates.y !== null && (
                            <Row style={pointStyle}></Row>
                          )}
                        </Row>
                        <Row justify="center" align="middle" style={{ marginTop: "2rem" }}>
                          {metadata && metadata.isSession && (
                            <>
                              {availableSessionIds.map((sessionId: number) => (
                                <>
                                  <SessionPreview key={sessionId} id={sessionId} />
                                </>
                              ))}
                            </>
                          )}
                        </Row>

                      </Row>
                    </Col>
                  </Row>
                  <Row>
                    <Col span={24}>
                      <Row justify="center" align="middle">
                        <Button type="link" onClick={downloadFile} icon={<DownloadOutlined />} title='Download raw file'>Download</Button>
                      </Row>
                    </Col>
                  </Row>
                </Col>
                <Col span={2}>
                  <Image
                    width={200}
                    style={{ display: 'none' }}
                    src=""
                    preview={{
                      visible: isPreviewVisible,
                      scaleStep: .5,
                      minScale: 1.5,
                      src: fileImageUrl,
                      onVisibleChange: (value) => {
                        setPreviewVisible(value);
                      },
                    }}
                  />
                </Col>
                <Col span={11}>
                  <Row >
                    <Col span={24} style={{ marginBottom: "2rem" }}>
                      {metadata && (
                        <>
                          <Divider />
                          <Descriptions title={metadata.name} layout="vertical" size='small'>
                            <Descriptions.Item label="Product Name">{metadata.productName}</Descriptions.Item>
                            <Descriptions.Item label="Integration Time">{metadata.integrationTime}</Descriptions.Item>
                            <Descriptions.Item label="Capture Time">{metadata.captureTime}</Descriptions.Item>
                          </Descriptions>
                        </>
                      )}
                    </Col>
                    <Col span={24}>
                      <SpectraDataLineChart />
                    </Col>
                  </Row>
                </Col>
              </Row>
            </>
          ) : (
            <Skeleton.Image active={true} style={{ width: "256px", height: "256px", minWidth: "96px", minHeight: "96px", marginTop: "2rem" }} />
          )}
        </Content>
      </Container>

      <Footer style={{
        bottom: 0,
        textAlign: 'center',
        width: '100%',
        backgroundColor: colors.footerColor,
        marginTop: '1rem',
        fontFamily: 'Tomorrow',
        color: colors.baseColor,
        padding: "10px"
      }}>
        <Container>
          Cubert GmbH © 2023
        </Container>
      </Footer>
    </>
  );
}

export default App;
