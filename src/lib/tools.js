
var P = (x, y, z = 0, w = 1) => { return {x, y, z, w} }

export const clamp = (v, min, max) => {
    return  v < min ? min : v > max ? max : v;
}

export const saturate = (v) => {
    return clamp(v, 0, 1);
}

export const step = (start, end, value) => {
    return saturate((value - start) / (end - start));
}

export const lerp = (start, end, factor) => {
    return start + factor * (end - start);
}

export const loadImage = async (url) => {
    return new Promise((resolve, reject) => {
        const img = new Image();
        img.crossOrigin = "Anonymous";
        img.addEventListener('load', () => { console.log('loaded', url); resolve(img); }, false);
        img.src = url;
    });
};

// var tlerp = (tA, tB, vA, vB, t) => {
//     var s = (tA != tB) ? clamp((t - tA) / (tB - tA), 0, 1) : 1;
//     return lerp(vA, vB, s * s * (3.0 - 2.0 * s));
// }

// var easeinout = (x) => {
//     return x < 0.5 ? 16 * x * x * x * x * x : 1 - Math.pow(-2 * x + 2, 5) / 2;
// }

// var easein = (x) => {
//     return Math.pow(x, 3);
// }

// var easeout = (x) => {
//     return 1 - Math.pow(1 - x, 3);
// }

// var easeoutsine = (x) => {
//     return Math.sin((x * Math.PI) / 2);
// }

// var bounce = (x) => {
//     return 1 - Math.pow(x - 0.5, 2) * 4;
// }

// var noise2D = (x, y) => {
//     const p = P(x, y);
//     return (Math.sin(Vector2.dot(p, P(12.9898, 78.233))) * 43758.5453) % 1;
// }

var rgba = (r, g, b, a) => {
    const rr = clamp(Math.round(r * 255), 0, 255);
    const gg = clamp(Math.round(g * 255), 0, 255);
    const bb = clamp(Math.round(b * 255), 0, 255);
    return 'rgba('+rr+','+gg+','+bb+','+a+')';
}

// var randBetween = (min, max) => {
//     return min + Math.random() * (max - min);
// }

// var randIntBetween = (min, max) => {
//     return Math.round(randBetween(min, max));
// }

// // var rgb = (r, g, b) => {
// //     const p = [r, g, b].map((v) => {
// //         v = Math.round(clamp(v, 0, 1) * 255.0);
// //         return ((v < 16) ? "0" : "") + v.toString(16);
// //     });
// //     return "#" + p.join("").toUpperCase();
// // }

// var hsv2hsl = (hsv) => {
//     const h = Math.round(hsv.h);
//     const l = hsv.v - hsv.v * hsv.s / 2;
//     const m = Math.min(l, 1 - l);
//     const s = m ? (hsv.v - l) / m : 0;
//     return 'hsl('+h+','+Math.round(s*100)+'%,'+Math.round(l*100)+'%)';
// }

// var randColor = () => {
//     const r = Math.random() * 255;
//     const g = Math.random() * 255;
//     const b = Math.random() * 255;
//     return 'rgb(' + r + ',' + g + ',' + b + ')';
// }



// const Vector2 = {

// //     lengthSquared({x, y}) {
// //         return x * x + y * y
// //     },

// //     length({x, y}) {
// //         return Math.sqrt(x * x + y * y)
// //     },

// //     distance(a, b) {
// //         const dx = b.x - a.x;
// //         const dy = b.y - a.y;
// //         return Math.sqrt(dx * dx + dy * dy);
// //     },
    
//     normalized({x, y}) {
//         const l = Math.sqrt(x * x + y * y);
//         return { x: x / l, y: y / l };
//     },    

//     direction(a, b) {
//         const x = b.x - a.x;
//         const y = b.y - a.y;
//         const l = Math.sqrt(x * x + y * y);
//         return { x: x / l, y: y / l };        
//     },    

//     rotated(p, angle_rad) {
//         const sina = Math.sin(angle_rad);
//         const cosa = Math.cos(angle_rad);
//         return P(
//             p.x * cosa - p.y * sina,
//             p.x * sina + p.y * cosa,
//         );
//     },

//     dot(a, b) {
//         return (a.x * b.x) + (a.y * b.y);
//     },

//     lerp(a, b, f) {
//         return P(lerp(a.x, b.x, f), lerp(a.y, b.y, f));
//     }
// }

