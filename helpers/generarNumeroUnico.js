function generarNumeroUnico(longitud) {
    const numeroAzar = Math.floor(Date.now() * Math.random() * Math.pow(10, longitud));
    return String(numeroAzar).slice(0, longitud);
  }

export default generarNumeroUnico