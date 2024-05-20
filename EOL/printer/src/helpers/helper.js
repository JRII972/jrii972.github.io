
export const measureText = (ctx, text) => {
    let metrics = ctx.measureText(text)
    return {
      width: Math.floor(metrics.width),
      height: Math.floor(metrics.fontBoundingBoxAscent + metrics.fontBoundingBoxDescent),
      actualHeight: Math.floor(metrics.actualBoundingBoxAscent + metrics.actualBoundingBoxDescent)
    }
  }