// const Vector3 = {

//     lengthSquared({x, y, z}) {
//         return x * x + y * y + z * z
//     },

//     length({x, y, z}) {
//         return Math.sqrt(x * x + y * y + z * z)
//     },

//     mult(a, value) {
//         return P(a.x * value, a.y * value, a.z * value)
//     },

//     add(a, b) {
//         return P(a.x + b.x, a.y + b.y, a.z + b.z)
//     },

//     minus(a, b) {
//         return P(a.x - b.x, a.y - b.y, a.z - b.z)
//     },

// //     distance(a, b) {
// //         const dx = b.x - a.x;
// //         const dy = b.y - a.y;
// //         const dz = b.y - a.y;
// //         return Math.sqrt(dx * dx + dy * dy + dz * dz);
// //     },
    
//     normalized({x, y, z}) {
//         const l = Math.sqrt(x * x + y * y + z * z);
//         return { x: x / l, y: y / l, z: z / l };
//     },    
    
//     mat_mult(v, m) {
//         const x = v.x * m[ 0] + v.y * m[ 4] + v.z * m[ 8] + v.w * m[12];
//         const y = v.x * m[ 1] + v.y * m[ 5] + v.z * m[ 9] + v.w * m[13];
//         const z = v.x * m[ 2] + v.y * m[ 6] + v.z * m[10] + v.w * m[14];
//         const w = v.x * m[ 3] + v.y * m[ 7] + v.z * m[11] + v.w * m[15];
//         return P(x, y, z, w);
//     },

//     cross(a, b) {
//         const x = a.y * b.z - a.z * b.y;
//         const y = a.z * b.x - a.x * b.z;
//         const z = a.x * b.y - a.y * b.x;
//         return P(x, y, z);
//     },

//     dot(a, b) {
//         return (a.x * b.x) + (a.y * b.y) + (a.z * b.z);
//     },

//     lerp(a, b, f) {
//         return P(
//             a.x + (b.x - a.x) * f,
//             a.y + (b.y - a.y) * f,
//             a.z + (b.z - a.z) * f,            
//         );
//     }
// }

// // var dot = (ctx, pos, params) => {
// //     params = params || {};
// //     ctx.save();
// //     ctx.fillStyle = params.color || "#00FF00";
// //     ctx.beginPath();
// //     ctx.arc(pos.x, pos.y, params.radius || 3, 0, Math.PI * 2);
// //     ctx.fill();
// //     ctx.restore();
// // }

// // var line = (ctx, ax, ay, bx, by) => {
// //     ctx.beginPath();
// //     ctx.moveTo(ax, ay);
// //     ctx.lineTo(bx, by);
// //     ctx.stroke();
// // }

// // var delay = (v, amount) => {
// //     Math.max(v - amount, 0);
// // }


// // var rotate = (pos, rad) => {
// //     const sina = Math.sin(rad);
// //     const cosa = Math.cos(rad);
// //     return P(
// //         pos.x * cosa - pos.y * sina,
// //         pos.x * sina + pos.y * cosa,
// //     );
// // }

// const Matrix4 = {

//     identity() {
//         const m = new Float32Array(16);
//         m[ 0] = 1;
//         m[ 5] = 1;
//         m[10] = 1;
//         m[15] = 1;
//         return m;
//     },
    
//     frustum(fov, aspect, near, far) {
//         const m = new Float32Array(16);
//         const scale = Math.tan(fov * 0.5 * Math.PI / 180) * near;
//         const r = aspect * scale;
//         const l = -r;
//         const b = -scale;
//         m[ 0] = 2 * near / (r - l);
//         m[ 1] = 0;
//         m[ 2] = 0;
//         m[ 3] = 0;
//         m[ 4] = 0;
//         m[ 5] = 2 * near / (scale - b);
//         m[ 6] = 0;
//         m[ 7] = 0;
//         m[ 8] = (r + l) / (r - l);
//         m[ 9] = (scale + b) / (scale - b);
//         m[10] = -(far + near) / (far - near);
//         m[11] = -1;
//         m[12] = 0;
//         m[13] = 0;
//         m[14] = -2 * far * near / (far - near);
//         m[15] = 0;
//         return m;
//     },

