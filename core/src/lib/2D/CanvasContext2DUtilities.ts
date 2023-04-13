
export const createContext2D = (width: number, height: number): CanvasRenderingContext2D => {
    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    return getContext2D(canvas);
}

export const getContext2D = (canvas: HTMLCanvasElement): CanvasRenderingContext2D => {
    const context = canvas.getContext('2d');
    if (!context) throw Error('Unable to create 2d context on canvas');
    return context;
}

export const cloneContext2D = (context: CanvasRenderingContext2D): CanvasRenderingContext2D => {
    return createContext2D(context.canvas.width, context.canvas.height);
}

export const getContextSize = (context: CanvasRenderingContext2D): [number, number] => {
    return [context.canvas.width, context.canvas.height];
}
