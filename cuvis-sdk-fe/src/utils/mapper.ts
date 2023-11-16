import ErrorResponse from "./ErrorResponse"

/**
 * Map JSON response from server to object
 * @param {any} errorResponse  as JSON
 * @returns {ErrorResponse} UserPagination object
 */
export const mapErrorResponse = (errorResponse: any): ErrorResponse => {
    return new ErrorResponse(
        errorResponse.code,
        errorResponse.status,
        errorResponse.type,
        new Date(Date.parse(errorResponse.timeStamp)),
        errorResponse.message,
        errorResponse.description,
        //errorResponse.traceId
    )
}

export interface CuvisMetadata {
    name: string
    productName: string
    integrationTime: string
    processingMode: string
    captureTime: string
    wavelengths: number[],
    isSession: boolean,
    sessionLength: number
}

export const mapMetadata = (metadata: any): CuvisMetadata => {
    return {
        name: metadata.name,
        productName: metadata.productName,
        integrationTime: metadata.integrationTime,
        processingMode: metadata.processingMode,
        captureTime: metadata.captureTime,
        wavelengths: metadata.wavelengths,
        isSession: metadata.isSession,
        sessionLength: metadata.sessionLength
    }
}

export interface CuvisSpectraData {
    x: number
    y: number
    raduis: number
    averageSpectra: number[]
    wavelengths: number[]
    mapped: {averageSpectra: number, wavelength: number}[]
}

export const mapSpectraData = (spectraData: any): CuvisSpectraData => {
    let spectraDataResult: {averageSpectra: number, wavelength: number}[] = []

    for (let i = 0; i < spectraData.wavelengths.length; i++) {
        spectraDataResult.push({
            averageSpectra: spectraData.averageSpectra[i],
            wavelength: spectraData.wavelengths[i]
        })
    }

    return {
        x: spectraData.x,
        y: spectraData.y,
        raduis: spectraData.raduis,
        averageSpectra: spectraData.averageSpectra,
        wavelengths: spectraData.wavelengths,
        mapped: spectraDataResult
    }
}

export interface PluginView {
    value: string
    label: string
}

export const mapPluginViews = (pluginView: any): PluginView => {
    return {
        value: pluginView.key,
        label: pluginView.name
    }
}