// //     projection(fov, aspect, near, far) {
// //         const m = new Float32Array(16);
// //         const f = Math.tan(fov * 0.5 * Math.PI / 180);
// //         m[ 0] = 1 / (f * aspect);
// //         m[ 1] = 0;
// //         m[ 2] = 0;
// //         m[ 3] = 0;
// //         m[ 4] = 0;
// //         m[ 5] = 1 / f;
// //         m[ 6] = 0;
// //         m[ 7] = 0;
// //         m[ 8] = 0;
// //         m[ 9] = 0;
// //         m[10] = (-near - far) / (near - far);
// //         m[11] = 2 * far * near / (near - far);
// //         m[12] = 0;
// //         m[13] = 0;
// //         m[14] = 1;
// //         m[15] = 0;
// //         return m;
// //     },

//     lookAt(eye, target, up) {
//         const m = new Float32Array(16);
//         var vz = Vector3.normalized(P(eye.x - target.x, eye.y - target.y, eye.z - target.z));
//         var vx = Vector3.normalized(Vector3.cross(up, vz));
//         var vy = Vector3.cross(vz, vx);
//         m[ 0] = vx.x;
//         m[ 1] = vy.x;
//         m[ 2] = vz.x;
//         m[ 3] = 0;
//         m[ 4] = vx.y;
//         m[ 5] = vy.y;
//         m[ 6] = vz.y;
//         m[ 7] = 0;
//         m[ 8] = vx.z;
//         m[ 9] = vy.z;
//         m[10] = vz.z;
//         m[11] = 0;
//         m[12] = -Vector3.dot(vx, eye);
//         m[13] = -Vector3.dot(vy, eye);
//         m[14] = -Vector3.dot(vz, eye);
//         m[15] = 1;
//         return m;
//     },

// //     transpose(a) {
// //         const m = new Float32Array(16);
// //         m[ 0] = a[0];
// //         m[ 1] = a[4];
// //         m[ 2] = a[8];
// //         m[ 3] = a[12];
// //         m[ 4] = a[1];
// //         m[ 5] = a[5];
// //         m[ 6] = a[9];
// //         m[ 7] = a[13];
// //         m[ 8] = a[2];
// //         m[ 9] = a[6];
// //         m[10] = a[10];
// //         m[11] = a[14];
// //         m[12] = a[3];
// //         m[13] = a[7];
// //         m[14] = a[11];
// //         m[15] = a[15];
// //         return m;
// //     },

//     multiply(left, right) {
//         var a = left;
//         var b = right;
//         const m = new Float32Array(16);
//         var a0 = a[ 0];
//         var a1 = a[ 1];
//         var a2 = a[ 2];
//         var a3 = a[ 3];
//         m[0] = a0 * b[0] + a1 * b[4] + a2 * b[8]  + a3 * b[12];
//         m[1] = a0 * b[1] + a1 * b[5] + a2 * b[9]  + a3 * b[13];
//         m[2] = a0 * b[2] + a1 * b[6] + a2 * b[10] + a3 * b[14];
//         m[3] = a0 * b[3] + a1 * b[7] + a2 * b[11] + a3 * b[15];

//         a0 = a[ 4];
//         a1 = a[ 5];
//         a2 = a[ 6];
//         a3 = a[ 7];
//         m[4] = a0 * b[0] + a1 * b[4] + a2 * b[8]  + a3 * b[12];
//         m[5] = a0 * b[1] + a1 * b[5] + a2 * b[9]  + a3 * b[13];
//         m[6] = a0 * b[2] + a1 * b[6] + a2 * b[10] + a3 * b[14];
//         m[7] = a0 * b[3] + a1 * b[7] + a2 * b[11] + a3 * b[15];

//         a0 = a[8];
//         a1 = a[9];
//         a2 = a[10];
//         a3 = a[11];
//         m[8] = a0 * b[0] + a1 * b[4] + a2 * b[8]  + a3 * b[12];
//         m[9] = a0 * b[1] + a1 * b[5] + a2 * b[9]  + a3 * b[13];
//         m[10] = a0 * b[2] + a1 * b[6] + a2 * b[10] + a3 * b[14];
//         m[11] = a0 * b[3] + a1 * b[7] + a2 * b[11] + a3 * b[15];

