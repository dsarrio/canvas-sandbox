
export const clamp = (value: number, min: number, max: number) : number => {
    return value < min ? min : value > max ? max : value;
};

export const saturate = (value: number): number => {
    return value < 0 ? 0 : value > 1 ? 1 : value;
};

export const step = (value: number, start: number, end: number) => {
    const f = (value - start) / (end - start);
    return f < 0 ? 0 : f > 1 ? 1 : f;
};

export const lerp = (factor: number, start: number, end: number) => {
    return start + factor * (end - start);
};

export const easeinout = (x : number) => {
     return x < 0.5 ? 16 * x * x * x * x * x : 1 - Math.pow(-2 * x + 2, 5) / 2;
}

export const easein = (x: number) => {
    return Math.pow(x, 3);
}

export const easeout = (x: number) => {
    return 1 - Math.pow(1 - x, 3);
}

export const easeoutsine = (x: number) => {
    return Math.sin((x * Math.PI) / 2);
}

export const randBetween = (min: number, max: number) => {
    return min + Math.random() * (max - min);
}

export const randIntBetween = (min: number, max: number) => {
    return Math.round(randBetween(min, max));
}

export const rgba = (r: number, g: number, b: number, a: number = 1): string => {
    const rr = Math.round((saturate(r) * 255));
    const gg = Math.round((saturate(g) * 255));
    const bb = Math.round((saturate(b) * 255));
    const aa = saturate(a);
    return `rgba(${rr}, ${gg}, ${bb}, ${aa})`;
}

export const hsv2hsl = (hsv: {h: number, s: number, v: number}) => {
    const h = Math.round(hsv.h);
    const l = hsv.v - hsv.v * hsv.s / 2;
    const m = Math.min(l, 1 - l);
    const s = m ? (hsv.v - l) / m : 0;
    return 'hsl(' + h + ',' + Math.round(s * 100) + '%,' + Math.round(l * 100) + '%)';
}

export const randCssColor = () => {
    const r = Math.random() * 255;
    const g = Math.random() * 255;
    const b = Math.random() * 255;
    return 'rgb(' + r + ',' + g + ',' + b + ')';
}

export interface Point2D {
    x: number,
    y: number,
};