//         a0 = a[12];
//         a1 = a[13];
//         a2 = a[14];
//         a3 = a[15];
//         m[12] = a0 * b[0] + a1 * b[4] + a2 * b[8]  + a3 * b[12];
//         m[13] = a0 * b[1] + a1 * b[5] + a2 * b[9]  + a3 * b[13];
//         m[14] = a0 * b[2] + a1 * b[6] + a2 * b[10] + a3 * b[14];
//         m[15] = a0 * b[3] + a1 * b[7] + a2 * b[11] + a3 * b[15];
//         a = m;
//         return a;
//     },

// //     scale(sx, sy, sz) {
// //         const m = new Float32Array(16);
// //         m[0] = sx;
// //         m[5] = sy;
// //         m[10] = sz;
// //         m[15] = 1;
// //         return m;
// //     },

//     rotationX(angle) {
//         const m = new Float32Array(16);
//         var c = Math.cos(angle);
//         var s = Math.sin(angle);
//         m[ 0] = 1;
//         m[ 1] = 0;
//         m[ 2] = 0;
//         m[ 3] = 0;
//         m[ 4] = 0;
//         m[ 5] = c;
//         m[ 6] = s;
//         m[ 7] = 0;
//         m[ 8] = 0;
//         m[ 9] = -s;
//         m[10] = c;
//         m[11] = 0;
//         m[12] = 0;
//         m[13] = 0;
//         m[14] = 0;
//         m[15] = 1;
//         return m;
//     },

// //     rotationY(angle) {
// //         const m = new Float32Array(16);
// //         var c = Math.cos(angle);
// //         var s = Math.sin(angle);
// //         m[ 0] = c;
// //         m[ 1] = 0;
// //         m[ 2] = -s;
// //         m[ 3] = 0;
// //         m[ 4] = 0;
// //         m[ 5] = 1;
// //         m[ 6] = 0;
// //         m[ 7] = 0;
// //         m[ 8] = s;
// //         m[ 9] = 0;
// //         m[10] = c;
// //         m[11] = 0;
// //         m[12] = 0;
// //         m[13] = 0;
// //         m[14] = 0;
// //         m[15] = 1;
// //         return m;
// //     },

//     rotationZ(angle) {
//         const m = new Float32Array(16);
//         var c = Math.cos(angle);
//         var s = Math.sin(angle);
//         m[ 0] = c;
//         m[ 1] = s;
//         m[ 2] = 0;
//         m[ 3] = 0;
//         m[ 4] = -s;
//         m[ 5] = c;
//         m[ 6] = 0;
//         m[ 7] = 0;
//         m[ 8] = 0;
//         m[ 9] = 0;
//         m[10] = 1;
//         m[11] = 0;
//         m[12] = 0;
//         m[13] = 0;
//         m[14] = 0;
//         m[15] = 1;
//         return m;
//     },

// //     translate(x, y, z) {
// //         const m = new Float32Array(16);
// //         m[ 0] = 1;
// //         m[ 1] = 0;
// //         m[ 2] = 0;
// //         m[ 3] = 0;

// //         m[ 4] = 0;
// //         m[ 5] = 1;
// //         m[ 6] = 0;
// //         m[ 7] = 0;

// //         m[ 8] = 0;
// //         m[ 9] = 0;
// //         m[10] = 1;
// //         m[11] = 0;

// //         m[12] = x;
// //         m[13] = y;
// //         m[14] = z;
// //         m[15] = 1;
// //         return m;
// //     },
// }

// var cellnoise = (x) => 
// {
//   let n = Math.floor(x) | 0; 
//   n = (n << 13) ^ n;  n &= 0xffffffff;
//   let m = n;
//   n = n * 15731;      n &= 0xffffffff;
//   n = n * m;          n &= 0xffffffff;
//   n = n + 789221;     n &= 0xffffffff;
//   n = n * m;          n &= 0xffffffff; 
//   n = n + 1376312589; n &= 0xffffffff;
//   n = (n>>14) & 65535;
//   return n/65535.0;
// }

// var noise1D = (x) =>
// {
//   const i = Math.floor(x) | 0;
//   const f = x - i;
//   const w = f*f*f*(f*(f*6.0-15.0)+10.0);
//   const a = (2.0*cellnoise( i+0 )-1.0)*(f+0.0);
//   const b = (2.0*cellnoise( i+1 )-1.0)*(f-1.0);
//   return 2.0*(a + (b-a)*w);
// }

// var bumpy = (x) => {
//     return Math.sin(x * (2 * Math.PI) - Math.PI / 2) * 0.5 + 0.5;
// }
